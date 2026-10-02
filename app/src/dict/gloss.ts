// 單字庫（s09）的中文釋義：先取單字總表的 glossZh，沒有再取字典條目第一行
import type { LookupDeps } from './lookup'

/** 單字池的字（小寫原形）→ 一行中文釋義（含詞性，搜尋比對用）；字典也沒有時為 null */
export async function glossLine(
  wordId: string,
  { lex, shards }: LookupDeps,
): Promise<string | null> {
  const fromLex = lex.get(wordId)?.glossZh
  if (fromLex) return fromLex
  const entry = (await shards.get(wordId))?.e[wordId]
  return entry ? entry[1].split('\n')[0] : null
}
