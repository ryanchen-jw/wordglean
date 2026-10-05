// 寫作批改：組 prompt → 瀏覽器直呼 OpenRouter → 解析；任何失敗都回失敗原因（不自動重試）
import { complete, OpenRouterError, type FailureKind } from './client'
import { gradeMessages, type GradeTask } from './gradePrompt'
import type { OpenRouterLink } from './keyStore'
import { modelChain } from './models'
import { parseGrade, type GradeResult } from './parseGrade'
import { localizeGrade, preloadTaiwanZh } from './zhTw'

export type GradeOutcome =
  { ok: true; result: GradeResult; model: string | null } | { ok: false; reason: FailureKind }

/**
 * 批改上限（創辦人試用 2026-10-05：一直停在「批改中…」）：content/eval/results/ledger.jsonl 實測成功回應
 * qwen 中位數 3.3 秒、最慢 24.7 秒，apodex（fallback）中位數 9.7 秒、最慢 12.4 秒；fallback 串接最壞約 37 秒，取 60 秒
 */
export const GRADE_TIMEOUT_MS = 60_000

async function request(
  link: Pick<OpenRouterLink, 'apiKey' | 'model'>,
  task: GradeTask,
  fetchFn: typeof fetch,
  signal: AbortSignal,
): Promise<GradeOutcome> {
  try {
    const { text, model } = await complete(
      {
        apiKey: link.apiKey,
        models: modelChain(link.model),
        messages: gradeMessages(task),
        signal,
      },
      fetchFn,
    )
    const result = parseGrade(text, task.answer)
    return result
      ? { ok: true, result: await localizeGrade(result), model }
      : { ok: false, reason: 'other' }
  } catch (e) {
    if (e instanceof OpenRouterError) return { ok: false, reason: e.kind }
    throw e
  }
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
