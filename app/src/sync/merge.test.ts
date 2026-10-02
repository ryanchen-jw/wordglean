// @vitest-environment node
import { createEmptyCard, fsrs, generatorParameters, type Card } from 'ts-fsrs'
import { describe, expect, it } from 'vitest'
import type { PoolWord, ReviewLogRow, Settings } from '../data/db'
import { CardState, createScheduler, Grade, type FsrsFields } from '../srs/scheduler'
import { mergeSnapshots, type SyncSnapshot } from './merge'

const MIN = 60_000
const DAY = 86_400_000
const T0 = Date.parse('2026-10-01T00:00:00Z')

const s = createScheduler()

type Event = { id: string; word: string; grade: Grade; at: number }

const empty = (): SyncSnapshot => ({
  settings: null,
  words: [],
  reviewLogs: [],
  courseProgress: [],
  speechCorrections: [],
})

/** 一台裝置依序作答：每次都用該裝置自己當下的卡片狀態（模擬離線各自學習） */
function play(start: SyncSnapshot, events: Event[]): SyncSnapshot {
  const snap = structuredClone(start)
  for (const e of events) {
    let w = snap.words.find((x) => x.wordId === e.word)
    if (!w) {
      w = { wordId: e.word, ...s.newCard(e.at), courseRefs: [], favoritedAt: null, addedAt: e.at }
      snap.words.push(w)
    }
    const { card, log } = s.review(w, e.grade, e.at)
    Object.assign(w, card)
    snap.reviewLogs.push({ id: e.id, wordId: e.word, ...log })
  }
  return snap
}

const fsrsOf = (w: PoolWord): FsrsFields => ({
  state: w.state,
  due: w.due,
  stability: w.stability,
  difficulty: w.difficulty,
  scheduledDays: w.scheduledDays,
  learningSteps: w.learningSteps,
  reps: w.reps,
  lapses: w.lapses,
  lastReview: w.lastReview,
})
const byWord = (snap: SyncSnapshot) =>
  Object.fromEntries(snap.words.map((w) => [w.wordId, fsrsOf(w)]))

describe('AC#1：兩裝置各自離線學習後合併＝只在單一裝置作答的結果', () => {
  // 共同歷史：apple、river 已學到複習狀態，兩裝置同步後離線
  const common: Event[] = [
    { id: 'c1', word: 'apple', grade: Grade.Good, at: T0 },
    { id: 'c2', word: 'apple', grade: Grade.Good, at: T0 + 10 * MIN },
    { id: 'c3', word: 'river', grade: Grade.Good, at: T0 + 1 * MIN },
    { id: 'c4', word: 'river', grade: Grade.Good, at: T0 + 11 * MIN },
  ]
  // 離線期間：同一個字（apple）兩邊都答過且時間交錯；另各有自己的新字
  const onA: Event[] = [
    { id: 'a1', word: 'apple', grade: Grade.Good, at: T0 + 3 * DAY },
    { id: 'a2', word: 'cloud', grade: Grade.Again, at: T0 + 3 * DAY + MIN },
    { id: 'a3', word: 'cloud', grade: Grade.Good, at: T0 + 3 * DAY + 2 * MIN },
    { id: 'a4', word: 'apple', grade: Grade.Hard, at: T0 + 12 * DAY },
  ]
  const onB: Event[] = [
    { id: 'b1', word: 'apple', grade: Grade.Again, at: T0 + 5 * DAY },
    { id: 'b2', word: 'apple', grade: Grade.Good, at: T0 + 5 * DAY + 10 * MIN },
    { id: 'b3', word: 'river', grade: Grade.Easy, at: T0 + 6 * DAY },
    { id: 'b4', word: 'stone', grade: Grade.Good, at: T0 + 6 * DAY + MIN },
  ]

  const base = play(empty(), common)
  const devA = play(base, onA)
  const devB = play(base, onB)
  const single = play(
    empty(),
    [...common, ...onA, ...onB].sort((x, y) => x.at - y.at),
  )
  const merged = mergeSnapshots(devA, devB)

  it('每個字的 FSRS 狀態與單一裝置逐次作答相同', () => {
    expect(byWord(merged)).toEqual(byWord(single))
  })

  it('apple 的手算檢查：6 次作答（c1、c2、a1、b1、b2、a4）、1 次遺忘、最後作答在第 12 天', () => {
    const apple = merged.words.find((w) => w.wordId === 'apple')!
    expect(apple.reps).toBe(6)
    expect(apple.lapses).toBe(1)
    expect(apple.lastReview).toBe(T0 + 12 * DAY)
    expect(apple.state).toBe(CardState.Review)
  })

  it('作答紀錄取聯集去重（共同歷史不重複）', () => {
    expect(merged.reviewLogs.map((l) => l.id).sort()).toEqual([
      'a1',
      'a2',
      'a3',
      'a4',
      'b1',
      'b2',
      'b3',
      'b4',
      'c1',
      'c2',
      'c3',
      'c4',
    ])
  })

  it('只在單側出現的字也合併進來', () => {
    expect(merged.words.map((w) => w.wordId)).toEqual(['apple', 'cloud', 'river', 'stone'])
  })
})

