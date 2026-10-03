/// <reference types="node" />
// TASK-21 AC#2：「授權與致謝」頁的條目必須與 repo 根 NOTICE 完全一致（同名、同順序）。
// NOTICE 的條目＝縮排 ≤2 的「- 」行；條目名＝該行到第一個「（」「，」「：」為止。
// 更深縮排的「- 」是條目內的補充清單，群組說明行（不以「- 」開頭）不是條目。
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LicensesScreen } from './LicensesScreen'

export function noticeEntries(notice: string): string[] {
  return notice
    .split(/\r?\n/)
    .map((line) => /^ {0,2}- (.+)$/.exec(line)?.[1])
    .filter((rest): rest is string => rest !== undefined)
    .map((rest) => rest.split(/[（，：]/)[0].trim())
}

const NOTICE = readFileSync(join(process.cwd(), '..', 'NOTICE'), 'utf8')

const pageEntries = () => screen.getAllByTestId('credit-name').map((el) => el.textContent?.trim())

describe('NOTICE 條目解析', () => {
  it('只取縮排 ≤2 的條目行，名稱截到第一個全形括號、逗號或冒號', () => {
    const text = [
      '== 甲 ==',
      '',
      '- Foo 1.2（MIT）：https://example.com',
      '  授權：MIT',
      '分組說明（不是條目）：',
      '  - 模型 Bar，Copyright X',
      '            - 引用清單（不是條目）：…',
      '- 題庫 JSON（content/items/）',
    ].join('\n')
    expect(noticeEntries(text)).toEqual(['Foo 1.2', '模型 Bar', '題庫 JSON'])
  })
})

describe('授權與致謝頁 ↔ NOTICE', () => {
  it('頁面列出的條目與 NOTICE 完全一致（NOTICE 多一條或頁面少一條都失敗）', () => {
    render(<LicensesScreen />)
    expect(pageEntries()).toEqual(noticeEntries(NOTICE))
  })

  it('任務卡指定必列的來源都在頁面上', () => {
    render(<LicensesScreen />)
    const names = pageEntries()
    for (const must of [
      'eSpeak NG',
      '@huggingface/transformers 3.8.1',
      'ECDICT',
      'LibreLingo answer-corrector',
      '模型 Kokoro-82M',
      '模型 Moonshine tiny',
    ])
      expect(names).toContain(must)
    // ECDICT 的 lemma.en.txt：NOTICE 記載「未使用」，頁面要照實說明
    expect(screen.getByText(/lemma\.en\.txt/)).toHaveTextContent('沒有使用')
  })
})

describe('純閱讀頁的鍵盤捲動（TASK-22 無障礙：axe scrollable-region-focusable）', () => {
  it('授權與致謝的捲動區可用鍵盤聚焦，並以頁面標題命名', () => {
    render(<LicensesScreen />)
    expect(screen.getByRole('main', { name: '授權與致謝' })).toHaveAttribute('tabindex', '0')
  })
})
