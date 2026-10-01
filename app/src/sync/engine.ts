// 同步引擎：拉雲端 → 與本機合併 → 寫回本機 → 推佇列裡的變更；規則見 docs/verification/2026-10-02-task20-sync-evidence/proposal.md
import type { LinguaDb, OutboxEntry } from '../data/db'
import { mergeSnapshots, stableJson, type SyncSnapshot } from './merge'
import type { RemoteStore } from './remote'

async function readSnapshot(db: LinguaDb): Promise<SyncSnapshot> {
  return {
    settings: (await db.settings.get('local')) ?? null,
    words: await db.wordPool.toArray(),
    reviewLogs: await db.reviewLogs.toArray(),
    courseProgress: await db.courseProgress.toArray(),
    speechCorrections: await db.speechCorrections.toArray(),
  }
}

// 只寫有變的列；合併不刪列
async function writeChanged(db: LinguaDb, local: SyncSnapshot, merged: SyncSnapshot) {
  const changed = <T extends object>(before: T[], after: T[], key: (t: T) => string) => {
    const old = new Map(before.map((t) => [key(t), stableJson(t)]))
    return after.filter((t) => old.get(key(t)) !== stableJson(t))
  }
  if (merged.settings && stableJson(merged.settings) !== stableJson(local.settings ?? {})) {
    await db.settings.put(merged.settings)
  }
  await db.wordPool.bulkPut(changed(local.words, merged.words, (w) => w.wordId))
  await db.reviewLogs.bulkPut(changed(local.reviewLogs, merged.reviewLogs, (l) => l.id))
  await db.courseProgress.bulkPut(
    changed(local.courseProgress, merged.courseProgress, (p) => p.lessonId),
  )
  await db.speechCorrections.bulkPut(
    changed(local.speechCorrections, merged.speechCorrections, (c) => c.id),
  )
}

// 從合併結果挑出要推的列
function pick(merged: SyncSnapshot, keys: Map<OutboxEntry['table'], Set<string>>): SyncSnapshot {
  const has = (table: OutboxEntry['table'], key: string) => keys.get(table)?.has(key) ?? false
  return {
    settings: merged.settings && has('settings', 'local') ? merged.settings : null,
    words: merged.words.filter((w) => has('wordPool', w.wordId)),
    reviewLogs: merged.reviewLogs.filter((l) => has('reviewLogs', l.id)),
    courseProgress: merged.courseProgress.filter((p) => has('courseProgress', p.lessonId)),
    speechCorrections: merged.speechCorrections.filter((c) => has('speechCorrections', c.id)),
  }
}

function keysOf(entries: OutboxEntry[]) {
  const keys = new Map<OutboxEntry['table'], Set<string>>()
  for (const e of entries) {
    if (!keys.has(e.table)) keys.set(e.table, new Set())
    keys.get(e.table)!.add(e.key)
  }
  return keys
}

// 本機現有的全部列（第一次同步到某帳號時整份推）
function allKeys(local: SyncSnapshot): OutboxEntry[] {
  return [
    ...(local.settings ? [{ table: 'settings' as const, key: 'local' }] : []),
    ...local.words.map((w) => ({ table: 'wordPool' as const, key: w.wordId })),
    ...local.reviewLogs.map((l) => ({ table: 'reviewLogs' as const, key: l.id })),
    ...local.courseProgress.map((p) => ({ table: 'courseProgress' as const, key: p.lessonId })),
    ...local.speechCorrections.map((c) => ({ table: 'speechCorrections' as const, key: c.id })),
  ]
}

/** 本機資料已同步給另一個帳號：拒絕同步，避免把 A 的學習紀錄推進 B（proposal 行為說明） */
export class AccountMismatchError extends Error {
  constructor() {
    super('本機資料屬於另一個帳號')
    this.name = 'AccountMismatchError'
  }
}

export function createSyncEngine({ db, remote }: { db: LinguaDb; remote: RemoteStore }) {
  async function syncOnce() {
    const userId = await remote.userId()
    if (!userId) return
    const boundUser = (await db.syncMeta.get('userId'))?.value ?? null
    if (boundUser !== null && boundUser !== userId) throw new AccountMismatchError()
    // 從未同步過的訪客資料：首次登入整份推上去
    const firstForUser = boundUser === null
    const cursor = firstForUser ? null : ((await db.syncMeta.get('cursor'))?.value ?? null)

    const pulled = await remote.pull(cursor)

    // 讀本機、合併、寫回在同一交易：等雲端回應期間的新寫入也會被讀進來，不被覆蓋
    let toPush!: SyncSnapshot
    let maxSeq = 0
    await db.transaction(
      'rw',
      [db.settings, db.wordPool, db.reviewLogs, db.courseProgress, db.speechCorrections, db.outbox],
      async () => {
        const local = await readSnapshot(db)
        const merged = mergeSnapshots(local, pulled.snapshot)
        await writeChanged(db, local, merged)
        const outbox = await db.outbox.toArray()
        maxSeq = Math.max(0, ...outbox.map((e) => e.seq!))
        toPush = pick(merged, keysOf(firstForUser ? [...allKeys(local), ...outbox] : outbox))
      },
    )

    await remote.push(toPush)

    await db.transaction('rw', db.outbox, db.syncMeta, async () => {
      await db.outbox.where('seq').belowOrEqual(maxSeq).delete()
      await db.syncMeta.bulkPut([
        { key: 'userId', value: userId },
        { key: 'cursor', value: pulled.cursor },
      ])
    })
  }

  // 同一時間只跑一次；跑的期間再被要求，結束後補跑一輪
  let running: Promise<void> | null = null
  let again = false
  function sync(): Promise<void> {
    if (running) {
      again = true
      return running
    }
    running = (async () => {
      try {
        do {
          again = false
          await syncOnce()
        } while (again)
      } finally {
        running = null
      }
    })()
    return running
  }

  return {
    sync,
    /** 不等結果的同步（結算後、回到前景、恢復連線）；失敗時資料留在佇列，下次再推 */
    requestSync() {
      sync().catch(() => {})
    },
    /** 登出前：推完佇列再清空本機；推不出去回傳 false 且不清 */
    async flushAndClear(): Promise<boolean> {
      try {
        await sync()
      } catch {
        return false
      }
      if ((await db.outbox.count()) > 0) return false
      await db.transaction('rw', db.tables, async () => {
        for (const t of db.tables) await t.clear()
      })
      return true
    },
  }
}

/** 回到前景、恢復連線時要求同步；回傳解除監聽的函式 */
export function startAutoSync(engine: { requestSync(): void }, win: Window = window) {
  const onVisible = () => {
    if (win.document.visibilityState === 'visible') engine.requestSync()
  }
  const onOnline = () => engine.requestSync()
  win.document.addEventListener('visibilitychange', onVisible)
  win.addEventListener('online', onOnline)
  return () => {
    win.document.removeEventListener('visibilitychange', onVisible)
    win.removeEventListener('online', onOnline)
  }
}
