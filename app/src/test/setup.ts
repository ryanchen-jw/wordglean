import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest 未開 globals，Testing Library 無法自動在每個測試後卸載畫面
afterEach(cleanup)

// findBy／waitFor 預設只等 1 秒：全套平行跑、CPU 吃緊時，需載入課綱與 IndexedDB 的畫面偶爾超過
// （TASK-13 實測首頁測試單跑 74–541ms、全套掉在 1024–1061ms 逾時）；放寬到 3 秒，斷言本身不變
configure({ asyncUtilTimeout: 3000 })
