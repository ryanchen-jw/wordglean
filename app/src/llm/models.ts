// 預設批改模型與 fallback（docs/research/free-models.md §7 #6：只用免費、提供商不拿 prompt 訓練）
// 暫定值；TASK-15 評測（docs/research/llm-eval.md）後依執行長 D3 回寫：正確率最高者為預設、次高為 fallback
export const DEFAULT_MODELS = ['google/gemma-4-31b-it:free', 'qwen/qwen3.8-27b:free'] as const

/** 批改請求的 models 陣列：使用者選的模型在前，預設鏈補在後（去重） */
export function modelChain(selected: string): string[] {
  return [...new Set([selected, ...DEFAULT_MODELS])]
}

/**
 * 選定模型已下架時換回預設鏈中第一個還在的；清單拿不到（null）或都不在時維持原選擇
 * （啟動時檢查，free-models.md §7 #6）
 */
export function availableModel(selected: string, available: ReadonlySet<string> | null): string {
  if (!available || available.has(selected)) return selected
  return DEFAULT_MODELS.find((m) => available.has(m)) ?? selected
}
