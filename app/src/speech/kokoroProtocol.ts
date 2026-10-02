// 主執行緒 ↔ Kokoro Worker 的訊息格式
export type WorkerIn = { type: 'load' } | { type: 'speak'; id: number; text: string; speed: number }

export type WorkerOut =
  | { type: 'progress'; progress: number }
  | { type: 'ready' }
  | { type: 'error'; message: string }
  | { type: 'audio'; id: number; wav: ArrayBuffer }
  | { type: 'speakError'; id: number; message: string }

export interface WorkerLike {
  postMessage(m: WorkerIn): void
  onmessage: ((e: MessageEvent<WorkerOut>) => void) | null
  /** Worker 腳本載不到（例如 404）或執行中拋錯 */
  onerror: ((e: ErrorEvent) => void) | null
  onmessageerror: ((e: MessageEvent) => void) | null
  terminate(): void
}
