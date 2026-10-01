// 雲端存取介面；同步引擎只依賴此介面（單元測試注入假實作，正式為 supabaseRemote.ts）
import type { SyncSnapshot } from './merge'

export interface RemoteStore {
  /** 目前登入的帳號；未登入為 null */
  userId(): Promise<string | null>
  /**
   * 拉雲端資料。作答紀錄只回 cursor 之後新增的（cursor 為 null 則全部）；其餘表回全部。
   * 回傳的 cursor 由下次 pull 帶回，引擎不解讀其內容。
   */
  pull(cursor: string | null): Promise<{ snapshot: SyncSnapshot; cursor: string | null }>
  /** 推本機變更；作答紀錄與跟讀修正以 id 去重、重推無副作用 */
  push(changes: SyncSnapshot): Promise<void>
}
