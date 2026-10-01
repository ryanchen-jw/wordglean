import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// e2e 專用測試掛鉤（TASK-20）；一般建置此判斷為常數 false，整段被移除
if (import.meta.env.VITE_E2E_HOOKS === 'true') void import('./testHooks')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
