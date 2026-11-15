// TASK-14 AC#4（單元）：Web Speech 後備沒同意前不建立 SpeechRecognition；同意只在這個實例（這次開 App）有效
import { describe, expect, it } from 'vitest'
import { fakeRecognition } from './fakeRecognition'
import { MicDeniedError } from './mic'
import { createWebSpeech } from './webSpeech'

describe('createWebSpeech', () => {
  it('瀏覽器沒有 SpeechRecognition＝不支援', () => {
    expect(createWebSpeech(() => undefined).supported()).toBe(false)
  })

  it('沒同意：start 被拒，且完全沒有建立 SpeechRecognition（不會開始收音或上傳）', async () => {
    const f = fakeRecognition({ texts: ['hello'] })
    const ws = createWebSpeech(() => f.Ctor)
    expect(ws.supported()).toBe(true)
    expect(ws.consented()).toBe(false)
    await expect(ws.start()).rejects.toThrow('尚未同意')
    expect(f.made).toHaveLength(0)
  })

  it('同意後：以美式英文、連續模式、只取定稿結果開始；結束回傳辨識文字', async () => {
    const f = fakeRecognition({ texts: ['  Could we push the meeting  '] })
    const ws = createWebSpeech(() => f.Ctor)
    ws.consent()
    const take = await ws.start()
    expect(f.made).toHaveLength(1)
    expect(f.made[0]).toMatchObject({ lang: 'en-US', continuous: true, interimResults: false })
    await expect(take.stop()).resolves.toBe('Could we push the meeting')
  })

  it('同意只存在這個實例：重新建立（重開 App）要再問', () => {
    const f = fakeRecognition()
    createWebSpeech(() => f.Ctor).consent()
    expect(createWebSpeech(() => f.Ctor).consented()).toBe(false)
  })

  it('麥克風被拒 → MicDeniedError', async () => {
    const ws = createWebSpeech(() => fakeRecognition({ deny: true }).Ctor)
    ws.consent()
    await expect(ws.start()).rejects.toBeInstanceOf(MicDeniedError)
  })

  it('沒聽到聲音不算錯：回空字串', async () => {
    const ws = createWebSpeech(() => fakeRecognition().Ctor)
    ws.consent()
    const take = await ws.start()
    await expect(take.stop()).resolves.toBe('')
  })

  describe('startLive（即時後備，TASK-40）', () => {
    it('沒同意：被拒且不建立 SpeechRecognition', async () => {
      const f = fakeRecognition()
      const ws = createWebSpeech(() => f.Ctor)
      await expect(
        ws.startLive(
          () => {},
          () => {},
        ),
      ).rejects.toThrow('尚未同意')
      expect(f.made).toHaveLength(0)
    })

    it('開中間結果；每次結果回呼目前這段的文字（含未定稿）', async () => {
      const f = fakeRecognition()
      const ws = createWebSpeech(() => f.Ctor)
      ws.consent()
      const heard: string[] = []
      await ws.startLive(
        (t) => heard.push(t),
        () => {},
      )
      expect(f.made[0]).toMatchObject({ lang: 'en-US', continuous: true, interimResults: true })
      f.made[0].emit([{ text: ' I want', isFinal: false }])
      f.made[0].emit([
        { text: 'I want to eat', isFinal: true },
        { text: ' dinner', isFinal: false },
      ])
      expect(heard).toEqual(['I want', 'dinner'])
    })

    it('瀏覽器自己結束（靜音逾時）時自動重新開始；stop 後不再回呼、不重開', async () => {
      const f = fakeRecognition()
      const ws = createWebSpeech(() => f.Ctor)
      ws.consent()
      const heard: string[] = []
      let ended = 0
      const live = await ws.startLive(
        (t) => heard.push(t),
        () => ended++,
      )
      f.made[0].end()
      await Promise.resolve()
      expect(f.made[0].starts).toBe(2)
      live.stop()
      expect(f.made[0].aborted).toBe(true)
      f.made[0].emit([{ text: 'late', isFinal: false }])
      f.made[0].end()
      await Promise.resolve()
      expect(heard).toEqual([])
      expect(f.made[0].starts).toBe(2)
      expect(ended).toBe(0)
    })

    it('錄音中出錯（非沒聲音）：結束並回報錯誤；被拒轉成 MicDeniedError', async () => {
      const f = fakeRecognition()
      const ws = createWebSpeech(() => f.Ctor)
      ws.consent()
      const errors: unknown[] = []
      await ws.startLive(
        () => {},
        (e) => errors.push(e),
      )
      f.made[0].fail('no-speech')
      f.made[0].end()
      await Promise.resolve()
      expect(errors).toEqual([])
      f.made[0].fail('not-allowed')
      f.made[0].end()
      await Promise.resolve()
      expect(errors[0]).toBeInstanceOf(MicDeniedError)
    })

    it('麥克風被拒 → MicDeniedError', async () => {
      const ws = createWebSpeech(() => fakeRecognition({ deny: true }).Ctor)
      ws.consent()
      await expect(
        ws.startLive(
          () => {},
          () => {},
        ),
      ).rejects.toBeInstanceOf(MicDeniedError)
    })
  })
})
