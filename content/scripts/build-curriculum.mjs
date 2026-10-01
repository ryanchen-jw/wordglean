// 用法：node scripts/build-curriculum.mjs [--lexicon <file>] [--dir <curriculum dir>]
// 讀 <dir>/topics.json、<dir>/word-topics.json 與 lexicon，產生 <dir>/{a1,a2,b1,b2,c1}.json 與 <dir>/STATS.md。
// 先檢查分類檔、產生後再跑 validateCurriculum；任一有錯即逐條印出、exit 1、不寫檔。輸出位元組可重現。

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { allocate } from './lib/allocate.mjs';
import { curriculumStats, renderStats } from './lib/stats.mjs';
import { validateCurriculum, validateWordTopics } from './lib/validate.mjs';

const contentRoot = fileURLToPath(new URL('..', import.meta.url));
const { values } = parseArgs({
  options: {
    lexicon: { type: 'string', default: resolve(contentRoot, '../data/lexicon/lexicon.json') },
    dir: { type: 'string', default: resolve(contentRoot, 'curriculum') },
  },
});

const lexiconBytes = readFileSync(values.lexicon);
const lexicon = JSON.parse(lexiconBytes.toString('utf8'));
const readJson = (name) => JSON.parse(readFileSync(join(values.dir, name), 'utf8'));
const topics = readJson('topics.json');
const wordTopics = readJson('word-topics.json');

function fail(errors) {
  for (const e of errors) console.error(`${e.code}\t${e.path}\t${e.message}`);
  console.log(`${errors.length} 個錯誤，未寫檔`);
  process.exit(1);
}

const tagErrors = validateWordTopics(wordTopics, lexicon, topics);
if (tagErrors.length) fail(tagErrors);

const levels = allocate(wordTopics, lexicon, topics);
const errors = validateCurriculum(levels, lexicon, topics);
if (errors.length) fail(errors);

// 每課的字放同一行，其餘照 JSON.stringify 兩格縮排。
const format = (doc) =>
  JSON.stringify(doc, null, 2).replace(
    /"words": \[\s+([^\]]*?)\s+\]/g,
    (_, items) => `"words": [${items.replace(/,\s+/g, ', ')}]`,
  ) + '\n';

for (const doc of levels) writeFileSync(join(values.dir, `${doc.level.toLowerCase()}.json`), format(doc));

const source = {
  lexiconPath: relative(resolve(contentRoot, '..'), resolve(values.lexicon)).replaceAll('\\', '/'),
  entries: lexicon.length,
  sha256: createHash('sha256').update(lexiconBytes).digest('hex'),
};
writeFileSync(join(values.dir, 'STATS.md'), renderStats(curriculumStats(levels, lexicon, topics), source));

const total = levels.reduce((a, d) => a + d.units.reduce((b, u) => b + u.lessons.length, 0), 0);
console.log(`產生 ${levels.length} 個級距檔、${total} 堂小課；validator 全綠`);
