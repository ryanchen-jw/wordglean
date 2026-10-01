import { describe, expect, it, vi } from 'vitest'
import { createInstallPrompt, DISMISS_KEY, type InstallWindow } from './installPrompt'

// 真實 UA 字串（Safari on iOS 17、Chrome on iOS、Chrome on Android）
const UA = {
  iosSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  iosChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
  android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
}

function fakeWindow(opts: { ua: string; standalone?: boolean; dismissed?: boolean }) {
  const handlers = new Map<string, (e: Event) => void>()
  const store = new Map<string, string>(opts.dismissed ? [[DISMISS_KEY, '1']] : [])
  const win: InstallWindow = {
    navigator: { userAgent: opts.ua, maxTouchPoints: 5 },
    matchMedia: () => ({ matches: !!opts.standalone }),
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => void store.set(k, v),
    },
    addEventListener: (type, fn) => handlers.set(type, fn),
  }
  const fire = (type: string, extra: object = {}) => {
    const e = Object.assign(new Event(type, { cancelable: true }), extra)
    handlers.get(type)!(e)
    return e
  }
  return { win, fire, store }
}

const promptEvent = (outcome: 'accepted' | 'dismissed') => ({
  prompt: vi.fn(async () => {}),
  userChoice: Promise.resolve({ outcome }),
})

describe('加入主畫面提示（D2）', () => {
  it('Android：收到 beforeinstallprompt 才顯示，並擋下瀏覽器自己的提示', () => {
    const { win, fire } = fakeWindow({ ua: UA.android })
    const p = createInstallPrompt(win)
    expect(p.getState()).toEqual({ kind: 'hidden' })
    const e = fire('beforeinstallprompt', promptEvent('accepted'))
    expect(e.defaultPrevented).toBe(true)
    expect(p.getState()).toEqual({ kind: 'prompt' })
  })

  it('按安裝：叫出系統安裝框；接受後隱藏', async () => {
    const { win, fire } = fakeWindow({ ua: UA.android })
    const p = createInstallPrompt(win)
    const ev = promptEvent('accepted')
    fire('beforeinstallprompt', ev)
    await p.install()
    expect(ev.prompt).toHaveBeenCalledOnce()
    expect(p.getState()).toEqual({ kind: 'hidden' })
  })

  it('系統安裝框按取消：事件用掉了、提示隱藏（等瀏覽器下次再給事件）', async () => {
    const { win, fire } = fakeWindow({ ua: UA.android })
    const p = createInstallPrompt(win)
    fire('beforeinstallprompt', promptEvent('dismissed'))
    await p.install()
    expect(p.getState()).toEqual({ kind: 'hidden' })
  })

  it('iOS Safari：沒有事件也顯示操作說明；iOS 上的 Chrome 不顯示', () => {
    expect(createInstallPrompt(fakeWindow({ ua: UA.iosSafari }).win).getState()).toEqual({
      kind: 'ios',
    })
    expect(createInstallPrompt(fakeWindow({ ua: UA.iosChrome }).win).getState()).toEqual({
      kind: 'hidden',
    })
  })

  it('已用 App 模式開啟時不顯示', () => {
    const { win, fire } = fakeWindow({ ua: UA.android, standalone: true })
    const p = createInstallPrompt(win)
    fire('beforeinstallprompt', promptEvent('accepted'))
    expect(p.getState()).toEqual({ kind: 'hidden' })
    expect(
      createInstallPrompt(fakeWindow({ ua: UA.iosSafari, standalone: true }).win).getState(),
    ).toEqual({ kind: 'hidden' })
  })

  it('關閉後記住、之後不再顯示', () => {
    const { win, store } = fakeWindow({ ua: UA.iosSafari })
    const p = createInstallPrompt(win)
    p.dismiss()
    expect(p.getState()).toEqual({ kind: 'hidden' })
    expect(store.get(DISMISS_KEY)).toBe('1')
    expect(
      createInstallPrompt(fakeWindow({ ua: UA.iosSafari, dismissed: true }).win).getState(),
    ).toEqual({ kind: 'hidden' })
  })

  it('安裝完成（appinstalled）後隱藏', () => {
    const { win, fire } = fakeWindow({ ua: UA.android })
    const p = createInstallPrompt(win)
    fire('beforeinstallprompt', promptEvent('accepted'))
    fire('appinstalled')
    expect(p.getState()).toEqual({ kind: 'hidden' })
  })

  it('localStorage 丟例外時照常運作', () => {
    const { win } = fakeWindow({ ua: UA.iosSafari })
    win.localStorage.getItem = () => {
      throw new Error('SecurityError')
    }
    win.localStorage.setItem = () => {
      throw new Error('SecurityError')
    }
    const p = createInstallPrompt(win)
    expect(p.getState()).toEqual({ kind: 'ios' })
    expect(() => p.dismiss()).not.toThrow()
    expect(p.getState()).toEqual({ kind: 'hidden' })
  })
})
