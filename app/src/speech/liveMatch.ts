// 即時跟讀的不照順序比對（TASK-39，設計 docs/pending/2026-11-13-live-shadowing/design.md §3）：
// 每一輪辨識文字以半全域對齊（目標句兩端空缺不計成本、句中跳字半價）對回目標句，只認完全相同的比對字；
// 原字的比對字要在同一輪全部對到才算唸到；重複字以上下文決定，單獨出現對到第一個未完成的；
// 確認（預設開）：最近 3 輪中有 2 輪唸到才完成（TASK-40；TASK-39 原為相鄰兩輪，幻聽輪次夾在中間會打斷）；
// 功能字不擋整句完成（裁示 B 版），整句完成時未完成的功能字標為輕讀。
// 幻聽輪次（非拉丁字母、重複迴圈）整輪丟棄、不算一輪；單輪只取前 maxWords 個字（TASK-40，創辦人手機實測）。
// 只吃「這一輪聽到的文字」，不依賴辨識引擎
import { charDistance, tokenize } from './align'

/** 弱讀的功能字（冠詞、介系詞、連接詞、be／助動詞、代名詞受格），可調 */
export const FUNCTION_WORDS: ReadonlySet<string> = new Set(
  'a an the to of and or but at for from in on with as by is am are was were be been do does have has can could will would him her them us'.split(
    ' ',
  ),
)

/** todo＝還沒唸到；heard＝唸到一輪、等確認；done＝完成；light＝整句完成時未唸到的功能字（輕讀，視為完成） */
export type LiveMark = 'todo' | 'heard' | 'done' | 'light'

export interface LiveWord {
  text: string
  functionWord: boolean
  mark: LiveMark
  /** 完成於第幾輪（從 1 起） */
  doneAt: number | null
  /** 被唸到的輪數 */
  hits: number
}

export interface LiveState {
  words: LiveWord[]
  /** 已呼叫 update 的輪數 */
  round: number
  /** 最長一口氣：單一輪按原句順序連續唸到的最多原字數 */
  longestRun: number
  /** 完成（含輕讀）的字數 */
  doneCount: number
  complete: boolean
  /** 被當成幻聽丟棄的輪數 */
  dropped: number
}

export interface LiveMatchOptions {
  /** 確認：最近 confirmWindow 輪中有 2 輪唸到才完成（預設開） */
  confirm?: boolean
  /** 確認看最近幾輪（預設 3；2＝TASK-39 的相鄰兩輪，實驗 2 對照用） */
  confirmWindow?: number
  /** 丟棄幻聽輪次、限制單輪長度（預設開；關閉＝TASK-39 行為，實驗 2 對照用） */
  screen?: boolean
  /** true＝功能字也要唸到才算整句完成（原版 A）；預設 false（B 版） */
  functionWordsBlock?: boolean
}

/** 辨識文字多出的字 */
const GAP_HEARD = 1
/** 句中跳過的目標字：比多字便宜，讓「I go park」（跳過 to the）仍對到 park */
const GAP_TARGET = 0.5
/** 完全相同的配對略低於 0：同分時取對到較多字的對齊 */
const EXACT = -0.01
/** 對到已完成的字多一點成本：同分時優先對到未完成的（重複字規則） */
const DONE_PENALTY = 1e-3

/** 單輪最多取幾個字：4 秒視窗、每秒 4 字（快速朗讀約每秒 3 字）；超出的多半是模型續寫 */
export const MAX_ROUND_WORDS = 16

const NON_LATIN = /(?![\p{Script=Latin}])\p{L}/u

/** seq 是否照順序、連續出現在 target 裡 */
const contains = (target: readonly string[], seq: string[]) =>
  target.some((_, s) => s + seq.length <= target.length && seq.every((w, k) => target[s + k] === w))

/**
 * 同一段（1–4 字）連續出現 3 次以上＝重複迴圈（實測：all all all…、I always use. ×7）；
 * 但整段重複本身照順序出現在目標句裡（目標句就是 no no no、Bye bye bye）不算
 */
function looping(words: string[], target: readonly string[]): boolean {
  for (let n = 1; n <= 4; n++)
    for (let i = 0; i + 3 * n <= words.length; i++) {
      let reps = 1
      while (
        i + (reps + 1) * n <= words.length &&
        words.slice(i + reps * n, i + (reps + 1) * n).every((w, k) => w === words[i + k])
      )
        reps++
      if (reps >= 3 && !contains(target, words.slice(i, i + reps * n))) return true
    }
  return false
}

const norm = (w: string) => w.toLowerCase().replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, '')

/** 一輪辨識文字的篩選：幻聽整輪丟棄（不拿來比對），否則只留前 maxWords 個字；target＝目標句的字（小寫、去頭尾標點） */
export function screenHeard(
  text: string,
  maxWords = MAX_ROUND_WORDS,
  target: readonly string[] = [],
): { text: string } | { dropped: 'script' | 'loop' } {
  if (NON_LATIN.test(text)) return { dropped: 'script' }
  const raw = text.trim().split(/\s+/).filter(Boolean)
  const words = raw.map(norm).filter(Boolean)
  if (looping(words, target)) return { dropped: 'loop' }
  return { text: raw.length > maxWords ? raw.slice(0, maxWords).join(' ') : text }
}

