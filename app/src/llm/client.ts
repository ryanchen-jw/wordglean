// OpenRouter 用戶端（瀏覽器直呼；伺服器永不碰金鑰）。只打 https://openrouter.ai/api/v1/*；不自動重試
// 端點與欄位：models（公開、免金鑰）、key（每日免費額度 free_model_daily_requests）、chat/completions；
// 錯誤碼：https://openrouter.ai/docs/api/reference/errors-and-debugging（2026-10-02 查）
export const OPENROUTER_ORIGIN = 'https://openrouter.ai'
export const OPENROUTER_API = `${OPENROUTER_ORIGIN}/api/v1`

/** 失敗原因：額度用完／網路／金鑰失效／其他（上游忙碌、模型下架、回應讀不懂） */
export type FailureKind = 'quota' | 'network' | 'keyInvalid' | 'other'

export class OpenRouterError extends Error {
  readonly kind: FailureKind
  constructor(kind: FailureKind, detail = '') {
    super(`OpenRouter ${kind}${detail ? `：${detail}` : ''}`)
    this.kind = kind
  }
}

// 每日免費額度用完：官方錯誤碼文件沒寫訊息原文；實務回 429「Rate limit exceeded: free-models-per-day」，
// 另以剩餘次數 header 為 0 判斷（兩者任一）
const FREE_DAILY = /free-models-per-day/i

export function classify(
  status: number,
  message: string,
  remainingHeader: string | null,
): FailureKind {
  if (status === 401 || status === 403) return 'keyInvalid'
  if (status === 402) return 'quota'
  if (status === 429 && (FREE_DAILY.test(message) || remainingHeader === '0')) return 'quota'
  return 'other'
}

async function send(fetchFn: typeof fetch, url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetchFn(url, init)
  } catch {
    throw new OpenRouterError('network')
  }
}

async function fail(res: Response): Promise<never> {
  const body = await res.text().catch(() => '')
  let message = body
  try {
    message = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body
  } catch {
    // 非 JSON：用原文判斷
  }
  throw new OpenRouterError(
    classify(res.status, message, res.headers.get('x-ratelimit-remaining')),
    `HTTP ${res.status}`,
  )
}

const auth = (apiKey: string) => ({ Authorization: `Bearer ${apiKey}` })

export interface KeyInfo {
  /** 今日免費模型剩餘次數；OpenRouter 沒回此欄時為 null */
  freeRemaining: number | null
}

/** 驗證金鑰並讀今日免費額度（GET /key）；金鑰無效拋 keyInvalid */
export async function fetchKeyInfo(
  apiKey: string,
  fetchFn: typeof fetch = fetch,
): Promise<KeyInfo> {
  const res = await send(fetchFn, `${OPENROUTER_API}/key`, { headers: auth(apiKey) })
  if (!res.ok) await fail(res)
  const data = (await res.json().catch(() => ({}))) as {
    data?: { free_model_daily_requests?: { remaining?: unknown } }
  }
  const remaining = data.data?.free_model_daily_requests?.remaining
  return { freeRemaining: typeof remaining === 'number' ? remaining : null }
}

export interface ModelInfo {
  id: string
  name: string
  free: boolean
  /** 美元／每百萬 token（輸入、輸出） */
  promptPerM: number
  completionPerM: number
}

interface RawModel {
  id?: unknown
  name?: unknown
  pricing?: { prompt?: unknown; completion?: unknown }
  architecture?: { input_modalities?: unknown; output_modalities?: unknown }
}

const perMillion = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 1e6 * 1e4) / 1e4 : NaN
}
const hasText = (v: unknown) => Array.isArray(v) && v.includes('text')

/** 模型清單（公開 API、不帶金鑰）：只留文字進、文字出的模型；免費在前，其餘依名稱 */
export async function listModels(fetchFn: typeof fetch = fetch): Promise<ModelInfo[]> {
  const res = await send(fetchFn, `${OPENROUTER_API}/models`, {})
  if (!res.ok) await fail(res)
  const raw = ((await res.json().catch(() => ({}))) as { data?: RawModel[] }).data ?? []
  const models: ModelInfo[] = []
  for (const m of raw) {
    if (typeof m.id !== 'string') continue
    if (!hasText(m.architecture?.input_modalities) || !hasText(m.architecture?.output_modalities))
      continue
    const promptPerM = perMillion(m.pricing?.prompt)
    const completionPerM = perMillion(m.pricing?.completion)
    // 價格欄為負數（-1＝路由／變動計價）或缺漏的模型無法標價，不列
    if (Number.isNaN(promptPerM) || Number.isNaN(completionPerM)) continue
    models.push({
      id: m.id,
      name: typeof m.name === 'string' && m.name ? m.name : m.id,
      free: m.id.endsWith(':free') || (promptPerM === 0 && completionPerM === 0),
      promptPerM,
      completionPerM,
    })
  }
  return models.sort((a, b) => Number(b.free) - Number(a.free) || a.name.localeCompare(b.name))
}

export interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

export interface CompletionResult {
  text: string
  /** 實際服務的模型（fallback 時與第一個不同） */
  model: string | null
  finishReason: string | null
}

/**
 * 批改請求：models 陣列設 fallback、provider.data_collection:"deny" 只走不保留資料的提供商
 * （free-models.md §7 #6）、要求 JSON 物件輸出；推理強度 low 以免推理 token 吃光輸出上限。
 * 輸出上限 4096：1500 時 apodex（fallback）推理就用光上限，v2 評測 38／40 截斷（llm-eval.md §7、§9）。
 * reasoning 與 max_tokens 是整個請求共用（models fallback 走同一請求），無法只對 apodex 關推理；
 * 不送 reasoning 會讓 qwen 回到預設 xhigh，故保留 effort low、只提高上限。評測腳本走同一個 complete() 預設值。
 * 2026-11-05 換模型後：現行預設鏈的端點 supported_parameters 皆含 reasoning、response_format、max_tokens，未改動這些參數
 */
export async function complete(
  {
    apiKey,
    models,
    messages,
    maxTokens = 4096,
    signal,
  }: {
    apiKey: string
    models: readonly string[]
    messages: readonly ChatMessage[]
    maxTokens?: number
    /** 中止請求（逾時、離開題目） */
    signal?: AbortSignal
  },
  fetchFn: typeof fetch = fetch,
): Promise<CompletionResult> {
  const res = await send(fetchFn, `${OPENROUTER_API}/chat/completions`, {
    signal,
    method: 'POST',
    headers: { ...auth(apiKey), 'Content-Type': 'application/json', 'X-Title': 'Wordglean' },
    body: JSON.stringify({
      models,
      messages,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      reasoning: { effort: 'low' },
      provider: { data_collection: 'deny' },
    }),
  })
  if (!res.ok) await fail(res)
  const data = (await res.json().catch(() => null)) as {
    error?: { code?: number; message?: string }
    model?: string
    choices?: { message?: { content?: unknown }; finish_reason?: string }[]
  } | null
  if (!data) throw new OpenRouterError('other', '回應不是 JSON')
  // 上游錯誤可能以 200＋error 物件回來
  if (data.error)
    throw new OpenRouterError(
      classify(data.error.code ?? 500, data.error.message ?? '', null),
      `error ${data.error.code}`,
    )
  const choice = data.choices?.[0]
  const content = choice?.message?.content
  return {
    text: typeof content === 'string' ? content : '',
    model: data.model ?? null,
    finishReason: choice?.finish_reason ?? null,
  }
}
