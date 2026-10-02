// TASK-15 預設批改模型評測（純邏輯）：題組檢查、:free 硬守衛、評分、彙總。
// prompt 與解析器直接用 App 的同一份（app/src/llm/*.ts，Node 22 型別剝除），評測與產品行為一致。
// 評分（執行長 D4）：修正正確性＝模型判錯（isCorrect=false）且批改句不再含每個 wrong、含 fix 任一寫法（不分大小寫）；
// 繁中解釋品質另由人工逐句評（renderReviewSheet 產出評審表）。

export class FreeOnlyError extends Error {}

// 只准 id 以 :free 結尾的模型；openrouter/free（隨機路由）不以 :free 結尾、一併擋下。
// NVIDIA 免費端點適用 Trial Terms（限內部評估、不得 production），執行長 D1 排除。
export function assertEvalModel(model) {
  if (typeof model !== 'string' || !model.endsWith(':free'))
    throw new FreeOnlyError(`只准 :free 模型，拒絕呼叫 ${model}`)
  if (model.startsWith('nvidia/'))
    throw new FreeOnlyError(`NVIDIA 免費端點不得作為產品預設（執行長 D1），拒絕 ${model}`)
}

const lower = (s) => String(s ?? '').toLowerCase()
const has = (text, part) => lower(text).includes(lower(part))

/** 題組結構檢查；回傳錯誤訊息陣列（空＝通過） */
export function validateSet(set) {
  const errors = []
  const ids = new Set()
  if (!Array.isArray(set?.items)) return ['items 不是陣列']
  for (const it of set.items) {
    const where = it?.id ?? '(無 id)'
    if (ids.has(it.id)) errors.push(`${where}：id 重複`)
    ids.add(it.id)
    if (!['translate', 'makeSentence'].includes(it.kind)) errors.push(`${where}：kind 不對`)
    if (!['A1', 'A2', 'B1', 'B2', 'C1'].includes(it.level)) errors.push(`${where}：level 不對`)
    for (const k of ['promptZh', 'answer', 'errorType'])
      if (typeof it[k] !== 'string' || !it[k].trim()) errors.push(`${where}：缺 ${k}`)
    for (const k of ['words', 'referenceEn', 'rubricZh'])
      if (!Array.isArray(it[k])) errors.push(`${where}：${k} 不是陣列`)
    if (!Array.isArray(it.mustFix) || it.mustFix.length === 0) errors.push(`${where}：缺 mustFix`)
    for (const m of it.mustFix ?? []) {
      // 錯句必須真的含錯誤點；參考答案必須不含錯誤點、且含某個正確寫法（評分規則自身的正確性）
      if (!has(it.answer, m.wrong)) errors.push(`${where}：answer 不含 wrong「${m.wrong}」`)
      for (const r of it.referenceEn ?? []) {
        if (has(r, m.wrong)) errors.push(`${where}：參考答案含 wrong「${m.wrong}」`)
        if (!m.fix.some((f) => has(r, f))) errors.push(`${where}：參考答案「${r}」不含任一 fix`)
      }
    }
  }
  return errors
}

/** App 的批改任務格式（app/src/llm/gradePrompt.ts GradeTask） */
export function toTask(item) {
  return {
    kind: item.kind,
    promptZh: item.promptZh,
    words: item.words,
    referenceEn: item.referenceEn,
    rubricZh: item.rubricZh,
    level: item.level,
    answer: item.answer,
  }
}

/** 單句評分；parsed＝App parseGrade 的結果（null＝解析失敗） */
export function scoreItem(item, parsed) {
  if (!parsed) return { parsed: false, detected: false, fixed: false, correct: false }
  const detected = parsed.isCorrect === false
  const fixed = item.mustFix.every(
    (m) => !has(parsed.corrected, m.wrong) && m.fix.some((f) => has(parsed.corrected, f)),
  )
  return { parsed: true, detected, fixed, correct: detected && fixed }
}

/**
 * 帳本彙總：每個模型取每題最後一筆「已完成」紀錄（status ok／parse_failed／error）；
 * rate_limited（延後、下次補跑）不計入。花費取 usage.cost 加總
 */
export function summarize(ledger, set, models) {
  const total = set.items.length
  return models.map((model) => {
    const latest = new Map()
    for (const row of ledger)
      if (row.model === model && row.status !== 'rate_limited') latest.set(row.id, row)
    const rows = [...latest.values()]
    const done = rows.length
    const count = (pred) => rows.filter(pred).length
    const latencies = rows.filter((r) => r.status !== 'error').map((r) => r.latencyMs)
    return {
      model,
      total,
      done,
      parsed: count((r) => r.score?.parsed),
      detected: count((r) => r.score?.detected),
      correct: count((r) => r.score?.correct),
      errors: count((r) => r.status === 'error'),
      costUsd: rows.reduce((s, r) => s + (typeof r.cost === 'number' ? r.cost : 0), 0),
      medianLatencyMs: latencies.length
        ? latencies.sort((a, b) => a - b)[Math.floor(latencies.length / 2)]
        : null,
    }
  })
}

const pct = (n, d) => (d ? `${Math.round((n / d) * 1000) / 10}%` : '—')

export function renderSummary(summary) {
  const lines = [
    '| 模型 | 完成／總數 | 正確率（判錯且修對） | 有判出錯誤 | 解析成功 | 呼叫失敗 | 延遲中位數 | 花費（US$） |',
    '|---|---|---|---|---|---|---|---|',
  ]
  for (const s of summary)
    lines.push(
      `| \`${s.model}\` | ${s.done}／${s.total} | ${s.correct}（${pct(s.correct, s.total)}） | ${s.detected} | ${s.parsed} | ${s.errors} | ${s.medianLatencyMs === null ? '—' : `${(s.medianLatencyMs / 1000).toFixed(1)} 秒`} | ${s.costUsd.toFixed(4)} |`,
    )
  return lines.join('\n')
}

/** 繁中解釋品質評審表（D4：worker 逐句評、執行長抽審）；分數欄留空 */
export function renderReviewSheet(ledger, set, model) {
  const latest = new Map()
  for (const row of ledger)
    if (row.model === model && row.status !== 'rate_limited') latest.set(row.id, row)
  const lines = [
    `### ${model}`,
    '',
    '| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |',
    '|---|---|---|---|---|---|---|',
  ]
  for (const item of set.items) {
    const r = latest.get(item.id)
    const p = r?.parsed
    const expl = p
      ? [...new Set([...p.errors.map((e) => e.explanationZh), p.explanationZh])]
          .filter(Boolean)
          .join(' ')
      : `（${r?.status ?? '未跑'}）`
    lines.push(
      `| ${item.id} | ${item.errorType} | ${item.answer} | ${p?.corrected ?? '—'} | ${r?.score?.correct ? '✓' : '✗'} | ${expl.replace(/\|/g, '／').replace(/\n/g, ' ')} |  |`,
    )
  }
  return lines.join('\n')
}
