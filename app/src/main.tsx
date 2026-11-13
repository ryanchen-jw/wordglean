import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 字體自 host（components.md「字體與自 host」）：依 unicode-range 分片，只下載用到的字
import '@fontsource-variable/noto-sans-tc'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/noto-sans'
import './index.css'
import App from './App.tsx'
import { db } from './data/appDb'
import { refreshModel, refreshModelIfStale } from './llm/startup'
import { applyPrefs, readPrefs } from './shell/prefs'
import { watchFirstInteraction } from './sound/sfx'
import { cleanupLegacyHqVoice } from './speech/legacyCleanup'

// 先套外觀與字級再渲染，避免閃一下預設樣式
applyPrefs(readPrefs())

// 音效：瀏覽器規定使用者互動前不播，這裡開始記第一次點按
watchFirstInteraction()

// 已連結 OpenRouter 時確認選定的模型還在（下架就換回預設）；失敗不影響使用
void refreshModel(db).catch((e: unknown) => console.warn('[openrouter] 模型檢查失敗', e))
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return
  void refreshModelIfStale(db).catch((e: unknown) => console.warn('[openrouter] 模型檢查失敗', e))
})

// 舊版高音質發音（TASK-35 移除）留下的模型快取與旗標：清一次就好，失敗下次開啟再試
void cleanupLegacyHqVoice().catch((e: unknown) => console.warn('[tts] 清除舊高音質快取失敗', e))

// e2e 專用測試掛鉤（TASK-20）；一般建置此判斷為常數 false，整段被移除
if (import.meta.env.VITE_E2E_HOOKS === 'true') void import('./testHooks')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
