// 定價快照與 token 估算。快照由 scripts/fetch-prices.mjs 產生（content/pricing/openrouter-<日期>.json）。

import { readFileSync } from 'node:fs';

// 粗估 token：ASCII 字元／4＋非 ASCII 字元×1（中文約一字一 token）。真打後以帳本實數校正。
export function estimateTokens(text) {
  let ascii = 0;
  let other = 0;
  for (const ch of text) {
    if (ch.charCodeAt(0) < 128) ascii += 1;
    else other += 1;
  }
  return Math.ceil(ascii / 4 + other);
}

export const messagesTokens = (messages) => messages.reduce((n, m) => n + estimateTokens(m.content) + 4, 0);

export function loadPrices(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

// prices.models[id] = { promptPerM, completionPerM }（USD／百萬 token）
export function callCost(prices, model, promptTokens, completionTokens) {
  const p = prices.models[model];
  if (!p) throw new Error(`定價快照沒有模型 ${model}`);
  return (promptTokens * p.promptPerM + completionTokens * p.completionPerM) / 1e6;
}
