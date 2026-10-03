// 撰寫端自查：單字卡例句與同課情境句的雷同（字面重疊＋句型骨架）、mcq 題幹洩漏正解（TASK-9 §11.4、§11.15）。
// 用法：node scripts/selfcheck-similarity.mjs [--threshold 0.4] [--fail] <題目檔…>
// 列出的句對要人工確認「主詞、情境、句型至少換兩項」；--fail 時有任何列出項就 exit 1。

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { loadCheckContext } from './lib/items-context.mjs';
import { similarPairs, skeletonPairs, stemLeaks } from './lib/similarity-lemma.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { threshold: { type: 'string', default: '0.4' }, fail: { type: 'boolean', default: false } },
});
const ctx = loadCheckContext();
let count = 0;
for (const file of positionals) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  for (const p of similarPairs(doc, ctx, Number(values.threshold))) {
    count += 1;
    console.log(`${doc.lessonId}\t卡 ${p.word} ↔ ${p.where}\t${Math.round(p.ratio * 100)}%\t[${p.shared.join(', ')}]\n  卡：${p.card}\n  句：${p.sentence}`);
  }
  for (const p of skeletonPairs(doc, ctx)) {
    count += 1;
    console.log(`${doc.lessonId}\t卡 ${p.word} ↔ ${p.where}\t同句型骨架 ${p.skeleton}\n  卡：${p.card}\n  句：${p.sentence}`);
  }
  for (const id of stemLeaks(doc, ctx)) {
    count += 1;
    console.log(`${doc.lessonId}\t${id} 題幹含正解字或其變形`);
  }
}
console.log(`自查 ${positionals.length} 課：${count ? `${count} 項待人工確認` : '無'}`);
if (values.fail && count) process.exitCode = 1;
