// 正式主題清單（content/curriculum/topics.json）的檢查。
// 期望值來源：規格 §8／TASK-7 卡（A1–A2 偏生活、B1 起逐步加入多益）；
// ETS《TOEIC Listening and Reading Test Examinee Handbook》列的 13 個情境；
// CEFR 2001 §4.2 引用的 Threshold Level 1990 第 7 章 14 個主題。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateTopics } from '../scripts/lib/validate.mjs';

const topics = JSON.parse(readFileSync(new URL('../curriculum/topics.json', import.meta.url), 'utf8'));
const byId = new Map(topics.topics.map((t) => [t.id, t]));
const toeicCount = (level) => topics.levels[level].filter((id) => byId.get(id).domain === 'toeic').length;

const ETS_SETTINGS = [
  'corporate-development', 'dining-out', 'entertainment', 'finance-budgeting', 'general-business',
  'health', 'housing-corporate-property', 'manufacturing', 'offices', 'personnel',
  'purchasing', 'technical-areas', 'travel',
];

test('通過 schema 與 validateTopics', () => {
  assert.deepEqual(validateTopics(topics), []);
});

test('A1–A2 不含多益職場主題', () => {
  assert.equal(toeicCount('A1'), 0);
  assert.equal(toeicCount('A2'), 0);
});

test('B1 起逐步加入多益主題：B1 有、且 B1 < B2 ≤ C1', () => {
  assert.ok(toeicCount('B1') > 0);
  assert.ok(toeicCount('B1') < toeicCount('B2'));
  assert.ok(toeicCount('B2') <= toeicCount('C1'));
});

test('ETS 13 個情境都有對應主題，且全數出現在 B2', () => {
  const sourced = new Map();
  for (const t of topics.topics) {
    for (const s of t.sources) if (s.startsWith('ets-lr:')) sourced.set(s.slice(7), t.id);
  }
  assert.deepEqual([...sourced.keys()].sort(), ETS_SETTINGS);
  for (const id of sourced.values()) assert.ok(topics.levels.B2.includes(id), id);
});

test('Threshold Level 1990 的 14 個主題都被引用', () => {
  const cited = new Set(topics.topics.flatMap((t) => t.sources).filter((s) => s.startsWith('t90:')));
  assert.deepEqual([...cited].map((s) => Number(s.slice(4))).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
});

test('出處代碼只用已定義的四種前綴', () => {
  for (const t of topics.topics) {
    for (const s of t.sources) assert.match(s, /^(t90:\d+|ets-lr:[a-z-]+|cefr-domain:(personal|public|educational|occupational)|linguaapp)$/, `${t.id}: ${s}`);
  }
});
