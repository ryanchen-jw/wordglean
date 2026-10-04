// 寫作批改：組 prompt → 瀏覽器直呼 OpenRouter → 解析；任何失敗都回失敗原因（不自動重試）
import { complete, OpenRouterError, type FailureKind } from './client'
import { gradeMessages, type GradeTask } from './gradePrompt'
import type { OpenRouterLink } from './keyStore'
import { modelChain } from './models'
import { parseGrade, type GradeResult } from './parseGrade'
import { localizeGrade } from './zhTw'

export type GradeOutcome =
  { ok: true; result: GradeResult; model: string | null } | { ok: false; reason: FailureKind }

export async function gradeWriting(
  link: Pick<OpenRouterLink, 'apiKey' | 'model'>,
  task: GradeTask,
  fetchFn: typeof fetch = fetch,
): Promise<GradeOutcome> {
  try {
    const { text, model } = await complete(
      { apiKey: link.apiKey, models: modelChain(link.model), messages: gradeMessages(task) },
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
