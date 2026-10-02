// TASK-15 預設批改模型評測 CLI。只准 :free（硬守衛，呼叫前拒絕）、每次只送單一模型（不帶 fallback）、不自動重試。
//
// 乾跑（不連網，假端點）：
//   node scripts/llm-eval.mjs --dry-run --models google/gemma-4-31b-it:free,qwen/qwen3.8-27b:free
// 真打（等執行長放行；金鑰只讀進記憶體，任何輸出都不含金鑰）：
//   node scripts/llm-eval.mjs --real --env ../.env --models <4 個 :free 模型，逗號分隔>
// 彙總（不連網）：
//   node scripts/llm-eval.mjs --report --models <同上>
//
// 分日：開跑前查 GET /api/v1/key 的今日剩餘次數，只跑得完的份量；帳本已完成的（模型×題）自動略過，
// 隔天下同一條指令就接續。今日剩餘 ≤2 收工。429：每日額度用完→整批停；上游滿載／每分鐘上限→記 rate_limited、
// 該題排到隊尾稍後再送（排隊，不算重試），連續 5 次 429 就停。其餘失敗記 error、不重送。
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { complete } from '../../app/src/llm/client.ts'
import { GRADE_PROMPT_VERSION, gradeMessages } from '../../app/src/llm/gradePrompt.ts'
import { parseGrade } from '../../app/src/llm/parseGrade.ts'
import {
  assertEvalModel,
  renderReviewSheet,
  renderSummary,
  scoreItem,
  summarize,
  toTask,
  validateSet,
} from './lib/llm-eval.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SET_FILE = resolve(ROOT, 'eval/llm-eval-set.json')
const KEY_ENDPOINT = 'https://openrouter.ai/api/v1/key'
const GAP_MS = 3_000 // 每分鐘 20 次上限（free-models.md §2.1）

const { values: args } = parseArgs({
  options: {
    models: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    real: { type: 'boolean', default: false },
    report: { type: 'boolean', default: false },
    env: { type: 'string' },
    ledger: { type: 'string' },
    limit: { type: 'string' },
  },
})

function fail(message, code = 2) {
  console.error(message)
  process.exit(code)
}

const models = (args.models ?? '').split(',').map((m) => m.trim()).filter(Boolean)
if (models.length === 0) fail('需要 --models（逗號分隔）')
for (const m of models) assertEvalModel(m)

const set = JSON.parse(readFileSync(SET_FILE, 'utf8'))
const setErrors = validateSet(set)
if (setErrors.length) fail(`題組檢查失敗：\n${setErrors.join('\n')}`)

const mode = args.report ? 'report' : args['dry-run'] ? 'dry-run' : args.real ? 'real' : null
if (!mode) fail('需要指定 --dry-run、--real 或 --report（避免誤打真 API）')
const ledgerFile = resolve(
  args.ledger ??
    resolve(ROOT, mode === 'dry-run' ? 'eval/results/dry-run-ledger.jsonl' : 'eval/results/ledger.jsonl'),
)

function readLedger() {
  if (!existsSync(ledgerFile)) return []
  return readFileSync(ledgerFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l))
}

// 只認目前 prompt 版本的紀錄（舊版紀錄留在帳本當歷史、不計分也不算已完成）
const currentRows = () => readLedger().filter((r) => r.prompt === GRADE_PROMPT_VERSION)

function writeReport() {
  const ledger = currentRows()
  const summary = summarize(ledger, set, models)
  const out = [
    `<!-- 由 content/scripts/llm-eval.mjs 產生；prompt ${GRADE_PROMPT_VERSION}；題組 ${set.version}；帳本 ${ledgerFile.replace(ROOT, 'content')} -->`,
    '',
    renderSummary(summary),
    '',
    ...models.map((m) => renderReviewSheet(ledger, set, m) + '\n'),
  ].join('\n')
  const file = ledgerFile.replace(/\.jsonl$/, '.summary.md')
  writeFileSync(file, out)
  console.log(renderSummary(summary))
  console.log(`\n彙總與評審表：${file}`)
}

if (mode === 'report') {
  writeReport()
  process.exit(0)
}

// ---- 金鑰與連網 ----
function readKey(envFile) {
  if (!envFile || !existsSync(envFile)) fail('真打需要 --env 指向含 OPENROUTER_API_KEY 的檔案；本次未呼叫任何 API')
  const line = readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .find((l) => /^\s*OPENROUTER_API_KEY\s*=/.test(l))
  const value = line?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '')
  if (!value) fail(`${envFile} 沒有 OPENROUTER_API_KEY；本次未呼叫任何 API`)
  return value
}

