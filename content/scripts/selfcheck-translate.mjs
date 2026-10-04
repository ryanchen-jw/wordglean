// 撰寫端自查：翻譯題彼此雷同（創辦人裁示 2026-10-04 造句改翻譯；撰寫準則 §12）。
// 同課兩題翻譯比字面＋句型骨架，同單元跨課的翻譯比字面。要一次給齊同單元的題目檔，跨課才比得到。
// 用法：node scripts/selfcheck-translate.mjs [--threshold 0.4] [--fail] <題目檔…>
// 列出的句對要改寫（主詞、情境、句型至少換兩項，§11.4）；--fail 時有任何列出項就 exit 1。

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { loadCheckContext } from './lib/items-context.mjs';
import { translatePairs } from './lib/similarity-lemma.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { threshold: { type: 'string', default: '0.4' }, fail: { type: 'boolean', default: false } },
});
const ctx = loadCheckContext();
const docs = positionals.map((file) => JSON.parse(readFileSync(file, 'utf8')));
const pairs = translatePairs(docs, ctx, Number(values.threshold));
for (const p of pairs) {
  const scope = p.scope === 'lesson' ? '同課' : '同單元';
  console.log(`${scope}\t${p.a} ↔ ${p.b}\t${p.reason}\t${Math.round(p.ratio * 100)}%\t[${p.shared.join(', ')}]\n  ${p.sentences[0]}\n  ${p.sentences[1]}`);
}
console.log(`自查 ${docs.length} 課翻譯題：${pairs.length ? `${pairs.length} 組雷同` : '無'}`);
if (values.fail && pairs.length) process.exitCode = 1;
