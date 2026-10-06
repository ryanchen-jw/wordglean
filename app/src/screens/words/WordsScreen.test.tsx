import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/appDb'
import type { PoolWord } from '../../data/db'
import { DictionaryProvider } from '../../dict/DictionaryProvider'
import type { LessonItemsDoc } from '../../lesson/items'
import { CardState } from '../../srs/scheduler'
import { fsDictDeps } from '../../test/dictFs'
import { WordsScreen } from './WordsScreen'

const DAY = 86_400_000

const word = (wordId: string, p: Partial<PoolWord> = {}): PoolWord => ({
  wordId,
  state: CardState.Review,
  due: Date.now() + 10 * DAY,
  stability: 5,
  difficulty: 5,
  scheduledDays: 5,
  learningSteps: 0,
  reps: 3,
  lapses: 0,
  lastReview: null,
  courseRefs: ['a1-u01-l01'], // 有來源才算在池中（TASK-16 D3）
  favoritedAt: null,
  addedAt: 0,
  ...p,
})

const listed = () =>
  within(screen.getByTestId('word-list'))
    .queryAllByRole('listitem')
    .map((li) => li.querySelector('[lang="en"]')?.textContent)

beforeEach(async () => {
  history.replaceState(null, '', '/words')
  await db.delete()
  await db.open()
})

