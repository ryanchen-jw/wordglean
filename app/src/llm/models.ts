// 預設批改模型與 fallback。2026-11-05 創辦人裁示：Qwen／Apodex 已下架，不做評測、直接換，Google 系列優先。
// 這三個皆未經評測；docs/research/llm-eval.md §7–§9 的正確率是舊模型的結果，不適用於此。
// 最後一個是非 Google 備援：兩個 Gemma 共用 Google AI Studio 的上游配額，實測會一起 429（OpenRouter
// limit_source: upstream_provider_shared_pool），只放 Gemma 時批改會整個失敗。
export const DEFAULT_MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'xingchen-agi/xing4.0-29b-a4b:free',
] as const

// OpenRouter 實測（2026-11-05）：models 超過 3 個整個請求回 400「'models' array must have 3 items or fewer」；
// 已下架的模型不會讓請求失敗，只是被略過，但仍占名額
const MAX_CHAIN = 3

// 會拿 prompt 訓練的提供商（free-models.md §7 #5）；請求帶 data_collection:deny，選了也會被濾掉
const TRAINS_ON_PROMPTS = /^(nvidia|liquid|thinkingmachines|stealth)\//

/** 清單中還在的 :free 模型，google/ 優先 */
function liveFree(available: ReadonlySet<string>): string[] {
  const free = [...available].filter((m) => m.endsWith(':free') && !TRAINS_ON_PROMPTS.test(m))
  return [
    ...free.filter((m) => m.startsWith('google/')),
    ...free.filter((m) => !m.startsWith('google/')),
  ]
}

/**
 * 批改請求的 models 陣列：使用者選的在前、預設鏈補後（去重）。有清單時濾掉已下架的、空位由還在的 :free 補上。
 * 超過上限時保留尾端的非 Google 備援，而不是兩個會一起 429 的 Gemma
 */
export function modelChain(
  selected: string,
  available: ReadonlySet<string> | null = null,
): string[] {
  const wanted = [...new Set([selected, ...DEFAULT_MODELS])]
  const live = available ? wanted.filter((m) => available.has(m)) : wanted
  const kept = live.length > MAX_CHAIN ? [...live.slice(0, MAX_CHAIN - 1), ...live.slice(-1)] : live
  const chain = [...new Set([...kept, ...(available ? liveFree(available) : [])])]
  return chain.length > 0 ? chain.slice(0, MAX_CHAIN) : modelChain(selected)
}

/**
 * 選定模型已下架時換回預設鏈中第一個還在的；預設鏈也全下架就選清單中還在的 :free（google/ 優先）；
 * 清單拿不到（null）或沒有可用的 :free 時維持原選擇（啟動時檢查，free-models.md §7 #6）
 */
export function availableModel(selected: string, available: ReadonlySet<string> | null): string {
  if (!available || available.has(selected)) return selected
  return DEFAULT_MODELS.find((m) => available.has(m)) ?? liveFree(available)[0] ?? selected
}
