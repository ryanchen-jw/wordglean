// 正式課綱（content/curriculum/）對照 data/lexicon/lexicon.json 的整合檢查。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { allocate } from '../scripts/lib/allocate.mjs';
import { insertPhraseUnits, isPhraseUnit } from '../scripts/lib/phrases.mjs';
import { validateCurriculum, validatePhraseUnits, validateWordTopics } from '../scripts/lib/validate.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const lexicon = read('../../data/lexicon/lexicon.json');
const topics = read('../curriculum/topics.json');
const wordTopics = read('../curriculum/word-topics.json');
const phraseUnits = read('../curriculum/phrase-units.json');
const phrases = read('../../data/phrases/phrases.json');
const levels = ['a1', 'a2', 'b1', 'b2', 'c1'].map((l) => read(`../curriculum/${l}.json`));

test('字→主題分類全綠（A1–C1 每字恰分類一次、主題列在該級、每主題切得出合法小課）', () => {
  assert.deepEqual(validateWordTopics(wordTopics, lexicon, topics), []);
});

test('A1–C1 級距檔 validator 全綠（含片語單元）', () => {
  assert.deepEqual(validatePhraseUnits(phraseUnits), []);
  assert.deepEqual(validateCurriculum(levels, lexicon, topics, { phrases }), []);
});

test('已提交的級距檔＝排課器現在的產出（改了分類、phrase-units 或 lexicon 就要重跑 build-curriculum）', () => {
  assert.deepEqual(insertPhraseUnits(allocate(wordTopics, lexicon, topics), phraseUnits), levels);
});

// TASK-24：插入片語單元前（commit bcb5f31）各級 units 的 sha256（JSON.stringify）。片語單元插入後，
// 主題單元（984 課）的 ID、順序、字必須逐位元相同。
const TOPIC_UNITS_BEFORE_PHRASES = {
  a1: ['65f4276a25905892f6ec1130117c7f36469b438405bee6e157ebc283220e6487', 135],
  a2: ['5b23759485f677afe66cede71e38a13a6767a86f10aa021f9fc31916b1b5ac5e', 158],
  b1: ['bb83880be27f096402cac5ce57f7aaf6701f4efbc5299d8b14b5dce86975493d', 269],
  b2: ['9aab4026e65dc551fde4bcba4ea6bb5e2e3df5bc2d7d7aea837a33b6e37f744e', 304],
  c1: ['4058d6e30a5d74f26e5972466e976f2aae591042e888dfd8d919d4f6ff52938e', 118],
};

test('片語單元插入後，既有 984 課主題單元與插入前完全相同', () => {
  let total = 0;
  for (const doc of levels) {
    const topicUnits = doc.units.filter((u) => !isPhraseUnit(u));
    const [hash, lessons] = TOPIC_UNITS_BEFORE_PHRASES[doc.level.toLowerCase()];
    assert.equal(createHash('sha256').update(JSON.stringify(topicUnits)).digest('hex'), hash, doc.level);
    assert.equal(topicUnits.reduce((a, u) => a + u.lessons.length, 0), lessons, doc.level);
    total += lessons;
  }
  assert.equal(total, 984);
});

test('片語單元：A2–C1 共 18 單元 68 課、A1 沒有；ID 為 <級>-pNN／<級>-pNN-lNN', () => {
  const summary = levels.map((doc) => {
    const units = doc.units.filter(isPhraseUnit);
    for (const u of units) {
      assert.equal(u.id.slice(0, 2), doc.level.toLowerCase());
      assert.match(u.id, /^[abc][12]-p\d{2}$/);
      for (const l of u.lessons) assert.ok(l.id.startsWith(`${u.id}-`) && /-l\d{2}$/.test(l.id), l.id);
    }
    return [doc.level, units.length, units.reduce((a, u) => a + u.lessons.length, 0)];
  });
  assert.deepEqual(summary, [['A1', 0, 0], ['A2', 4, 15], ['B1', 5, 20], ['B2', 6, 22], ['C1', 3, 11]]);
  // 每級最後一個單元是片語單元（級末必有一個）
  for (const doc of levels.slice(1)) assert.ok(isPhraseUnit(doc.units.at(-1)), doc.level);
});

test('片語表的 topic 都是 topics.json 的主題', () => {
  const ids = new Set(topics.topics.map((t) => t.id));
  assert.deepEqual(phrases.phrases.filter((p) => !ids.has(p.topic)).map((p) => p.phrase), []);
});

test('創辦人裁示（2026-10-03）：gook、retard 移出課綱，不在任何級距檔', () => {
  const placed = levels.flatMap((d) => d.units.flatMap((u) => u.lessons.flatMap((l) => l.words)));
  assert.deepEqual(placed.filter((w) => w === 'gook' || w === 'retard'), []);
});