describe('AC#4：合併結果重跑逐位元一致', () => {
  const a = play(empty(), [
    { id: 'x1', word: 'apple', grade: Grade.Good, at: T0 },
    { id: 'x2', word: 'apple', grade: Grade.Good, at: T0 + 10 * MIN },
    { id: 'x3', word: 'apple', grade: Grade.Hard, at: T0 + 4 * DAY },
  ])
  const b = play(empty(), [
    { id: 'y1', word: 'apple', grade: Grade.Again, at: T0 + 2 * MIN },
    { id: 'y2', word: 'lemon', grade: Grade.Easy, at: T0 + DAY },
  ])

  it('同樣輸入重跑兩次，序列化結果完全相同', () => {
    expect(JSON.stringify(mergeSnapshots(a, b))).toBe(JSON.stringify(mergeSnapshots(a, b)))
  })

  it('參數順序對調結果相同（兩台裝置各自合併會收斂）', () => {
    expect(JSON.stringify(mergeSnapshots(b, a))).toBe(JSON.stringify(mergeSnapshots(a, b)))
  })

  it('合併結果再與任一側合併不變（重複同步不漂移）', () => {
    const m = mergeSnapshots(a, b)
    expect(JSON.stringify(mergeSnapshots(m, a))).toBe(JSON.stringify(m))
  })

  it('同一毫秒的兩筆紀錄依 id 排序重播，與輸入順序無關', () => {
    const word = (logs: ReviewLogRow[]): SyncSnapshot => ({
      ...empty(),
      words: [{ wordId: 'tie', ...s.newCard(T0), courseRefs: [], favoritedAt: null, addedAt: T0 }],
      reviewLogs: logs,
    })
    const l1 = play(empty(), [{ id: 'aaa', word: 'tie', grade: Grade.Again, at: T0 }]).reviewLogs[0]
    const l2 = { ...l1, id: 'bbb', rating: Grade.Easy }
    const m1 = mergeSnapshots(word([l1]), word([l2]))
    const m2 = mergeSnapshots(word([l2]), word([l1]))
    expect(JSON.stringify(m1)).toBe(JSON.stringify(m2))
    expect(m1.reviewLogs.map((l) => l.id)).toEqual(['aaa', 'bbb'])
    // 先 Again 再 Easy（id 順序）：手算為學習中→複習
    expect(m1.words[0].reps).toBe(2)
    expect(m1.words[0].state).toBe(CardState.Review)
  })
})

