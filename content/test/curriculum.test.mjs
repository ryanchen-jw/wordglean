// 正式課綱（content/curriculum/）對照 data/lexicon/lexicon.json 的整合檢查。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allocate } from '../scripts/lib/allocate.mjs';
import { validateCurriculum, validateWordTopics } from '../scripts/lib/validate.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const lexicon = read('../../data/lexicon/lexicon.json');
const topics = read('../curriculum/topics.json');
const wordTopics = read('../curriculum/word-topics.json');
const levels = ['a1', 'a2', 'b1', 'b2', 'c1'].map((l) => read(`../curriculum/${l}.json`));

test('字→主題分類全綠（A1–C1 每字恰分類一次、主題列在該級、每主題切得出合法小課）', () => {
  assert.deepEqual(validateWordTopics(wordTopics, lexicon, topics), []);
});

test('A1–C1 級距檔 validator 全綠', () => {
  assert.deepEqual(validateCurriculum(levels, lexicon, topics), []);
});

test('已提交的級距檔＝排課器現在的產出（改了分類或 lexicon 就要重跑 build-curriculum）', () => {
  assert.deepEqual(allocate(wordTopics, lexicon, topics), levels);
});

test('創辦人裁示（2026-10-03）：gook、retard 移出課綱，不在任何級距檔', () => {
  const placed = levels.flatMap((d) => d.units.flatMap((u) => u.lessons.flatMap((l) => l.words)));
  assert.deepEqual(placed.filter((w) => w === 'gook' || w === 'retard'), []);
});