// 期望文案取自設計 s09 與 zh-TW.json
describe('單字庫（s09）', () => {
  it('空的：空狀態與「去上第一課」', async () => {
    render(<WordsScreen />)
    expect(await screen.findByText('單字庫還是空的')).toBeInTheDocument()
    expect(screen.getByText('共 0 字')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '去上第一課' }))
    expect(location.pathname).toBe('/course')
  })

  it('預設：摘要、列表、收藏星號、今天到期標示', async () => {
    await db.wordPool.bulkPut([
      word('meeting', { due: Date.now() - DAY }),
      word('reschedule', { favoritedAt: 1 }),
      word('agenda', { state: CardState.New, due: 0 }),
    ])
    render(<WordsScreen />)
    expect(await screen.findByText('共 3 字・今天到期 1')).toBeInTheDocument()
    expect(listed()).toEqual(['meeting', 'reschedule', 'agenda'])
    expect(screen.getByText('今天到期')).toBeInTheDocument()
    expect(screen.getByLabelText('已收藏')).toBeInTheDocument()
    expect(screen.getByText('新字')).toBeInTheDocument()
  })

  it('分頁、熟悉度下拉、搜尋可疊加', async () => {
    await db.wordPool.bulkPut([
      word('meeting', { due: Date.now() - DAY }),
      word('reschedule', { favoritedAt: 1, stability: 30 }),
      word('rest', { favoritedAt: 2 }),
    ])
    render(<WordsScreen />)
    await screen.findByText('共 3 字・今天到期 1')

    fireEvent.click(screen.getByRole('button', { name: '到期' }))
    expect(screen.getByRole('button', { name: '到期' })).toHaveAttribute('aria-pressed', 'true')
    expect(listed()).toEqual(['meeting'])

    fireEvent.click(screen.getByRole('button', { name: '收藏' }))
    expect(listed()).toEqual(['reschedule', 'rest'])

    fireEvent.click(screen.getByRole('button', { name: '熟悉度：全部' }))
    fireEvent.click(screen.getByRole('option', { name: '已熟悉' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: '熟悉度：已熟悉' })).toBeInTheDocument()
    expect(listed()).toEqual(['reschedule'])

    fireEvent.click(screen.getByRole('button', { name: '熟悉度：已熟悉' }))
    fireEvent.click(screen.getByRole('option', { name: '全部' }))
    fireEvent.change(screen.getByRole('searchbox', { name: '搜尋英文或中文' }), {
      target: { value: 'res' },
    })
    expect(listed()).toEqual(['reschedule', 'rest'])
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xyz' } })
    expect(screen.getByText('沒有符合條件的單字')).toBeInTheDocument()
  })

  it('大量單字只先畫第一批', async () => {
    await db.wordPool.bulkPut(
      Array.from({ length: 120 }, (_, i) => word(`w${String(i).padStart(3, '0')}`)),
    )
    render(<WordsScreen />)
    await screen.findByText('共 120 字・今天到期 0')
    expect(listed()).toHaveLength(50)
  })

  describe('中文釋義與中文搜尋（TASK-16，補 TASK-11 D5）', () => {
    const loaded = fsDictDeps()
    const deps = () => Promise.resolve(loaded)
    const renderWithDict = () =>
      render(
        <DictionaryProvider deps={deps}>
          <WordsScreen />
        </DictionaryProvider>,
      )

    it('列表顯示短釋義（取自單字總表）；可用中文搜尋', async () => {
      await db.wordPool.bulkPut([word('postpone'), word('meeting', { due: Date.now() + 2 * DAY })])
      renderWithDict()
      expect(await screen.findByText('延遲')).toBeInTheDocument()
      expect(screen.getByText('會議')).toBeInTheDocument()
      fireEvent.change(screen.getByRole('searchbox', { name: '搜尋英文或中文' }), {
        target: { value: '延期' },
      })
      expect(listed()).toEqual(['postpone'])
    })

    it('列表的英文字可點查義', async () => {
      await db.wordPool.bulkPut([word('agenda')])
      renderWithDict()
      fireEvent.click(await screen.findByRole('button', { name: 'agenda' }))
      expect(await screen.findByRole('dialog', { name: '單字查義' })).toBeInTheDocument()
    })

    // 創辦人裁示（2026-10-03）①B：上過課的字顯示小課單字卡的第一義，字典義只給沒有單字卡的字
    describe('上過課的字顯示小課單字卡第一義', () => {
      const lesson = JSON.parse(
        readFileSync(resolve(process.cwd(), '../content/items/a1/a1-u01-l01.json'), 'utf-8'),
      ) as LessonItemsDoc
      const loadItems = async (id: string) => (id === 'a1-u01-l01' ? lesson : null)
      const renderWithItems = () =>
        render(
          <DictionaryProvider deps={deps}>
            <WordsScreen loadItems={loadItems} />
          </DictionaryProvider>,
        )

      it('a 顯示「一個」、the 顯示「那個」，不是字典第一義', async () => {
        await db.wordPool.bulkPut([word('a'), word('the')])
        renderWithItems()
        expect(await screen.findByText('一個')).toBeInTheDocument()
        expect(screen.getByText('那個')).toBeInTheDocument()
        expect(screen.queryByText('累加器')).toBeNull()
        expect(screen.queryByText('那')).toBeNull()
      })

      it('沒上課的收藏字仍顯示字典義', async () => {
        await db.wordPool.bulkPut([word('a'), word('postpone', { courseRefs: [], favoritedAt: 1 })])
        renderWithItems()
        expect(await screen.findByText('一個')).toBeInTheDocument()
        expect(await screen.findByText('延遲')).toBeInTheDocument()
      })

      it('中文搜尋比對小課釋義', async () => {
        await db.wordPool.bulkPut([word('a'), word('the')])
        renderWithItems()
        await screen.findByText('一個')
        fireEvent.change(screen.getByRole('searchbox', { name: '搜尋英文或中文' }), {
          target: { value: '一個' },
        })
        expect(listed()).toEqual(['a'])
        fireEvent.change(screen.getByRole('searchbox'), { target: { value: '這個' } })
        expect(listed()).toEqual(['the'])
      })
    })

    // 既有 bug（TASK-24 W5 修）：多字詞被空白拆開，查不到單字卡釋義
    it('多字詞（ice cream）與片語照整個字串取小課單字卡釋義', async () => {
      const card = (word: string, glossZh: string, n: number) => ({
        id: `a1-u09-l01-q0${n}`,
        type: 'wordCard' as const,
        word,
        exampleEn: `${word}.`,
        exampleZh: '例句。',
        glossZh,
        distractorsZh: ['甲', '乙', '丙'],
      })
      const doc: LessonItemsDoc = {
        schemaVersion: 1,
        lessonId: 'a1-u09-l01',
        level: 'A1',
        items: [card('ice cream', '冰淇淋', 1), card('give up', '放棄；屈服', 2)],
      }
      await db.wordPool.bulkPut([
        word('ice cream', { courseRefs: ['a1-u09-l01'] }),
        word('give up', { courseRefs: ['a1-u09-l01'] }),
      ])
      render(
        <DictionaryProvider deps={deps}>
          <WordsScreen loadItems={async (id) => (id === 'a1-u09-l01' ? doc : null)} />
        </DictionaryProvider>,
      )
      expect(await screen.findByText('冰淇淋')).toBeInTheDocument()
      expect(screen.getByText('放棄')).toBeInTheDocument()
    })

    it('收藏的片語（沒有課程來源）顯示片語表釋義', async () => {
      await db.wordPool.bulkPut([word('look after', { courseRefs: [], favoritedAt: 1 })])
      renderWithDict()
      expect(await screen.findByText('照顧')).toBeInTheDocument()
      expect(listed()).toEqual(['look after'])
    })

    it('沒有課程來源也沒收藏的字（取消收藏後）不列、不計數', async () => {
      await db.wordPool.bulkPut([word('meeting'), word('agenda', { courseRefs: [] })])
      renderWithDict()
      expect(await screen.findByText('共 1 字・今天到期 0')).toBeInTheDocument()
      expect(listed()).toEqual(['meeting'])
    })
  })
})
