import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyPrefs, clearPrefs, DEFAULT_PREFS, readPrefs, savePref } from './prefs'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('外觀與字級偏好（D7）', () => {
  it('沒存過＝跟隨系統、標準字級', () => {
    expect(readPrefs()).toEqual({ theme: 'system', textSize: 'md' })
  })

  it('存了就讀得回來；不認得的值退回預設', () => {
    savePref('theme', 'dark')
    savePref('textSize', 'xl')
    expect(readPrefs()).toEqual({ theme: 'dark', textSize: 'xl' })
    localStorage.setItem('lg.theme', 'purple')
    expect(readPrefs().theme).toBe('system')
  })

  it('localStorage 讀寫丟例外時不中斷、用預設值', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => savePref('theme', 'dark')).not.toThrow()
    expect(readPrefs()).toEqual(DEFAULT_PREFS)
  })

  it('套到 <html> 的 data 屬性；跟隨系統與標準字級時移除屬性', () => {
    const root = document.createElement('html')
    applyPrefs({ theme: 'dark', textSize: 'lg' }, root)
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(root.getAttribute('data-text-size')).toBe('lg')
    applyPrefs({ theme: 'system', textSize: 'md' }, root)
    expect(root.hasAttribute('data-theme')).toBe(false)
    expect(root.hasAttribute('data-text-size')).toBe(false)
  })

  it('清除後回到預設', () => {
    savePref('theme', 'light')
    clearPrefs()
    expect(readPrefs()).toEqual(DEFAULT_PREFS)
  })
})