/** 半全域對齊，回傳這一輪「完全相同」配對到的目標比對字索引 */
export function matchParts(target: string[], heard: string[], done: boolean[]): Set<number> {
  const n = target.length
  const m = heard.length
  const sub = (i: number, j: number) =>
    (target[i] === heard[j] ? EXACT : charDistance(target[i], heard[j])) +
    (done[i] ? DONE_PENALTY : 0)
  // cost[i][0]＝0：目標句開頭的空缺不計成本；cost[0][j]：辨識文字開頭多出的字照算
  const cost: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j * GAP_HEARD : 0)),
  )
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      cost[i][j] = Math.min(
        cost[i - 1][j - 1] + sub(i - 1, j - 1),
        cost[i - 1][j] + GAP_TARGET,
        cost[i][j - 1] + GAP_HEARD,
      )
  // 目標句結尾的空缺也不計：取最後一欄最小者，同分取最前面
  let i = 0
  for (let k = 1; k <= n; k++) if (cost[k][m] < cost[i][m] - 1e-9) i = k
  const eq = (a: number, b: number) => Math.abs(a - b) < 1e-9
  const hit = new Set<number>()
  let j = m
  while (j > 0) {
    if (i > 0 && eq(cost[i][j], cost[i - 1][j - 1] + sub(i - 1, j - 1))) {
      if (target[i - 1] === heard[j - 1]) hit.add(i - 1)
      i--
      j--
    } else if (i > 0 && eq(cost[i][j], cost[i - 1][j] + GAP_TARGET)) i--
    else j--
  }
  return hit
}

export function createLiveMatch(targetSentence: string, opts: LiveMatchOptions = {}) {
  const confirm = opts.confirm ?? true
  const confirmWindow = opts.confirmWindow ?? 3
  const screen = opts.screen ?? true
  const tWords = tokenize(targetSentence)
  const targetWords = tWords.map((w) => norm(w.text))
  const owner = tWords.flatMap((w, k) => w.parts.map(() => k))
  const parts = tWords.flatMap((w) => w.parts)
  const isFunction = tWords.map((w) => w.parts.length === 1 && FUNCTION_WORDS.has(w.parts[0]))
  const blocking = tWords.map((_, k) => opts.functionWordsBlock || !isFunction[k])
  // 全是功能字的句子：每個字都要唸到
  if (!blocking.some(Boolean)) blocking.fill(true)

  const words: LiveWord[] = tWords.map((w, k) => ({
    text: w.text,
    functionWord: isFunction[k],
    mark: 'todo',
    doneAt: null,
    hits: 0,
  }))
  const lastHit = tWords.map(() => -Infinity)
  let round = 0
  let longestRun = 0
  let complete = false
  let dropped = 0

  const snapshot = (): LiveState => ({
    words: words.map((w) => ({ ...w })),
    round,
    longestRun,
    doneCount: words.filter((w) => w.mark === 'done' || w.mark === 'light').length,
    complete,
    dropped,
  })

  return {
    state: snapshot,
    /** 餵入一輪聽到的文字，回傳更新後的狀態；整句完成後不再變動 */
    update(heard: string): LiveState {
      if (complete) return snapshot()
      if (screen) {
        const r = screenHeard(heard, MAX_ROUND_WORDS, targetWords)
        if ('dropped' in r) {
          dropped++
          return snapshot()
        }
        heard = r.text
      }
      round++
      const done = owner.map((k) => words[k].mark === 'done')
      const hit = matchParts(
        parts,
        tokenize(heard).flatMap((w) => w.parts),
        done,
      )
      const perWord = tWords.map(() => 0)
      for (const p of hit) perWord[owner[p]]++
      const matched = tWords.map((w, k) => perWord[k] === w.parts.length)

      let run = 0
      for (let k = 0; k < words.length; k++) {
        run = matched[k] ? run + 1 : 0
        longestRun = Math.max(longestRun, run)
        if (!matched[k]) continue
        const w = words[k]
        w.hits++
        if (w.mark !== 'done' && (!confirm || lastHit[k] > round - confirmWindow)) {
          w.mark = 'done'
          w.doneAt = round
        } else if (w.mark === 'todo') w.mark = 'heard'
        lastHit[k] = round
      }
      // 唸到的那輪已滑出確認範圍（下一輪不可能湊滿 2 輪）：確認失敗，退回未完成
      for (let k = 0; k < words.length; k++)
        if (words[k].mark === 'heard' && lastHit[k] <= round + 1 - confirmWindow)
          words[k].mark = 'todo'

      if (words.every((w, k) => !blocking[k] || w.mark === 'done')) {
        complete = true
        for (const w of words) if (w.mark !== 'done') w.mark = 'light'
      }
      return snapshot()
    },
  }
}