/** 乾跑的假端點：/key 回 50 減已送次數（每次執行重新起算＝模擬隔天）；批改回參考答案（每 7 題一題回非 JSON、每 11 題一題回圍欄 JSON），花費 0 */
function dryRunFetch() {
  let n = 0
  return async (url, init) => {
    if (url === KEY_ENDPOINT)
      return Response.json({ data: { free_model_daily_requests: { used: n, limit: 50, remaining: 50 - n } } })
    const body = JSON.parse(init.body)
    const user = body.messages[1].content
    const item = set.items.find((it) => user.includes(`"""${it.answer}"""`))
    n++
    // 第 5 次模擬上游滿載（200＋error 429），驗證排隊路徑
    if (n === 5)
      return Response.json({ error: { code: 429, message: 'model is temporarily rate-limited upstream' } })
    const result = {
      isCorrect: false,
      corrected: item.referenceEn[0],
      errors: [{ original: item.mustFix[0].wrong, corrected: item.mustFix[0].fix[0], explanationZh: item.rubricZh[0] }],
      explanationZh: item.rubricZh[0],
      levelOk: true,
    }
    const content =
      n % 7 === 0 ? '抱歉，我無法批改。' : n % 11 === 0 ? '```json\n' + JSON.stringify(result) + '\n```' : JSON.stringify(result)
    return Response.json({
      model: body.models[0],
      choices: [{ message: { content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 300, completion_tokens: 120, cost: 0 },
    })
  }
}

const apiKey = mode === 'real' ? readKey(args.env) : 'sk-or-dry-run'
const baseFetch = mode === 'real' ? globalThis.fetch : dryRunFetch()

// 包一層：記下每次回應的狀態碼、錯誤訊息與用量（App 的 complete 不回傳這些）；上游錯誤可能以 200＋error 物件回來
let last = {}
const fetchFn = async (url, init) => {
  const res = await baseFetch(url, init)
  last = { status: res.status, cost: null, message: '' }
  if (url !== KEY_ENDPOINT) {
    const data = await res.clone().json().catch(() => null)
    if (data?.error) {
      last.status = res.ok ? (data.error.code ?? res.status) : res.status
      last.message = String(data.error.message ?? '')
    }
    last.cost = typeof data?.usage?.cost === 'number' ? data.usage.cost : null
  }
  return res
}

const sleep = (ms) => new Promise((r) => setTimeout(r, mode === 'real' ? ms : 0))

async function freeRemaining() {
  const res = await fetchFn(KEY_ENDPOINT, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!res.ok) fail(`GET /key 失敗（HTTP ${res.status}）；停止，不再送出批改請求`)
  const r = (await res.json()).data?.free_model_daily_requests?.remaining
  return typeof r === 'number' ? r : null
}

// ---- 開跑 ----
mkdirSync(dirname(ledgerFile), { recursive: true })
const doneKeys = new Set(
  currentRows()
    .filter((r) => r.status !== 'rate_limited')
    .map((r) => `${r.model}|${r.id}`),
)
const queue = []
for (const item of set.items) for (const model of models) if (!doneKeys.has(`${model}|${item.id}`)) queue.push({ item, model })

// 今日剩餘 ≤ RESERVE 就收工（執行長裁示：留 2 次）；每 10 次重查一次 /key，以實際剩餘為準
const RESERVE = 2
const LIMIT = args.limit ? Number(args.limit) : Infinity
let remaining = await freeRemaining()
console.log(
  `[llm-eval] 模式 ${mode}；待跑 ${queue.length}（已完成 ${doneKeys.size}）；今日免費剩 ${remaining ?? '未知'}；剩 ≤${RESERVE} 收工`,
)

let sent = 0
let since = 0
let consecutive429 = 0
let stopReason = '題目跑完'
while (queue.length > 0) {
  if (since >= 10) {
    remaining = await freeRemaining()
    since = 0
  }
  if (remaining === null || remaining - since <= RESERVE) {
    stopReason = `今日剩餘額度 ≤${RESERVE}（${remaining === null ? '未知' : remaining - since}）`
    break
  }
  if (sent >= LIMIT) {
    stopReason = `達 --limit ${LIMIT}`
    break
  }
  const { item, model } = queue.shift()
  assertEvalModel(model)
  if (sent > 0) await sleep(GAP_MS)
  sent++
  since++
  const started = Date.now()
  const row = { at: new Date().toISOString(), mode, prompt: GRADE_PROMPT_VERSION, set: set.version, model, id: item.id }
  try {
    const r = await complete({ apiKey, models: [model], messages: gradeMessages(toTask(item)) }, fetchFn)
    const parsed = parseGrade(r.text, item.answer)
    Object.assign(row, {
      status: parsed ? 'ok' : 'parse_failed',
      latencyMs: Date.now() - started,
      servedModel: r.model,
      finishReason: r.finishReason,
      cost: last.cost,
      raw: r.text,
      parsed,
      score: scoreItem(item, parsed),
    })
  } catch (e) {
    const rateLimited = last.status === 429
    Object.assign(row, {
      status: rateLimited ? 'rate_limited' : 'error',
      latencyMs: Date.now() - started,
      httpStatus: last.status,
      error: `${String(e?.message ?? e)}${last.message ? `｜${last.message.slice(0, 200)}` : ''}`,
      score: rateLimited ? undefined : scoreItem(item, null),
    })
  }
  appendFileSync(ledgerFile, JSON.stringify(row) + '\n')
  console.log(`[llm-eval] ${model} ${item.id} → ${row.status}${row.score ? (row.score.correct ? ' ✓' : ' ✗') : ''}`)
  if (row.status !== 'rate_limited') {
    consecutive429 = 0
    continue
  }
  // 429：每日免費額度用完 → 整批停；其他（上游滿載、每分鐘上限）→ 這題排到隊尾、稍後再送（排隊，不算重試）
  if (/free-models-per-day/i.test(last.message)) {
    stopReason = '每日免費額度用完（429 free-models-per-day）'
    break
  }
  if (++consecutive429 >= 5) {
    stopReason = '連續 5 次 429，今天先停'
    break
  }
  queue.push({ item, model })
  await sleep(15_000)
}

console.log(`[llm-eval] 收工：${stopReason}；本次送出 ${sent} 次，佇列還剩 ${queue.length}`)
writeReport()
