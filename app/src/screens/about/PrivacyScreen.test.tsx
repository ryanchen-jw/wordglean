/// <reference types="node" />
// TASK-21：App 內隱私說明與 repo 的 docs/privacy.md 內容一致——每一條的標題與內文、非法律文件聲明都要逐字出現在 md
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import messages from '../../i18n/zh-TW.json'
import { PrivacyScreen } from './PrivacyScreen'
import { PRIVACY_ITEMS } from './privacyItems'

const MD = readFileSync(join(process.cwd(), '..', 'docs', 'privacy.md'), 'utf8')
const { privacy } = messages

describe('隱私說明', () => {
  it('頁面依序列出每一條，並標示不是法律文件', () => {
    render(<PrivacyScreen />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(
      PRIVACY_ITEMS.map((id) => privacy[id].title),
    )
    expect(screen.getByText(/不具法律效力/)).toBeInTheDocument()
  })

  it('App 內的條目與 docs/privacy.md 一致（標題、內文逐字相同，md 不多也不少）', () => {
    expect(Object.keys(privacy).filter((k) => k !== 'page')).toEqual([...PRIVACY_ITEMS])
    expect(MD).toContain(privacy.page.disclaimer)
    for (const id of PRIVACY_ITEMS) {
      expect(MD).toContain(`## ${privacy[id].title}\n\n${privacy[id].body}\n`)
    }
    expect(MD.match(/^## /gm)).toHaveLength(PRIVACY_ITEMS.length)
  })
})
