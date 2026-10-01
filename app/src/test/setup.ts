import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest 未開 globals，Testing Library 無法自動在每個測試後卸載畫面
afterEach(cleanup)
