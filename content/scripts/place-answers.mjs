// 撰寫用：決定一課選擇類題的正解位置（規則見 lib/answer-placement.mjs）。
// 用法：node scripts/place-answers.mjs <lessonId> <spec.json>
//   spec＝author-lesson 的 write 格式（{ properNouns, items }，不含 id）；寫出 <spec>.placed.json，再交給 author-lesson write。
//   同級其他課從 items/<level>/ 讀入（本課自己的舊檔排除）。

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertSameAnswers, placeAnswers } from './lib/answer-placement.mjs';
import { DEFAULT_PATHS } from './lib/items-context.mjs';

const [lessonId, specFile] = process.argv.slice(2);
if (!lessonId || !specFile) throw new Error('用法：place-answers.mjs <lessonId> <spec.json>');
const level = lessonId.slice(0, 2);
const spec = JSON.parse(readFileSync(specFile, 'utf8'));
const items = spec.items.map((it, i) => ({ id: `${lessonId}-q${String(i + 1).padStart(2, '0')}`, ...it }));
const dir = join(DEFAULT_PATHS.items, level);
const others = existsSync(dir)
  ? readdirSync(dir)
      .filter((f) => f.endsWith('.json') && f !== `${lessonId}.json`)
      .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
  : [];

const { items: placed, round } = placeAnswers({ lessonId, level: level.toUpperCase(), items }, others);
assertSameAnswers(items, placed);
const outFile = specFile.replace(/\.json$/, '.placed.json');
writeFileSync(outFile, `${JSON.stringify({ properNouns: spec.properNouns ?? [], items: placed.map(({ id, ...rest }) => rest) }, null, 2)}\n`);
const positions = placed.flatMap((it) => (it.type === 'reading' ? it.questions.map((q) => q.answer) : it.type === 'mcq' || it.type === 'listenChoice' ? [it.answer] : []));
console.log(`${lessonId} 正解位置（第 ${round} 輪）：${positions.join(',')} → ${outFile}`);
