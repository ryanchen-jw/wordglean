import { useState } from 'react'
import { AccountEntry } from './auth/AccountEntry'
import { authConfigFromEnv } from './auth/config'
import { createDb } from './data/db'

// 佔位頁：設計定版（TASK-3）前不做任何畫面；文字與 testid 是 smoke 測試的識別字串
function App() {
  // 未設定 Supabase 時不顯示登入入口（TASK-20 AC#3）
  const [authConfig] = useState(() => authConfigFromEnv(import.meta.env))
  // TODO(TASK-11)：改用 app 全域 db 單例（appDb），帳號區塊移到設定頁
  const [db] = useState(createDb)
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <p data-testid="app-placeholder" className="text-body">
        LinguaApp 骨架建置中
      </p>
      {authConfig && <AccountEntry config={authConfig} db={db} />}
    </main>
  )
}

export default App
