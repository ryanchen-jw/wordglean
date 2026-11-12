// 模型與字典下載的狀態型別：高音質發音（tts-hq）接 TASK-13、語音辨識（stt）接 TASK-14 的真下載
import { useEffect, useSyncExternalStore } from 'react'
import { stt, sttDownloadStatus } from '../speech/stt'
import { hqVoice } from '../speech/speak'

export type DownloadId = 'tts-hq' | 'stt'

/** 高音質發音失敗的原因類型（TASK-34）：worker＝Worker 起不來或崩潰、error＝下載或模型載入回報錯誤、
 * timeout＝久無回音、crashed＝載入途中頁面被系統關掉（重開後才知道） */
export type HqFailReason = 'worker' | 'error' | 'timeout' | 'crashed'

export type DownloadStatus =
  | { kind: 'notDownloaded' }
  | { kind: 'downloading'; progress: number } // 0–1
  | { kind: 'downloaded' }
  | { kind: 'failed'; reason?: HqFailReason }
  | { kind: 'unsupported' } // 這支手機不能用（高音質發音需要 WebGPU）

const NOT_DOWNLOADED: DownloadStatus = { kind: 'notDownloaded' }
const noSubscribe = () => () => {}

export function useDownloadStatus(id: DownloadId): DownloadStatus {
  const sttState = useSyncExternalStore(stt.subscribe, stt.get)
  useEffect(() => {
    if (id === 'stt') void stt.refresh()
  }, [id])
  const hq = useSyncExternalStore(id === 'tts-hq' ? hqVoice.subscribe : noSubscribe, () =>
    id === 'tts-hq' ? hqVoice.status() : NOT_DOWNLOADED,
  )
  return id === 'stt' ? sttDownloadStatus(sttState) : hq
}
