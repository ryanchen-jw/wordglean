// 單字池、作答紀錄、設定的讀寫；時間參數一律 UTC epoch ms，時區只在算「今天」時傳入
import type { LinguaDb, PoolWord, Settings } from './db'
import { CardState, createScheduler, DEFAULT_RETENTION, type Grade } from '../srs/scheduler'
import { dayBoundsUtc, deviceTimeZone, localDayKey, newWordQuota } from '../srs/daily'

export const DEFAULT_SETTINGS: Settings = {
  id: 'local',
  dailyNewLimit: 10,
  pauseMultiplier: 10,
  desiredRetention: DEFAULT_RETENTION,
  updatedAt: 0,
}

export async function getSettings(db: LinguaDb): Promise<Settings> {
  return (await db.settings.get('local')) ?? DEFAULT_SETTINGS
}

export async function saveSettings(
  db: LinguaDb,
  patch: Partial<Omit<Settings, 'id' | 'updatedAt'>>,
  nowMs: number,
): Promise<void> {
  await db.transaction('rw', db.settings, async () => {
    await db.settings.put({ ...(await getSettings(db)), ...patch, id: 'local', updatedAt: nowMs })
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
  await db.transaction('rw', db.wordPool, async () => {
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
  })
}

export function addFromCourse(db: LinguaDb, word: string, lessonId: string, nowMs: number) {
  return upsertSource(db, word, nowMs, (w) => {
    if (!w.courseRefs.includes(lessonId)) w.courseRefs.push(lessonId)
  })
}

export function addFavorite(db: LinguaDb, word: string, nowMs: number) {
  return upsertSource(db, word, nowMs, (w) => {
    w.favoritedAt ??= nowMs
  })
}

export async function recordReview(
  db: LinguaDb,
  word: string,
  grade: Grade,
  nowMs: number,
): Promise<void> {
  const wordId = normalizeWordId(word)
  await db.transaction('rw', [db.wordPool, db.reviewLogs, db.settings], async () => {
    const row = await db.wordPool.get(wordId)
    if (!row) throw new Error(`單字不在池中：${wordId}`)
    const { desiredRetention } = await getSettings(db)
    const { card, log } = createScheduler(desiredRetention).review(row, grade, nowMs)
    await db.wordPool.put({ ...row, ...card })
    await db.reviewLogs.add({ id: crypto.randomUUID(), wordId, ...log })
  })
}

/** 待複習數：已開始學（非新字）且已到期 */
export function countDue(db: LinguaDb, nowMs: number): Promise<number> {
  return db.wordPool
    .where('due')
    .belowOrEqual(nowMs)
    .filter((w) => w.state !== CardState.New)
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
