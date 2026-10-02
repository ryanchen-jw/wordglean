// 有設定登入時才掛上；Supabase 與同步程式拆成獨立 chunk 動態載入（不在首屏主檔；PWA precache 仍會背景快取它）
import { useEffect, useState } from 'react'
import type { LinguaDb } from '../data/db'
import { AccountPanel } from './AccountPanel'
import type { AuthConfig } from './config'
import type { AuthApi } from './session'
import { getAuthSession } from './sessionHandle'

// 可獨立掛載：TASK-11 的設定頁帳號區塊直接傳入 app 全域 db 即可
export function AccountEntry({ config, db }: { config: AuthConfig; db: LinguaDb }) {
  const [auth, setAuth] = useState<AuthApi | null>(null)
  useEffect(() => {
    let alive = true
    void getAuthSession(config, db).then((a) => alive && setAuth(a))
    return () => {
      alive = false
    }
  }, [config, db])
  return auth && <AccountPanel auth={auth} />
}
