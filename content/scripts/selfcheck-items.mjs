// 撰寫自查：情境句雷同（≥40% 列人工複查）、mcq 題幹洩漏正解。規則見 lib/similarity.mjs。
// 用法：node scripts/selfcheck-items.mjs [--review-at 0.4] <題目檔…>
// 複查句對只列出、不影響 exit code（由撰寫者人工判斷）；題幹洩漏 exit 1。

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { createDictLemmas } from './lib/english.mjs';
import { DEFAULT_PATHS } from './lib/items-context.mjs';
import { selfcheck } from './lib/similarity.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { 'review-at': { type: 'string', default: '0.4' }, dict: { type: 'string', default: DEFAULT_PATHS.dict } },
});
const lemmas = createDictLemmas(values.dict);
let reviews = 0;
let leaks = 0;
for (const file of positionals) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const result = selfcheck(doc, { lemmas, reviewAt: Number(values['review-at']) });
  for (const s of result.similar) {
    console.log(`複查 ${doc.lessonId} [${s.word}] ${(s.ratio * 100).toFixed(0)}%  卡：${s.card}  ||  ${s.id}：${s.sentence}`);
  }
  for (const l of result.leaks) console.log(`洩漏 ${l.id} 正解 ${l.answer}：題幹含 ${l.words.join(', ')}`);
  reviews += result.similar.length;
  leaks += result.leaks.length;
}
console.log(`自查 ${positionals.length} 課：複查 ${reviews} 對、題幹洩漏 ${leaks} 處`);
process.exitCode = leaks ? 1 : 0;