describe('AC#4 實驗：fuzz 開啟時重播是否一致（直接用 ts-fsrs，不經封裝）', () => {
  const plan: [Grade, number][] = [
    [Grade.Good, 0],
    [Grade.Good, 10 * MIN],
    [Grade.Good, 3 * DAY],
    [Grade.Easy, 12 * DAY],
    [Grade.Good, 40 * DAY],
    [Grade.Again, 120 * DAY],
    [Grade.Good, 120 * DAY + 10 * MIN],
    [Grade.Good, 130 * DAY],
  ]

  function runBoth(enable_fuzz: boolean) {
    const f = fsrs(
      generatorParameters({
        learning_steps: ['1m', '10m'],
        relearning_steps: ['10m'],
        enable_short_term: true,
        enable_fuzz,
      }),
    )
    const first = createEmptyCard(new Date(T0))
    let c: Card = first
    for (const [g, dt] of plan) c = f.next(c, new Date(T0 + dt), g).card
    const replay = () => {
      const { collections } = f.reschedule(
        first,
        plan.map(([g, dt]) => ({ rating: g, review: new Date(T0 + dt) })),
        { first_card: first, now: new Date(T0 + plan[plan.length - 1][1]) },
      )
      return collections[collections.length - 1].card
    }
    return { incremental: c, replay1: replay(), replay2: replay(), f }
  }

  it('fuzz 關閉：逐次作答＝重播＝重播', () => {
    const r = runBoth(false)
    expect(r.replay1).toEqual(r.incremental)
    expect(r.replay2).toEqual(r.replay1)
  })

  it('fuzz 開啟：種子取自（作答時間、次數、難度×穩定度），重播仍與逐次作答一致', () => {
    const r = runBoth(true)
    expect(r.replay1).toEqual(r.incremental)
    expect(r.replay2).toEqual(r.replay1)
  })

  it('fuzz 開啟確實改變了間隔（實驗不是空測）', () => {
    expect(runBoth(true).incremental.scheduled_days).not.toBe(
      runBoth(false).incremental.scheduled_days,
    )
  })
})

