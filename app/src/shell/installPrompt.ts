// 加入主畫面提示（D2）：Android／Chromium 用 beforeinstallprompt 叫出系統安裝框；iOS Safari 沒有此事件，改顯示操作說明。
// 已是 App 模式開啟、或使用者關過提示，就不再顯示。事件可能在畫面掛上前觸發，所以在模組載入時就開始監聽。
import { useSyncExternalStore } from 'react'

export type InstallState = { kind: 'hidden' } | { kind: 'prompt' } | { kind: 'ios' }

interface DeferredPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface InstallWindow {
  navigator: { userAgent: string; maxTouchPoints?: number; standalone?: boolean }
  matchMedia: (q: string) => { matches: boolean }
  localStorage: Pick<Storage, 'getItem' | 'setItem'>
  addEventListener: (type: string, fn: (e: Event) => void) => void
}

export const DISMISS_KEY = 'lg.installDismissed'
const HIDDEN: InstallState = { kind: 'hidden' }

// iPhone／iPad 的 Safari（iPadOS 會偽裝成 Mac，以觸控點數辨認）；其他 iOS 瀏覽器不能加入主畫面
function isIosSafari(nav: InstallWindow['navigator']) {
  const ua = nav.userAgent
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && (nav.maxTouchPoints ?? 0) > 1)
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
}

export function createInstallPrompt(win: InstallWindow) {
  const listeners = new Set<() => void>()
  let deferred: DeferredPrompt | null = null
  let installed = false

  const dismissed = () => {
    try {
      return win.localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  }
  // matchMedia 不存在（jsdom）時視為非 App 模式
  const standalone = () =>
    (typeof win.matchMedia === 'function' &&
      win.matchMedia('(display-mode: standalone)').matches) ||
    win.navigator.standalone === true

  let state: InstallState = HIDDEN
  const compute = (): InstallState => {
    if (installed || standalone() || dismissed()) return HIDDEN
    if (deferred) return { kind: 'prompt' }
    return isIosSafari(win.navigator) ? { kind: 'ios' } : HIDDEN
  }
  const update = () => {
    const next = compute()
    if (next.kind !== state.kind) {
      state = next
      listeners.forEach((l) => l())
    }
  }

  win.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // 不讓瀏覽器自己跳迷你資訊列，由首頁卡片決定時機
    deferred = e as DeferredPrompt
    update()
  })
  win.addEventListener('appinstalled', () => {
    installed = true
    deferred = null
    update()
  })
  state = compute()

  return {
    getState: () => state,
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    /** 叫出系統安裝框；不論接受與否，這次的事件都不能再用 */
    async install() {
      const e = deferred
      if (!e) return
      deferred = null
      await e.prompt()
      if ((await e.userChoice).outcome === 'accepted') installed = true
      update()
    },
    dismiss() {
      try {
        win.localStorage.setItem(DISMISS_KEY, '1')
      } catch {
        // 存不下就只在這次開啟期間隱藏
      }
      deferred = null
      installed = true
      update()
    },
  }
}

export type InstallPrompt = ReturnType<typeof createInstallPrompt>

export const installPrompt = createInstallPrompt(window)

export function useInstallPrompt(store: InstallPrompt = installPrompt): InstallState {
  return useSyncExternalStore(store.subscribe, store.getState)
}
