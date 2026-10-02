// 手機內建聲音（speechSynthesis）引擎：英文、語速、先停再念、念完才 resolve
import { afterEach, describe, expect, it, vi } from 'vitest'
import { systemVoice } from './systemVoice'

class FakeUtterance {
  lang = ''
  rate = 1
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  text: string
  constructor(text: string) {
    this.text = text
  }
}

function install() {
  const spoken: FakeUtterance[] = []
  const synth = {
    cancel: vi.fn(),
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
  }
  vi.stubGlobal('speechSynthesis', synth)
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  return { synth, spoken }
}

afterEach(() => vi.unstubAllGlobals())

describe('systemVoice', () => {
  it('瀏覽器沒有 speechSynthesis 時回 null', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    expect(systemVoice()).toBeNull()
  })

  it('以 en-US 與指定語速念，念完才 resolve', async () => {
    const { synth, spoken } = install()
    const done = vi.fn()
    const p = systemVoice()!.speak('Slow down.', 0.8).then(done)
    expect(synth.speak).toHaveBeenCalledTimes(1)
    expect(spoken[0]).toMatchObject({ text: 'Slow down.', lang: 'en-US', rate: 0.8 })
    await Promise.resolve()
    expect(done).not.toHaveBeenCalled()
    spoken[0].onend!()
    await p
    expect(done).toHaveBeenCalled()
  })

  it('念錯（被取消或引擎錯誤）也 resolve，不卡住按鈕', async () => {
    const { spoken } = install()
    const p = systemVoice()!.speak('Hi.', 1)
    spoken[0].onerror!()
    await expect(p).resolves.toBeUndefined()
  })

  it('cancel 停掉正在念的', () => {
    const { synth } = install()
    systemVoice()!.cancel()
    expect(synth.cancel).toHaveBeenCalled()
  })
})