describe('其餘合併規則', () => {
  const word = (p: Partial<PoolWord> & { wordId: string }): PoolWord => ({
    ...s.newCard(T0),
    courseRefs: [],
    favoritedAt: null,
    addedAt: T0,
    ...p,
  })
  const settings = (p: Partial<Settings>): Settings => ({
    id: 'local',
    dailyNewLimit: 10,
    pauseMultiplier: 10,
    desiredRetention: 0.9,
    cefrLevel: null,
    updatedAt: 0,
    ...p,
  })

  it('收藏取聯集；收藏時間取較早；遠端墓碑（null）不蓋掉本機收藏', () => {
    const local = {
      ...empty(),
      words: [word({ wordId: 'a', favoritedAt: T0 + DAY }), word({ wordId: 'b', favoritedAt: T0 })],
    }
    const remote = {
      ...empty(),
      words: [word({ wordId: 'a', favoritedAt: T0 }), word({ wordId: 'b', favoritedAt: null })],
    }
    const m = mergeSnapshots(local, remote)
    expect(m.words.map((w) => [w.wordId, w.favoritedAt])).toEqual([
      ['a', T0],
      ['b', T0],
    ])
  })

  // TASK-16 D2：收藏狀態以最後修改者為準（favoriteUpdatedAt）；沒有修改時間的舊資料沿用上一條規則
  it('取消收藏晚於另一側的收藏：取消勝；之後再收藏：收藏勝；對調參數結果相同', () => {
    const fav = word({ wordId: 'a', favoritedAt: T0, favoriteUpdatedAt: T0 })
    const unfav = word({ wordId: 'a', favoritedAt: null, favoriteUpdatedAt: T0 + DAY })
    for (const [x, y] of [
      [fav, unfav],
      [unfav, fav],
    ]) {
      const m = mergeSnapshots({ ...empty(), words: [x] }, { ...empty(), words: [y] })
      expect(m.words[0]).toMatchObject({ favoritedAt: null, favoriteUpdatedAt: T0 + DAY })
    }
    const refav = word({ wordId: 'a', favoritedAt: T0 + 2 * DAY, favoriteUpdatedAt: T0 + 2 * DAY })
    for (const [x, y] of [
      [unfav, refav],
      [refav, unfav],
    ]) {
      const m = mergeSnapshots({ ...empty(), words: [x] }, { ...empty(), words: [y] })
      expect(m.words[0]).toMatchObject({
        favoritedAt: T0 + 2 * DAY,
        favoriteUpdatedAt: T0 + 2 * DAY,
      })
    }
  })

  it('收藏與取消同一毫秒：收藏勝（與參數順序無關）', () => {
    const fav = word({ wordId: 'a', favoritedAt: T0, favoriteUpdatedAt: T0 + DAY })
    const unfav = word({ wordId: 'a', favoritedAt: null, favoriteUpdatedAt: T0 + DAY })
    expect(
      mergeSnapshots({ ...empty(), words: [fav] }, { ...empty(), words: [unfav] }).words[0]
        .favoritedAt,
    ).toBe(T0)
    expect(
      mergeSnapshots({ ...empty(), words: [unfav] }, { ...empty(), words: [fav] }).words[0]
        .favoritedAt,
    ).toBe(T0)
  })

  it('課程來源取聯集並排序；加入時間取較早', () => {
    const m = mergeSnapshots(
      { ...empty(), words: [word({ wordId: 'a', courseRefs: ['l2', 'l1'], addedAt: T0 + DAY })] },
      { ...empty(), words: [word({ wordId: 'a', courseRefs: ['l3', 'l1'], addedAt: T0 })] },
    )
    expect(m.words[0]).toMatchObject({ courseRefs: ['l1', 'l2', 'l3'], addedAt: T0 })
  })

  it('沒有作答紀錄的字保留加入較早那筆的狀態', () => {
    const m = mergeSnapshots(
      { ...empty(), words: [word({ wordId: 'a', addedAt: T0 + DAY, due: T0 + DAY })] },
      { ...empty(), words: [word({ wordId: 'a', addedAt: T0, due: T0 })] },
    )
    expect(m.words[0]).toMatchObject({ state: CardState.New, due: T0, reps: 0 })
  })

  it('設定以最後修改時間為準；單側缺設定取另一側', () => {
    const older = settings({ dailyNewLimit: 5, updatedAt: T0 })
    const newer = settings({ dailyNewLimit: 20, updatedAt: T0 + 1 })
    expect(
      mergeSnapshots({ ...empty(), settings: older }, { ...empty(), settings: newer }).settings,
    ).toEqual(newer)
    expect(
      mergeSnapshots({ ...empty(), settings: newer }, { ...empty(), settings: older }).settings,
    ).toEqual(newer)
    expect(mergeSnapshots(empty(), { ...empty(), settings: older }).settings).toEqual(older)
    expect(mergeSnapshots(empty(), empty()).settings).toBeNull()
  })

  it('設定同時間、內容不同：對調參數結果相同', () => {
    const x = settings({ dailyNewLimit: 5, updatedAt: T0 })
    const y = settings({ dailyNewLimit: 20, updatedAt: T0 })
    const xy = mergeSnapshots({ ...empty(), settings: x }, { ...empty(), settings: y }).settings
    const yx = mergeSnapshots({ ...empty(), settings: y }, { ...empty(), settings: x }).settings
    expect(xy).toEqual(yx)
  })

  it('重播用合併後設定的保留率', () => {
    const logs = play(empty(), [
      { id: 'r1', word: 'a', grade: Grade.Good, at: T0 },
      { id: 'r2', word: 'a', grade: Grade.Good, at: T0 + 10 * MIN },
      { id: 'r3', word: 'a', grade: Grade.Good, at: T0 + 5 * DAY },
    ])
    const m = mergeSnapshots(
      { ...logs, settings: settings({ desiredRetention: 0.8, updatedAt: 1 }) },
      empty(),
    )
    const expected = createScheduler(0.8).replay(logs.reviewLogs)
    expect(fsrsOf(m.words[0])).toEqual(expected)
    expect(m.words[0].scheduledDays).not.toBe(logs.words[0].scheduledDays)
  })

  it('課程進度：完成時間取較早、修改時間取較晚', () => {
    const m = mergeSnapshots(
      {
        ...empty(),
        courseProgress: [{ lessonId: 'l1', completedAt: T0 + DAY, updatedAt: T0 + DAY }],
      },
      {
        ...empty(),
        courseProgress: [
          { lessonId: 'l1', completedAt: T0, updatedAt: T0 },
          { lessonId: 'l0', completedAt: T0, updatedAt: T0 },
        ],
      },
    )
    expect(m.courseProgress).toEqual([
      { lessonId: 'l0', completedAt: T0, updatedAt: T0 },
      { lessonId: 'l1', completedAt: T0, updatedAt: T0 + DAY },
    ])
  })

  it('跟讀修正以 id 取聯集', () => {
    const c = (id: string) => ({
      id,
      itemId: 'i',
      targetText: 't',
      recognizedText: 'r',
      correctedText: 'c',
      createdAt: T0,
    })
    const m = mergeSnapshots(
      { ...empty(), speechCorrections: [c('b'), c('a')] },
      { ...empty(), speechCorrections: [c('a'), c('c')] },
    )
    expect(m.speechCorrections.map((x) => x.id)).toEqual(['a', 'b', 'c'])
  })
})
