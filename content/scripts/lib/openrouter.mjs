// OpenRouter 用戶端。只准 :free 模型（硬守衛，呼叫前拒絕）；不重試：錯誤直接拋出，由呼叫端分類處理。
// 用量：每個回應自動附 usage（prompt_tokens、completion_tokens、cost）——
// https://openrouter.ai/docs/use-cases/usage-accounting（2026-10-01 查）。
// 每日免費額度：GET /api/v1/key 的 free_model_daily_requests——docs/research/free-models.md §2.1。

import { existsSync, readFileSync } from 'node:fs';

export const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
export const KEY_ENDPOINT = 'https://openrouter.ai/api/v1/key';

export class MissingKeyError extends Error {}
export class FreeOnlyError extends Error {}
export class NetworkBlockedError extends Error {}

// 測試環境（NODE_ENV=test）或離線模式（LINGUAAPP_OFFLINE=1，--fixture 會設）不准真連網：
// 呼叫端沒有明確注入 fetch 時，送出前一律拒絕（2026-10-02 測試曾以假金鑰打到 /key，執行長裁示加此守衛）。
const networkBlocked = () => process.env.NODE_ENV === 'test' || process.env.LINGUAAPP_OFFLINE === '1';
export class ApiError extends Error {
  constructor(status, body) {
    super(`OpenRouter HTTP ${status}：${body.slice(0, 300)}`);
    this.status = status;
  }
}
// 429（平台限流或上游提供商滿載）：呼叫端排隊延後，不算錯誤。
export class RateLimitError extends ApiError {
  constructor(status, body, detail) {
    super(status, body);
    this.detail = detail;
  }
}

// 只准 id 以 :free 結尾的模型（openrouter/free 隨機路由，不以 :free 結尾，也一併擋下）。
export function assertFreeModel(model) {
  if (typeof model !== 'string' || !model.endsWith(':free')) {
    throw new FreeOnlyError(`只准 :free 模型，拒絕呼叫 ${model}`);
  }
}

// 金鑰：環境變數 OPENROUTER_API_KEY 優先，其次 envFile（repo 根 .env）的同名列。只讀進記憶體，不寫任何輸出。
export function readApiKey({ env = process.env, envFile } = {}) {
  if (env.OPENROUTER_API_KEY) return env.OPENROUTER_API_KEY.trim();
  if (envFile && existsSync(envFile)) {
    const line = readFileSync(envFile, 'utf8')
      .split(/\r?\n/)
      .find((l) => /^\s*OPENROUTER_API_KEY\s*=/.test(l));
    const value = line?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    if (value) return value;
  }
  throw new MissingKeyError(
    `缺少 OPENROUTER_API_KEY：真打 API 需在環境變數或 ${envFile ?? 'repo 根 .env'} 設定開發方金鑰（.env 不進 git）。` +
      '本次未呼叫任何 API。只想乾跑請加 --fixture。',
  );
}

function rateLimitDetail(response, body) {
  let providerCode = null;
  let providerName = null;
  try {
    const meta = JSON.parse(body).error?.metadata ?? {};
    providerCode = meta.provider_code ?? null;
    providerName = meta.provider_name ?? null;
  } catch {
    // 非 JSON 回應：只記 header
  }
  return {
    limit: response.headers?.get?.('x-ratelimit-limit') ?? null,
    remaining: response.headers?.get?.('x-ratelimit-remaining') ?? null,
    reset: response.headers?.get?.('x-ratelimit-reset') ?? null,
    providerCode,
    providerName,
  };
}

export function createOpenRouterClient({ apiKey, fetch: injected, endpoint = ENDPOINT, keyEndpoint = KEY_ENDPOINT }) {
  if (!apiKey) throw new MissingKeyError('createOpenRouterClient 需要 apiKey');
  const fetch = (...args) => {
    if (!injected && networkBlocked()) {
      throw new NetworkBlockedError('測試或離線模式下不准真連網（NODE_ENV=test 或 LINGUAAPP_OFFLINE=1）；請注入假 fetch');
    }
    return (injected ?? globalThis.fetch)(...args);
  };
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'LinguaApp content generation' };
  return {
    // reasoningEffort＝null 表示不送 reasoning 欄（例：Gemma 預設不推理）。
    async complete({ model, messages, maxTokens, reasoningEffort = 'low' }) {
      assertFreeModel(model);
      const started = Date.now();
      const payload = { model, messages, max_tokens: maxTokens };
      if (reasoningEffort) payload.reasoning = { effort: reasoningEffort };
      const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(payload) });
      const body = await response.text();
      if (response.status === 429) throw new RateLimitError(429, body, rateLimitDetail(response, body));
      if (!response.ok) throw new ApiError(response.status, body);
      const data = JSON.parse(body);
      // 上游錯誤可能以 200＋error 物件回來。
      if (data.error) {
        if (data.error.code === 429) throw new RateLimitError(429, body, rateLimitDetail(response, body));
        throw new ApiError(data.error.code ?? response.status, body);
      }
      const usage = data.usage ?? {};
      return {
        text: data.choices?.[0]?.message?.content ?? '',
        finishReason: data.choices?.[0]?.finish_reason ?? null,
        provider: data.provider ?? null,
        servedModel: data.model ?? null,
        usage: {
          promptTokens: usage.prompt_tokens ?? null,
          completionTokens: usage.completion_tokens ?? null,
          reasoningTokens: usage.completion_tokens_details?.reasoning_tokens ?? null,
          cost: typeof usage.cost === 'number' ? usage.cost : null,
        },
        durationMs: Date.now() - started,
      };
    },
    // 每日免費額度。
    async keyInfo() {
      const response = await fetch(keyEndpoint, { method: 'GET', headers });
      const body = await response.text();
      if (!response.ok) throw new ApiError(response.status, body);
      const data = JSON.parse(body).data ?? {};
      const daily = data.free_model_daily_requests ?? {};
      return { remaining: daily.remaining ?? null, used: daily.used ?? null, limit: daily.limit ?? null, isFreeTier: data.is_free_tier ?? null };
    },
  };
}
