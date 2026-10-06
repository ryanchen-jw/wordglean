// TASK-25 品牌定版：App 外、使用者或散布者看得到的名稱（登入驗證碼信、NOTICE 著作權行）
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import messages from './i18n/zh-TW.json'

const root = (p: string) => readFileSync(resolve(process.cwd(), '..', p), 'utf-8')

describe('品牌名稱（TASK-25）', () => {
  it('登入驗證碼信：主旨與內文標題為「拾字 登入驗證碼」', () => {
    expect(root('supabase/config.toml').match(/^subject = "[^"\r\n]*"/gm)).toEqual([
      'subject = "拾字 登入驗證碼"',
      'subject = "拾字 登入驗證碼"',
    ])
    const otp = root('supabase/templates/otp.html')
    expect(otp).toContain('<h2>拾字 登入驗證碼</h2>')
    expect(otp).not.toContain('LinguaApp')
  })

  it('NOTICE 著作權行為 Wordglean contributors', () => {
    expect(root('NOTICE').split(/\r?\n/).slice(0, 2)).toEqual([
      '拾字（Wordglean）',
      'Copyright (C) 2026 Wordglean contributors',
    ])
  })

  it('同意說明的期限寫成「只到你關掉拾字為止」', () => {
    expect(messages.speak.fallback.body).toContain('這次同意只到你關掉拾字為止')
    expect(messages.privacy.voice.body).toContain('這項同意只到你關掉拾字為止')
  })
})
