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
})
