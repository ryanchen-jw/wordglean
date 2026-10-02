// 用法：node scripts/fetch-prices.mjs [--out <file>] <model id…>
// 從 OpenRouter 公開模型清單（不需金鑰）抓指定模型的單價，存成定價快照（USD／百萬 token）。

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CONTENT_ROOT } from './lib/items-context.mjs';

const URL_MODELS = 'https://openrouter.ai/api/v1/models';
// 檔名用台北日期（UTC 日期在台北上午 8 點前會是前一天，曾因此覆蓋舊快照）。
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { out: { type: 'string', default: resolve(CONTENT_ROOT, `pricing/openrouter-${today}.json`) } },
});
if (!positionals.length) throw new Error('請列出要查的模型 id');

const response = await fetch(URL_MODELS);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const { data } = await response.json();
const models = {};
for (const id of positionals) {
  const m = data.find((x) => x.id === id);
  if (!m) throw new Error(`OpenRouter 沒有模型 ${id}`);
  models[id] = {
    name: m.name,
    promptPerM: Number((Number(m.pricing.prompt) * 1e6).toFixed(6)),
    completionPerM: Number((Number(m.pricing.completion) * 1e6).toFixed(6)),
    contextLength: m.context_length,
  };
}
const snapshot = { source: URL_MODELS, fetchedAt: new Date().toISOString(), unit: 'USD per 1M tokens', models };
writeFileSync(values.out, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`寫入 ${values.out}（${positionals.length} 個模型）`);
