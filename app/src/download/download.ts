// 模型與字典下載的狀態型別（骨架）：真下載由 TASK-13（高音質發音）、TASK-14（語音辨識）、TASK-16（字典）接上
export type DownloadId = 'tts-hq' | 'stt'

export type DownloadStatus =
  | { kind: 'notDownloaded' }
  | { kind: 'downloading'; progress: number } // 0–1
  | { kind: 'downloaded' }
  | { kind: 'failed' }

/** 目前一律回報未下載；接上真下載後改為讀實際狀態 */
export function useDownloadStatus(id: DownloadId): DownloadStatus {
  void id
  return { kind: 'notDownloaded' }
}
