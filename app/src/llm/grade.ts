// 寫作批改：組 prompt → 瀏覽器直呼 OpenRouter → 解析；模型那邊的問題自動換一批再試一次，其餘失敗直接回原因
import { complete, OpenRouterError, type FailureKind } from './client'
import { gradeMessages, type GradeTask } from './gradePrompt'
import type { OpenRouterLink } from './keyStore'
import { modelChain, nextChain } from './models'
import { parseGrade, type GradeResult } from './parseGrade'
import { knownModels } from './startup'
import { localizeGrade, preloadTaiwanZh } from './zhTw'

export type GradeOutcome =
  { ok: true; result: GradeResult; model: string | null } | { ok: false; reason: FailureKind }

/**
 * 批改上限（創辦人試用 2026-10-05：一直停在「批改中…」）：content/eval/results/ledger.jsonl 實測成功回應
 * qwen 中位數 3.3 秒、最慢 24.7 秒，apodex（fallback）中位數 9.7 秒、最慢 12.4 秒；fallback 串接最壞約 37 秒，取 60 秒。
 * 換一批再試時兩批共用這個上限
 */
export const GRADE_TIMEOUT_MS = 60_000

/** 送一批；served＝實際服務的模型（回應裡有才知道，下一批要避開） */
async function attempt(
  apiKey: string,
  models: readonly string[],
  task: GradeTask,
  fetchFn: typeof fetch,
  signal: AbortSignal,
): Promise<{ outcome: GradeOutcome; served: string | null }> {
  try {
    const { text, model } = await complete(
      { apiKey, models, messages: gradeMessages(task), signal },
      fetchFn,
    )
    const result = parseGrade(text, task.answer)
    return {
      served: model,
      outcome: result
        ? { ok: true, result: await localizeGrade(result), model }
        : { ok: false, reason: 'other' },
    }
  } catch (e) {
    if (e instanceof OpenRouterError)
      return { served: null, outcome: { ok: false, reason: e.kind } }
    throw e
  }
}

/**
 * 最多 2 批（創辦人 2026-11-05 裁示：要能自動切換）。other＝模型那邊的問題：實測有整批被上游 429，
 * 也有免費路由選到的模型推理用光 4096 上限、沒有內容；額度用完、金鑰失效、斷網換模型也沒用，不重送
 */
async function request(
  link: Pick<OpenRouterLink, 'apiKey' | 'model'>,
  task: GradeTask,
  fetchFn: typeof fetch,
  signal: AbortSignal,
): Promise<GradeOutcome> {
  const first = modelChain(link.model, knownModels())
  const { outcome, served } = await attempt(link.apiKey, first, task, fetchFn, signal)
  if (outcome.ok || outcome.reason !== 'other' || signal.aborted) return outcome
  const next = nextChain(served ? [...first, served] : first, knownModels())
  if (next.length === 0) return outcome
  return (await attempt(link.apiKey, next, task, fetchFn, signal)).outcome
}

/** 逾時回 other（沿用「AI 這次沒有給出可用的結果」）；signal 中止＝呼叫端離開題目，請求一併中止 */
export async function gradeWriting(
  link: Pick<OpenRouterLink, 'apiKey' | 'model'>,
  task: GradeTask,
  fetchFn: typeof fetch = fetch,
  { signal, timeoutMs = GRADE_TIMEOUT_MS }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<GradeOutcome> {
  // 繁中轉換字典與請求同時載入，回應到時多半已備妥
  preloadTaiwanZh()
  const abort = new AbortController()
  const cancel = () => abort.abort()
  if (signal?.aborted) cancel()
  signal?.addEventListener('abort', cancel)
  let timer: ReturnType<typeof setTimeout> | undefined
  const timedOut = new Promise<GradeOutcome>((resolve) => {
    timer = setTimeout(() => {
      cancel()
      resolve({ ok: false, reason: 'other' })
    }, timeoutMs)
  })
  try {
    return await Promise.race([request(link, task, fetchFn, abort.signal), timedOut])
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cancel)
  }
}
