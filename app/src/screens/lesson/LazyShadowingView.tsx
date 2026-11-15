// 跟讀題（TASK-40）延遲載入：即時跟讀畫面、比對與辨識迴圈、整句錄音畫面都只在出到跟讀題時才載（首屏 JS 不增加）；
// 載入前題目區先空著（檔案由 service worker 預快取，離線也拿得到）
import { lazy, Suspense } from 'react'
import type { ShadowingItem } from '../../lesson/items'
import type { QuestionProps } from './types'

const LiveShadowingView = lazy(() =>
  import('./LiveShadowingView').then((m) => ({ default: m.LiveShadowingView })),
)

export function LazyShadowingView(props: QuestionProps<ShadowingItem>) {
  return (
    <Suspense fallback={null}>
      <LiveShadowingView {...props} />
    </Suspense>
  )
}
