// e2e 專用：學習畫面（TASK-11 之後）出現前，讓 e2e 以真實資料層函式模擬「訪客學習」並讀本機進度。
// 只在建置時設 VITE_E2E_HOOKS=true 才載入（main.tsx 動態 import），一般建置不含本檔。
import { createDb } from './data/db'
import { addFavorite, addFromCourse, recordReview, saveSettings } from './data/repo'
import type { Grade } from './srs/scheduler'

const db = createDb()

const hooks = {
  addFromCourse: (word: string, lessonId: string) => addFromCourse(db, word, lessonId, Date.now()),
  addFavorite: (word: string) => addFavorite(db, word, Date.now()),
  recordReview: (word: string, grade: Grade) => recordReview(db, word, grade, Date.now()),
  saveSettings: (patch: { dailyNewLimit: number }) => saveSettings(db, patch, Date.now()),
  async snapshot() {
    return {
      words: await db.wordPool.orderBy('wordId').toArray(),
      reviewLogIds: (await db.reviewLogs.toArray()).map((l) => l.id).sort(),
      settings: (await db.settings.get('local')) ?? null,
      outbox: await db.outbox.count(),
      userId: (await db.syncMeta.get('userId'))?.value ?? null,
    }
  },
}

;(window as unknown as { __linguaTest: typeof hooks }).__linguaTest = hooks
