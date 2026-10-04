// 分級測驗 s10（勾選中／結果）＋重測狀態。期望文案取自設計 s10 與 zh-TW.json；
// 字的級距直接查已提交的題本 placement.json，不經計分程式
import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getSettings } from '../../data/repo'
import { PlacementScreen } from './PlacementScreen'

const bankText = readFileSync(
  resolve(process.cwd(), '../content/placement/placement.json'),
  'utf-8',
)
const bank = JSON.parse(bankText) as { levels: Record<string, string[]>; pseudowords: string[] }
const levelOf = (word: string) =>
  Object.entries(bank.levels).find(([, words]) => words.includes(word))?.[0] ?? null

beforeEach(async () => {
  vi.stubGlobal('fetch', async () => new Response(bankText))
  history.replaceState(null, '', '/placement')
  await db.delete()
  await db.open()
})

const boxes = () => screen.getAllByRole('checkbox')

/** 逐組作答：pick(word, level) 回傳 true 的字就勾；level 為 null＝假字 */
async function answerAll(pick: (word: string, level: string | null) => boolean) {
  for (let g = 1; g <= 5; g++) {
    await screen.findByText(`第 ${g}／5 組`)
    for (const box of boxes())
      if (pick(box.textContent!, levelOf(box.textContent!))) fireEvent.click(box)
    const checked = boxes().filter((b) => b.getAttribute('aria-checked') === 'true').length
    const label = g < 5 ? `下一組（已勾 ${checked} 個）` : `看結果（已勾 ${checked} 個）`
    fireEvent.click(screen.getByRole('button', { name: label }))
  }
}

describe('分級測驗（s10）', () => {
  it('勾選中：第 1／5 組、12 格、說明文字；點格子切換勾選並更新按鈕計數', async () => {
    render(<PlacementScreen />)
    expect(await screen.findByText('第 1／5 組')).toBeInTheDocument()
    expect(screen.getByText('勾選你「認識意思」的字')).toBeInTheDocument()
    expect(screen.getByText('不確定就不要勾；裡面混了幾個不存在的假字。')).toBeInTheDocument()
    expect(boxes()).toHaveLength(12)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    fireEvent.click(boxes()[0])
    expect(boxes()[0]).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('button', { name: '下一組（已勾 1 個）' })).toBeInTheDocument()
    fireEvent.click(boxes()[0])
    expect(boxes()[0]).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('button', { name: '下一組（已勾 0 個）' })).toBeInTheDocument()
  })

  it('五組共 60 字：每級 10 個真字＋10 個假字，不重複', async () => {
    render(<PlacementScreen />)
    const seen: string[] = []
    await answerAll((word) => {
      seen.push(word)
      return false
    })
    expect(new Set(seen).size).toBe(60)
    const counts: Record<string, number> = {}
    for (const w of seen) counts[levelOf(w) ?? 'pseudo'] = (counts[levelOf(w) ?? 'pseudo'] ?? 0) + 1
    expect(counts).toEqual({ A1: 10, A2: 10, B1: 10, B2: 10, C1: 10, pseudo: 10 })
  })

  it('結果：認識 A1–B1、不勾假字 → 起點 B2｜約多益 785+、五條長條、僅供參考；「從 B2 開始」寫入設定回首頁', async () => {
    render(<PlacementScreen />)
    await answerAll((_, level) => level === 'A1' || level === 'A2' || level === 'B1')
    expect(await screen.findByText('你的起點')).toBeInTheDocument()
    expect(screen.getByTestId('placement-level')).toHaveTextContent('B2')
    expect(screen.getByText('約多益 785+')).toBeInTheDocument()
    expect(
      screen.getByText('多益分數為聽力＋閱讀總分，依 ETS 官方的 CEFR 對照，僅供參考'),
    ).toBeInTheDocument()
    expect(screen.getByText('每一級你認識的字的比例')).toBeInTheDocument()
    const bars = within(screen.getByTestId('placement-bars'))
    for (const [level, pct] of [
      ['A1', '100%'],
      ['A2', '100%'],
      ['B1', '100%'],
      ['B2', '0%'],
      ['C1', '0%'],
    ])
      expect(bars.getByTestId(`bar-${level}`)).toHaveTextContent(`${level}${pct}`)
    expect(screen.queryByText(/假字/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '從 B2 開始' }))
    await waitFor(async () => expect((await getSettings(db)).cefrLevel).toBe('B2'))
    expect(location.pathname).toBe('/')
  })

  it('勾到 1 個假字：提示「結果已向下修正」', async () => {
    render(<PlacementScreen />)
    let pseudo = 0
    await answerAll((_, level) => level === 'A1' || (level === null && pseudo++ === 0))
    expect(await screen.findByText('勾到 1 個假字，結果已向下修正')).toBeInTheDocument()
  })

  it('全勾灌水：起點 A1、提示重新測驗；按「重新測驗」回到第 1 組、全部未勾', async () => {
    render(<PlacementScreen />)
    await answerAll(() => true)
    expect(
      await screen.findByText('勾到 10 個假字，這次結果不太準。建議重新測驗，或自己選級距。'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('placement-level')).toHaveTextContent('A1')
    expect(screen.queryByRole('button', { name: /開始$/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '重新測驗' }))
    expect(await screen.findByText('第 1／5 組')).toBeInTheDocument()
    expect(boxes().every((b) => b.getAttribute('aria-checked') === 'false')).toBe(true)
    expect((await getSettings(db)).cefrLevel).toBeNull()
  })

  it('想自己選級距：彈層選 C1 → 寫入設定回首頁', async () => {
    render(<PlacementScreen />)
    await answerAll(() => false)
    fireEvent.click(await screen.findByRole('button', { name: '想自己選級距' }))
    const sheet = screen.getByRole('dialog', { name: '目前級距' })
    fireEvent.click(within(sheet).getByRole('option', { name: 'C1｜約多益 945+' }))
    await waitFor(async () => expect((await getSettings(db)).cefrLevel).toBe('C1'))
    expect(location.pathname).toBe('/')
  })

  it('離開鈕：不寫設定、回首頁', async () => {
    render(<PlacementScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '離開' }))
    expect(location.pathname).toBe('/')
    expect((await getSettings(db)).cefrLevel).toBeNull()
  })
})
