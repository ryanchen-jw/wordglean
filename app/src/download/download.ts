// 模型下載的狀態型別：語音辨識（stt）接 TASK-14 的真下載
import { useEffect, useSyncExternalStore } from 'react'
import { stt, sttDownloadStatus } from '../speech/stt'

export type DownloadId = 'stt'

export type DownloadStatus =
  | { kind: 'notDownloaded' }
  | { kind: 'downloading'; progress: number } // 0–1
  | { kind: 'downloaded' }
  | { kind: 'failed' }

export function useDownloadStatus(id: DownloadId): DownloadStatus {
  const sttState = useSyncExternalStore(stt.subscribe, stt.get)
  useEffect(() => {
    if (id === 'stt') void stt.refresh()
  }, [id])
  return sttDownloadStatus(sttState)
}
