// 單字池、作答紀錄、設定的讀寫；時間參數一律 UTC epoch ms，時區只在算「今天」時傳入
import type { LinguaDb, OutboxEntry, PoolWord, Settings } from './db'
import { CardState, createScheduler, DEFAULT_RETENTION, type Grade } from '../srs/scheduler'
import { dayBoundsUtc, deviceTimeZone, localDayKey, newWordQuota } from '../srs/daily'

export const DEFAULT_SETTINGS: Settings = {
  id: 'local',
  dailyNewLimit: 10,
  pauseMultiplier: 10,
  desiredRetention: DEFAULT_RETENTION,
  updatedAt: 0,
}

// 本機寫入同一交易內記一筆待推項目（TASK-20 離線佇列）
const enqueue = (db: LinguaDb, table: OutboxEntry['table'], key: string) =>
  db.outbox.add({ table, key })

export async function getSettings(db: LinguaDb): Promise<Settings> {
  return (await db.settings.get('local')) ?? DEFAULT_SETTINGS
}

export async function saveSettings(
  db: LinguaDb,
  patch: Partial<Omit<Settings, 'id' | 'updatedAt'>>,
  nowMs: number,
): Promise<void> {
  await db.transaction('rw', db.settings, db.outbox, async () => {
    await db.settings.put({ ...(await getSettings(db)), ...patch, id: 'local', updatedAt: nowMs })
    await enqueue(db, 'settings', 'local')
  })
}

const normalizeWordId = (word: string) => word.trim().toLowerCase()

// 已在池中就只補來源，不動 FSRS 狀態；不在池中才建新卡
async function upsertSource(
  db: LinguaDb,
  word: string,
  nowMs: number,
  apply: (w: PoolWord) => void,
): Promise<void> {
  const wordId = normalizeWordId(word)
  await db.transaction('rw', db.wordPool, db.outbox, async () => {
    const existing = await db.wordPool.get(wordId)
    const row: PoolWord = existing ?? {
      wordId,
      ...createScheduler().newCard(nowMs),
      courseRefs: [],
      favoritedAt: null,
      addedAt: nowMs,
    }
    apply(row)
    await db.wordPool.put(row)
    await enqueue(db, 'wordPool', wordId)
  })
}

export function addFromCourse(db: LinguaDb, word: string, lessonId: string, nowMs: number) {
  return upsertSource(db, word, nowMs, (w) => {
    if (!w.courseRefs.includes(lessonId)) w.courseRefs.push(lessonId)
  })
}

export function addFavorite(db: LinguaDb, word: string, nowMs: number) {
  return upsertSource(db, word, nowMs, (w) => {
    if (w.favoritedAt !== null) return
    w.favoritedAt = nowMs
    w.favoriteUpdatedAt = nowMs
  })
}

/** 取消收藏：清收藏時間、記修改時間（同步推墓碑），課程來源與 FSRS 狀態不動；不在池中的字不處理 */
export async function removeFavorite(db: LinguaDb, word: string, nowMs: number): Promise<void> {
  const wordId = normalizeWordId(word)
  await db.transaction('rw', db.wordPool, db.outbox, async () => {
    const row = await db.wordPool.get(wordId)
    if (!row || row.favoritedAt === null) return
    await db.wordPool.put({ ...row, favoritedAt: null, favoriteUpdatedAt: nowMs })
    await enqueue(db, 'wordPool', wordId)
  })
}

/**
 * 是否在單字池（TASK-16 D3）：有課程來源或已收藏。兩者皆無的字（取消收藏、按了復原）讀取時視為不在池中，
 * 不刪資料、再收藏時沿用原排程；單字庫、待複習數、複習佇列（TASK-18）一律以此過濾
 */
export const inPool = (w: Pick<PoolWord, 'courseRefs' | 'favoritedAt'>) =>
  w.courseRefs.length > 0 || w.favoritedAt !== null

export async function recordReview(
  db: LinguaDb,
  word: string,
  grade: Grade,
  nowMs: number,
): Promise<void> {
  const wordId = normalizeWordId(word)
  await db.transaction('rw', [db.wordPool, db.reviewLogs, db.settings, db.outbox], async () => {
    const row = await db.wordPool.get(wordId)
    if (!row) throw new Error(`單字不在池中：${wordId}`)
    const { desiredRetention } = await getSettings(db)
    const { card, log } = createScheduler(desiredRetention).review(row, grade, nowMs)
    const id = crypto.randomUUID()
    await db.wordPool.put({ ...row, ...card })
    await db.reviewLogs.add({ id, wordId, ...log })
    await enqueue(db, 'wordPool', wordId)
    await enqueue(db, 'reviewLogs', id)
  })
}

/** 記完成一課；completedAt 保留第一次完成的時間（與同步合併規則 min／max 一致） */
export async function completeLesson(db: LinguaDb, lessonId: string, nowMs: number): Promise<void> {
  await db.transaction('rw', db.courseProgress, db.outbox, async () => {
    const existing = await db.courseProgress.get(lessonId)
    await db.courseProgress.put({
      lessonId,
      completedAt: existing?.completedAt ?? nowMs,
      updatedAt: nowMs,
    })
    await enqueue(db, 'courseProgress', lessonId)
  })
}

/** 待複習數：在池中、已開始學（非新字）且已到期 */
export function countDue(db: LinguaDb, nowMs: number): Promise<number> {
  return db.wordPool
    .where('due')
    .belowOrEqual(nowMs)
    .filter((w) => w.state !== CardState.New && inPool(w))
    .count()
}

export async function getTodayQuota(db: LinguaDb, nowMs: number, timeZone = deviceTimeZone()) {
  const settings = await getSettings(db)
  const { startMs, endMs } = dayBoundsUtc(localDayKey(nowMs, timeZone), timeZone)
  const introducedToday = await db.reviewLogs
    .where('review')
    .between(startMs, endMs, true, false)
    .filter((l) => l.state === CardState.New)
    .count()
  return newWordQuota({
    dailyNewLimit: settings.dailyNewLimit,
    pauseMultiplier: settings.pauseMultiplier,
    dueCount: await countDue(db, nowMs),
    introducedToday,
  })
}
