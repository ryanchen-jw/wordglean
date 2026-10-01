// FSRS 排程封裝：參數依規格 §7，步驟邏輯全用 ts-fsrs 內建，本檔只做欄位與時間（UTC epoch ms ↔ Date）轉換
import { createEmptyCard, fsrs, generatorParameters, type Card, type ReviewLog } from 'ts-fsrs'

export const Grade = { Again: 1, Hard: 2, Good: 3, Easy: 4 } as const
export type Grade = (typeof Grade)[keyof typeof Grade]

export const CardState = { New: 0, Learning: 1, Review: 2, Relearning: 3 } as const
export type CardState = (typeof CardState)[keyof typeof CardState]

/** 單字池紀錄裡的 FSRS 狀態欄；時間皆 UTC epoch ms */
export interface FsrsFields {
  state: CardState
  due: number
  stability: number
  difficulty: number
  scheduledDays: number
  learningSteps: number
  reps: number
  lapses: number
  lastReview: number | null
}

/** 一筆作答紀錄；state 為作答前狀態，可直接餵給 ts-fsrs reschedule 重播 */
export interface ReviewEntry {
  rating: Grade
  state: CardState
  due: number
  stability: number
  difficulty: number
  scheduledDays: number
  learningSteps: number
  review: number
}

export const DEFAULT_RETENTION = 0.9

function toCard(f: FsrsFields): Card {
  return {
    due: new Date(f.due),
    stability: f.stability,
    difficulty: f.difficulty,
    elapsed_days: 0, // ts-fsrs 已棄用此欄，排程不讀它
    scheduled_days: f.scheduledDays,
    learning_steps: f.learningSteps,
    reps: f.reps,
    lapses: f.lapses,
    state: f.state,
    last_review: f.lastReview === null ? undefined : new Date(f.lastReview),
  }
}

function fromCard(c: Card): FsrsFields {
  return {
    state: c.state as number as CardState,
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduled_days,
    learningSteps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    lastReview: c.last_review ? c.last_review.getTime() : null,
  }
}

function fromLog(l: ReviewLog): ReviewEntry {
  return {
    rating: l.rating as number as Grade,
    state: l.state as number as CardState,
    due: l.due.getTime(),
    stability: l.stability,
    difficulty: l.difficulty,
    scheduledDays: l.scheduled_days,
    learningSteps: l.learning_steps,
    review: l.review.getTime(),
  }
}

export function createScheduler(desiredRetention = DEFAULT_RETENTION) {
  const f = fsrs(
    generatorParameters({
      request_retention: desiredRetention,
      learning_steps: ['1m', '10m'],
      relearning_steps: ['10m'],
      enable_short_term: true,
      enable_fuzz: false, // 固定關閉，重播合併（TASK-20）才會得到一致結果
    }),
  )

  return {
    newCard(nowMs: number): FsrsFields {
      return fromCard(createEmptyCard(new Date(nowMs)))
    },

    review(card: FsrsFields, grade: Grade, nowMs: number) {
      const r = f.next(toCard(card), new Date(nowMs), grade)
      return { card: fromCard(r.card), log: fromLog(r.log) }
    },

    /** 以 review log 從新字重播出卡片狀態 */
    replay(logs: ReviewEntry[]): FsrsFields {
      if (logs.length === 0) return fromCard(createEmptyCard(new Date(0)))
      const sorted = [...logs].sort((a, b) => a.review - b.review)
      const first = createEmptyCard(new Date(sorted[0].review))
      const { collections } = f.reschedule(
        first,
        sorted.map((l) => ({ rating: l.rating, review: new Date(l.review) })),
        { first_card: first, now: new Date(sorted[sorted.length - 1].review) },
      )
      return fromCard(collections[collections.length - 1].card)
    },
  }
}
