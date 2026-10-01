// RemoteStore 的 Supabase 實作：PostgREST 分頁拉取、upsert 推送；權限由 RLS 擋（只能動自己的列）
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PoolWord } from '../data/db'
import type { SyncSnapshot } from './merge'
import type { RemoteStore } from './remote'
import {
  logFromRow,
  logToRow,
  progressFromRow,
  progressToRow,
  settingsFromRow,
  settingsToRow,
  speechFromRow,
  speechToRow,
  wordFromRows,
  wordToRows,
  type CourseProgressRow,
  type FavoriteRow,
  type ReviewLogDbRow,
  type SettingsRow,
  type SpeechCorrectionRow,
  type WordPoolRow,
} from './rows'

// 對齊 supabase/config.toml 的 [api] max_rows
const PAGE = 1000
const CHUNK = 500
// 游標往前留的重疊窗：交易提交順序可能晚於 inserted_at（now()＝交易開始時間）
export const CURSOR_OVERLAP_MS = 5 * 60_000

type Page<T> = PromiseLike<{ data: T[] | null; error: unknown }>

async function fetchAll<T>(page: (from: number, to: number) => Page<T>): Promise<T[]> {
  const all: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1)
    if (error) throw error
    all.push(...(data ?? []))
    if (!data || data.length < PAGE) return all
  }
}

async function check(p: PromiseLike<{ error: unknown }>) {
  const { error } = await p
  if (error) throw error
}

const chunks = <T>(rows: T[]) =>
  Array.from({ length: Math.ceil(rows.length / CHUNK) }, (_, i) =>
    rows.slice(i * CHUNK, (i + 1) * CHUNK),
  )

export function createSupabaseRemote(client: SupabaseClient): RemoteStore {
  async function userId() {
    const { data } = await client.auth.getSession()
    return data.session?.user.id ?? null
  }

  async function requireUser() {
    const id = await userId()
    if (!id) throw new Error('未登入')
    return id
  }

  return {
    userId,

    async pull(cursor) {
      await requireUser()
      const settingsRows = await fetchAll<SettingsRow>((f, t) =>
        client.from('settings').select('*').range(f, t),
      )
      const poolRows = await fetchAll<WordPoolRow>((f, t) =>
        client.from('word_pool').select('*').order('word_id').range(f, t),
      )
      const favRows = await fetchAll<FavoriteRow>((f, t) =>
        client.from('favorites').select('*').order('word_id').range(f, t),
      )
      const logRows = await fetchAll<ReviewLogDbRow & { inserted_at: string }>((f, t) => {
        let q = client.from('review_logs').select('*')
        if (cursor !== null) {
          q = q.gte('inserted_at', new Date(Date.parse(cursor) - CURSOR_OVERLAP_MS).toISOString())
        }
        return q.order('inserted_at').order('id').range(f, t)
      })
      const progressRows = await fetchAll<CourseProgressRow>((f, t) =>
        client.from('course_progress').select('*').order('lesson_id').range(f, t),
      )
      const speechRows = await fetchAll<SpeechCorrectionRow>((f, t) =>
        client.from('speech_corrections').select('*').order('id').range(f, t),
      )

      const favs = new Map(favRows.map((r) => [r.word_id, r]))
      const words: PoolWord[] = poolRows.map((p) => wordFromRows(p, favs.get(p.word_id)))
      const pooled = new Set(poolRows.map((p) => p.word_id))
      for (const f of favRows) {
        if (!pooled.has(f.word_id) && f.deleted_at === null) words.push(wordFromRows(undefined, f))
      }

      const snapshot: SyncSnapshot = {
        settings: settingsRows[0] ? settingsFromRow(settingsRows[0]) : null,
        words,
        reviewLogs: logRows.map(logFromRow),
        courseProgress: progressRows.flatMap((r) => progressFromRow(r) ?? []),
        speechCorrections: speechRows.map(speechFromRow),
      }
      return { snapshot, cursor: logRows.at(-1)?.inserted_at ?? cursor }
    },

    async push(c) {
      const uid = await requireUser()
      const now = new Date().toISOString()
      if (c.settings) await check(client.from('settings').upsert(settingsToRow(c.settings, uid)))
      const rows = c.words.map((w) => wordToRows(w, uid, now))
      for (const part of chunks(rows.map((r) => r.pool))) {
        await check(client.from('word_pool').upsert(part))
      }
      for (const part of chunks(rows.flatMap((r) => r.favorite ?? []))) {
        await check(client.from('favorites').upsert(part))
      }
      // 只能新增（雲端沒開 update）；重推以 id 去重
      for (const part of chunks(c.reviewLogs.map((l) => logToRow(l, uid)))) {
        await check(client.from('review_logs').upsert(part, { ignoreDuplicates: true }))
      }
      for (const part of chunks(c.courseProgress.map((p) => progressToRow(p, uid)))) {
        await check(client.from('course_progress').upsert(part))
      }
      for (const part of chunks(c.speechCorrections.map((s) => speechToRow(s, uid)))) {
        await check(client.from('speech_corrections').upsert(part, { ignoreDuplicates: true }))
      }
    },
  }
}
