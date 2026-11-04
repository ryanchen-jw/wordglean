// 預設批改模型與 fallback。2026-11-05 創辦人裁示：Qwen／Apodex 已下架，不做評測、直接換，Google 系列優先，要能自動切換。
// 這三個皆未經評測；docs/research/llm-eval.md §7–§9 的正確率是舊模型的結果，不適用於此。
// 第二個不選 Gemma 26B：兩個 Gemma 共用 Google AI Studio 的上游配額，實測會一起 429（OpenRouter
// limit_source: upstream_provider_shared_pool）。最後一個是官方免費路由，隨機選一個還在的免費模型當最後防線
const FREE_ROUTER = 'openrouter/free'
export const DEFAULT_MODELS = [
  'google/gemma-4-31b-it:free',
  'xingchen-agi/xing4.0-29b-a4b:free',
  FREE_ROUTER,
] as const

// OpenRouter 實測（2026-11-05）：models 超過 3 個整個請求回 400「'models' array must have 3 items or fewer」；
// 已下架的模型不會讓請求失敗，只是被略過，但仍占名額
const MAX_CHAIN = 3

/** 清單中還在的免費模型（含免費路由），google/ 優先 */
function liveFree(available: ReadonlySet<string>): string[] {
  const free = [...available].filter((m) => m.endsWith(':free') || m === FREE_ROUTER)
  return [
    ...free.filter((m) => m.startsWith('google/')),
    ...free.filter((m) => !m.startsWith('google/')),
  ]
}

/**
 * 批改請求的 models 陣列：使用者選的在前、預設鏈補後（去重）。有清單時濾掉已下架的、空位由還在的免費模型補上。
 * 超過上限時保留最後一格的最後防線
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
 * 第一批失敗後的下一批：還沒試過的免費模型（google/ 優先），最後一格仍放免費路由（隨機，再試可能選到別的）。
 * 清單拿不到時只有免費路由；沒有可試的回空陣列
 */
export function nextChain(
  tried: readonly string[],
  available: ReadonlySet<string> | null,
): string[] {
  if (!available) return [FREE_ROUTER]
  const untried = liveFree(available).filter((m) => m !== FREE_ROUTER && !tried.includes(m))
  const router = available.has(FREE_ROUTER) ? [FREE_ROUTER] : []
  return [...untried.slice(0, MAX_CHAIN - router.length), ...router]
}

/**
 * 選定模型已下架時，換成清單中還在的免費模型：google/ 優先，同條件時預設鏈的在前；
 * 清單拿不到（null）或沒有可用的免費模型時維持原選擇（啟動時檢查，free-models.md §7 #6）
 */
export function availableModel(selected: string, available: ReadonlySet<string> | null): string {
  if (!available || available.has(selected)) return selected
  const ranked = [...DEFAULT_MODELS.filter((m) => available.has(m)), ...liveFree(available)]
  return ranked.find((m) => m.startsWith('google/')) ?? ranked[0] ?? selected
}
