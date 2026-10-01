import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 字體自 host（components.md「字體與自 host」）：依 unicode-range 分片，只下載用到的字
import '@fontsource-variable/noto-sans-tc'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/noto-sans'
import './index.css'
import App from './App.tsx'
import { applyPrefs, readPrefs } from './shell/prefs'

// 先套外觀與字級再渲染，避免閃一下預設樣式
applyPrefs(readPrefs())

// e2e 專用測試掛鉤（TASK-20）；一般建置此判斷為常數 false，整段被移除
if (import.meta.env.VITE_E2E_HOOKS === 'true') void import('./testHooks')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
