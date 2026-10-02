// 麥克風：權限查詢、按鈕開始／結束錄音（不做靜音偵測，2026-10-01 裁示）、轉成 16 kHz 單聲道給辨識用
// 錄音只留在記憶體裡交給本機辨識，不寫檔、不上傳
import { SAMPLE_RATE } from './sttEngine'

export type MicPermission = 'granted' | 'prompt' | 'denied' | 'unsupported'

/** 使用者或系統拒絕了麥克風 */
export class MicDeniedError extends Error {
  constructor() {
    super('麥克風未允許')
  }
}

type AudioContextCtor = typeof AudioContext
const audioContextCtor = (): AudioContextCtor | undefined =>
  window.AudioContext ??
  (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext

export function micSupported(): boolean {
  return (
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined' &&
    !!audioContextCtor() &&
    typeof OfflineAudioContext !== 'undefined'
  )
}

/** 目前的麥克風權限；瀏覽器不支援查詢時當作「還沒問過」 */
export async function micPermission(): Promise<MicPermission> {
  if (!micSupported()) return 'unsupported'
  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    return status.state
  } catch {
    return 'prompt'
  }
}

/** 只要權限、不錄音（「允許麥克風」按鈕）；拿到就立刻關掉 */
export async function requestMic(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((t) => t.stop())
    return true
  } catch {
    return false
  }
}

export interface Recording {
  /** 結束錄音並回傳 16 kHz 單聲道樣本 */
  stop(): Promise<Float32Array>
  /** 放棄這次錄音（離開題目時） */
  cancel(): void
}

/** 開始錄音；onLevel 回報音量（0–1）供錄音鈕的音量條使用 */
export async function startRecording(onLevel?: (level: number) => void): Promise<Recording> {
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    const name = (e as DOMException)?.name
    if (name === 'NotAllowedError' || name === 'SecurityError') throw new MicDeniedError()
    throw e
  }

  const recorder = new MediaRecorder(stream)
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => chunks.push(e.data)
  recorder.start()

  const Ctx = audioContextCtor()!
  const meterCtx = new Ctx()
  const analyser = meterCtx.createAnalyser()
  analyser.fftSize = 512
  meterCtx.createMediaStreamSource(stream).connect(analyser)
  const buf = new Float32Array(analyser.fftSize)
  let raf = 0
  const tick = () => {
    analyser.getFloatTimeDomainData(buf)
    let sum = 0
    for (const v of buf) sum += v * v
    onLevel?.(Math.min(1, Math.sqrt(sum / buf.length) * 4))
    raf = requestAnimationFrame(tick)
  }
  if (onLevel) raf = requestAnimationFrame(tick)

  const cleanup = () => {
    cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop())
    void meterCtx.close()
  }

  return {
    stop: () =>
      new Promise((resolve, reject) => {
        recorder.onstop = () => {
          cleanup()
          new Blob(chunks, { type: recorder.mimeType })
            .arrayBuffer()
            .then(to16k)
            .then(resolve, reject)
        }
        recorder.stop()
      }),
    cancel() {
      recorder.onstop = null
      if (recorder.state !== 'inactive') recorder.stop()
      cleanup()
    },
  }
}

/** 任何瀏覽器能解碼的音訊 → 16 kHz 單聲道 */
export async function to16k(data: ArrayBuffer): Promise<Float32Array> {
  const ctx = new (audioContextCtor()!)()
  let decoded: AudioBuffer
  try {
    decoded = await ctx.decodeAudioData(data)
  } finally {
    void ctx.close()
  }
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * SAMPLE_RATE), SAMPLE_RATE)
  const src = off.createBufferSource()
  src.buffer = decoded
  src.connect(off.destination)
  src.start()
  return (await off.startRendering()).getChannelData(0)
}
