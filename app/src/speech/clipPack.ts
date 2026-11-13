// 一課一包的音檔格式（TASK-35）：'LGA1'（4 bytes）＋ uint32LE 標頭長度 ＋ 標頭 JSON ＋ 依序串接的 MP3。
// content/audio-gen 寫、App 讀，共用本檔（同 clipKey.ts：不可 import 其他模組）

export interface PackHeader {
  v: 1
  /** 產生參數（模型、音色、位元率、裁切…）：與目前設定不同就整包重產 */
  gen: Record<string, unknown>
  /** 正規化後的文字 → [在資料區的位移, 長度] */
  clips: Record<string, [number, number]>
}

const MAGIC = 'LGA1'

export function encodePack(
  gen: PackHeader['gen'],
  clips: readonly { text: string; mp3: Uint8Array }[],
) {
  const header: PackHeader = { v: 1, gen, clips: {} }
  let off = 0
  for (const c of clips) {
    header.clips[c.text] = [off, c.mp3.length]
    off += c.mp3.length
  }
  const h = new TextEncoder().encode(JSON.stringify(header))
  const out = new Uint8Array(8 + h.length + off)
  out.set(new TextEncoder().encode(MAGIC), 0)
  new DataView(out.buffer).setUint32(4, h.length, true)
  out.set(h, 8)
  let at = 8 + h.length
  for (const c of clips) {
    out.set(c.mp3, at)
    at += c.mp3.length
  }
  return out
}

/** 解析整包；回傳標頭與每段的 MP3 位元組（不複製，是原 buffer 的切片） */
export function decodePack(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  if (new TextDecoder().decode(bytes.subarray(0, 4)) !== MAGIC) throw new Error('音檔包格式不符')
  const hlen = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(4, true)
  const header = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + hlen))) as PackHeader
  const base = 8 + hlen
  const clips = new Map<string, Uint8Array>()
  for (const [text, [off, len]] of Object.entries(header.clips))
    clips.set(text, bytes.subarray(base + off, base + off + len))
  return { header, clips }
}
