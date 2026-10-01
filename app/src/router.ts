// 最小 history 路由：pathname 即狀態；history.state.idx 記站內深度，返回鍵據此決定 back() 或回首頁
import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('popstate', notify)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('popstate', notify)
  }
}

const currentIdx = (): number => (history.state as { idx?: number } | null)?.idx ?? 0

export function navigate(to: string, { replace = false } = {}) {
  if (replace) history.replaceState({ idx: currentIdx() }, '', to)
  else history.pushState({ idx: currentIdx() + 1 }, '', to)
  notify()
}

/** 返回上一頁；從外部直接開啟子頁（無站內上一頁）時回首頁 */
export function goBack() {
  if (currentIdx() > 0) history.back()
  else navigate('/', { replace: true })
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => location.pathname)
}
