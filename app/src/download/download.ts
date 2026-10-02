// 模型與字典下載的狀態型別：高音質發音（tts-hq）接 TASK-13 的真下載；語音辨識（stt）由 TASK-14 接上
import { useSyncExternalStore } from 'react'
import { hqVoice } from '../speech/speak'

export type DownloadId = 'tts-hq' | 'stt'

export type DownloadStatus =
  | { kind: 'notDownloaded' }
  | { kind: 'downloading'; progress: number } // 0–1
  | { kind: 'downloaded' }
  | { kind: 'failed' }
  | { kind: 'unsupported' } // 這支手機不能用（高音質發音需要 WebGPU）

const NOT_DOWNLOADED: DownloadStatus = { kind: 'notDownloaded' }
const noSubscribe = () => () => {}

export function useDownloadStatus(id: DownloadId): DownloadStatus {
  return useSyncExternalStore(id === 'tts-hq' ? hqVoice.subscribe : noSubscribe, () =>
    id === 'tts-hq' ? hqVoice.status() : NOT_DOWNLOADED,
  )
}
