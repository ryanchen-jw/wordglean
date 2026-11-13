// 即時取樣（TASK-39，設計 §2.1）：getUserMedia → AudioContext → AudioWorklet，錄音中就拿到原始樣本，
// 放進環形緩衝（存裝置取樣率），讀取時才降到 16 kHz 單聲道給辨識。不改 mic.ts 的整句錄音（startRecording）。
// 錄音只留在記憶體裡交給本機辨識，不寫檔、不上傳
import { MicDeniedError } from './mic'
import { SAMPLE_RATE } from './sttEngine'

/** 固定容量的環形緩衝：只留最近 capacity 個樣本 */
export function createRing(capacity: number) {
  const buf = new Float32Array(capacity)
  let total = 0
  return {
    push(chunk: Float32Array) {
      const src = chunk.length > capacity ? chunk.subarray(chunk.length - capacity) : chunk
      const at = (total + chunk.length - src.length) % capacity
      const head = Math.min(src.length, capacity - at)
      buf.set(src.subarray(0, head), at)
      buf.set(src.subarray(head), 0)
      total += chunk.length
    },
    /** 最近 n 個樣本（不足就給全部），回傳新陣列 */
    latest(n: number): Float32Array {
      const len = Math.min(n, total, capacity)
      const out = new Float32Array(len)
      const start = (((total - len) % capacity) + capacity) % capacity
      const head = Math.min(len, capacity - start)
      out.set(buf.subarray(start, start + head))
      out.set(buf.subarray(0, len - head), head)
      return out
    },
    /** 累計收到的樣本數 */
    total: () => total,
  }
}

/** 降取樣：每個輸出樣本取對應區間的平均（簡易低通） */
export function downsample(input: Float32Array, fromRate: number, toRate = SAMPLE_RATE) {
  if (fromRate === toRate) return input.slice()
  const ratio = fromRate / toRate
  const out = new Float32Array(Math.floor(input.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const a = Math.floor(i * ratio)
    const b = Math.max(a + 1, Math.floor((i + 1) * ratio))
    let sum = 0
    for (let k = a; k < b; k++) sum += input[k]
    out[i] = sum / (b - a)
  }
  return out
}

/** 每 50 ms 一格的 RMS 取最大值（音量閘用：視窗內有沒有夠大的人聲） */
export function peakFrameRms(samples: Float32Array, frame = SAMPLE_RATE / 20): number {
  let peak = 0
  for (let s = 0; s < samples.length; s += frame) {
    const end = Math.min(samples.length, s + frame)
    let sum = 0
    for (let k = s; k < end; k++) sum += samples[k] * samples[k]
    peak = Math.max(peak, Math.sqrt(sum / (end - s)))
  }
  return peak
}

/** 辨識迴圈讀音訊的介面：麥克風與測試音檔都實作它 */
export interface LiveSource {
  /** 最近 seconds 秒的 16 kHz 樣本（新陣列，可轉移給 Worker） */
  read(seconds: number): Float32Array
  /** 已經收進來的秒數 */
  elapsed(): number
}

export interface LiveMic extends LiveSource {
  /** 最近 0.1 秒的音量（RMS，0–1） */
  level(): number
  stop(): void
}

// AudioWorklet：把每個 render quantum（128 樣本）的第一聲道湊滿約 2048 個再送回主執行緒
const WORKLET = `class LgTap extends AudioWorkletProcessor {
  constructor() { super(); this.buf = new Float32Array(2048); this.n = 0 }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0]
    if (ch) {
      this.buf.set(ch, this.n); this.n += ch.length
      if (this.n + 128 > this.buf.length) { this.port.postMessage(this.buf.slice(0, this.n)); this.n = 0 }
    }
    return true
  }
}
registerProcessor('lg-tap', LgTap)`

type AudioContextCtor = typeof AudioContext
const audioContextCtor = (): AudioContextCtor | undefined =>
  window.AudioContext ??
  (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext

export function liveMicSupported(): boolean {
  return (
    !!navigator.mediaDevices?.getUserMedia &&
    !!audioContextCtor() &&
    typeof AudioWorkletNode !== 'undefined'
  )
}

/** 開始即時取樣（需在使用者點擊中呼叫，iOS 才能啟動 AudioContext）；bufferSeconds＝環形緩衝長度 */
export async function startLiveMic(bufferSeconds = 8): Promise<LiveMic> {
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
    })
  } catch (e) {
    const name = (e as DOMException)?.name
    if (name === 'NotAllowedError' || name === 'SecurityError') throw new MicDeniedError()
    throw e
  }
  const ctx = new (audioContextCtor()!)()
  const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }))
  try {
    await ctx.audioWorklet.addModule(url)
  } catch (e) {
    stream.getTracks().forEach((t) => t.stop())
    void ctx.close()
    throw e
  } finally {
    URL.revokeObjectURL(url)
  }
  await ctx.resume()
  const rate = ctx.sampleRate
  const ring = createRing(Math.ceil(bufferSeconds * rate))
  const node = new AudioWorkletNode(ctx, 'lg-tap', { numberOfOutputs: 1 })
  node.port.onmessage = ({ data }: MessageEvent<Float32Array>) => ring.push(data)
  ctx.createMediaStreamSource(stream).connect(node)
  // 接到輸出才會被持續處理；節點不寫輸出＝無聲
  node.connect(ctx.destination)

  return {
    read: (seconds) => downsample(ring.latest(Math.round(seconds * rate)), rate),
    elapsed: () => ring.total() / rate,
    level() {
      const s = ring.latest(Math.round(rate / 10))
      return Math.min(1, peakFrameRms(s, s.length || 1))
    },
    stop() {
      node.port.onmessage = null
      node.disconnect()
      stream.getTracks().forEach((t) => t.stop())
      void ctx.close()
    },
  }
}
