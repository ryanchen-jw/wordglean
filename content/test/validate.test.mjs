// validator 單元測試。fixture 為手造（test/fixtures/），期望值依 proposal 規則表手推，不重用實作邏輯。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCurriculum, validateTopics } from '../scripts/lib/validate.mjs';

const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));

function load() {
  return {
    a1: fixture('valid/a1.json'),
    a2: fixture('valid/a2.json'),
    lexicon: fixture('lexicon.json'),
    topics: fixture('valid/topics.json'),
  };
}

const run = ({ a1, a2, lexicon, topics }) => validateCurriculum([a1, a2], lexicon, topics);
const summary = (errors) => errors.map((e) => `${e.code} ${e.path}`).sort();

const A1_L1 = 'levels/0/units/0/lessons/0';
const A1_L2 = 'levels/0/units/1/lessons/0';
const A2_L1 = 'levels/1/units/0/lessons/0';

test('合法課綱：無錯（含多詞性字取最低級、C2 字與無級距的多益字不要求排課、大寫 headword 正規化）', () => {
  assert.deepEqual(run(load()), []);
});

test('SCHEMA：缺 units、小課 ID 格式錯', () => {
  const d = load();
  delete d.a2.units;
  d.a1.units[0].lessons[0].id = 'a1-u01-lesson1';
  assert.deepEqual(summary(run(d)), [`SCHEMA ${A1_L1}/id`, 'SCHEMA levels/1']);
});

test('SCHEMA：級距 C2 不在課綱範圍', () => {
  const d = load();
  d.a2.level = 'C2';
  assert.deepEqual(summary(run(d)), ['SCHEMA levels/1/level']);
});

test('DUPLICATE_ID：兩個單元同 ID', () => {
  const d = load();
  d.a1.units[1].id = 'a1-u01';
  d.a1.units[1].lessons[0].id = 'a1-u01-l02';
  assert.deepEqual(summary(run(d)), ['DUPLICATE_ID levels/0/units/1']);
});

test('ID_MISMATCH：A2 檔裡放 a1 的單元 ID', () => {
  const d = load();
  d.a2.units[0].id = 'a1-u05';
  assert.deepEqual(summary(run(d)), ['ID_MISMATCH levels/1/units/0', `ID_MISMATCH ${A2_L1}`]);
});

test('UNKNOWN_TOPIC：主題未列在該級、主題未定義', () => {
  const d = load();
  d.a1.units[0].topic = 'travel';
  d.a1.units[1].topic = 'sports';
  assert.deepEqual(summary(run(d)), ['UNKNOWN_TOPIC levels/0/units/0', 'UNKNOWN_TOPIC levels/0/units/1']);
});

test('UNKNOWN_WORD：不在 lexicon 的字（缺掉的原字另報 MISSING_WORD）', () => {
  const d = load();
  d.a1.units[1].lessons[0].words[4] = 'zebra'; // 換掉 bread
  assert.deepEqual(summary(run(d)), ['MISSING_WORD A1', `UNKNOWN_WORD ${A1_L2}/words/4`]);
});

test('UNKNOWN_WORD：課綱的字必須是小寫 headword', () => {
  const d = load();
  d.a1.units[0].lessons[0].words[0] = 'Hello';
  assert.deepEqual(summary(run(d)), ['MISSING_WORD A1', `UNKNOWN_WORD ${A1_L1}/words/0`]);
});

test('DUPLICATE_INTRO：同一字引入兩次', () => {
  const d = load();
  d.a1.units[1].lessons[0].words[4] = 'hello'; // 換掉 bread
  const errors = run(d);
  assert.deepEqual(summary(errors), [`DUPLICATE_INTRO ${A1_L2}/words/4`, 'MISSING_WORD A1']);
  assert.match(errors.find((e) => e.code === 'MISSING_WORD').message, /bread/);
});

test('LEVEL_MISMATCH：C2 字放進 A1、A2', () => {
  const d = load();
  d.a1.units[0].lessons[0].words.push('esoteric');
  d.a2.units[0].lessons[0].words.push('ubiquitous');
  assert.deepEqual(summary(run(d)), [`LEVEL_MISMATCH ${A1_L1}/words/8`, `LEVEL_MISMATCH ${A2_L1}/words/6`]);
});

test('LEVEL_MISMATCH（D2）：book 名詞 A1、動詞 A2 → 屬 A1，放在 A2 即越級', () => {
  const d = load();
  d.a1.units[1].lessons[0].words.splice(5, 1); // A1 拿掉 book（剩 7 字）
  d.a2.units[0].lessons[0].words.push('book');
  assert.deepEqual(summary(run(d)), [`LEVEL_MISMATCH ${A2_L1}/words/6`]);
});

test('LESSON_SIZE：10／6 為邊界內', () => {
  const d = load();
  const moved = d.a1.units[1].lessons[0].words.splice(0, 2);
  d.a1.units[0].lessons[0].words.push(...moved);
  assert.deepEqual(run(d), []);
});

test('LESSON_SIZE：11／5 兩側越界', () => {
  const d = load();
  const moved = d.a1.units[1].lessons[0].words.splice(0, 3);
  d.a1.units[0].lessons[0].words.push(...moved);
  assert.deepEqual(summary(run(d)), [`LESSON_SIZE ${A1_L1}`, `LESSON_SIZE ${A1_L2}`]);
});

test('MISSING_WORD：該級有字沒排進任何小課', () => {
  const d = load();
  d.a1.units[0].lessons[0].words = d.a1.units[0].lessons[0].words.filter((w) => w !== 'monday');
  const errors = run(d);
  assert.deepEqual(summary(errors), ['MISSING_WORD A1']);
  assert.match(errors[0].message, /monday/);
});

test('MISSING_WORD：缺整個級距檔也要報（A1–C1 每個有級距的字都要排課）', () => {
  const d = load();
  const errors = validateCurriculum([d.a1], d.lexicon, d.topics);
  assert.deepEqual(summary(errors), Array(6).fill('MISSING_WORD A2'));
  assert.match(errors.map((e) => e.message).join(), /passport/);
});

test('MISSING_WORD：C2 字（ubiquitous、esoteric）與 light 的 B1 動詞不要求另排', () => {
  assert.deepEqual(run(load()), []);
});

test('EXCLUDED_WORD：課綱排除字被排進小課要報錯；拿掉後也不報 MISSING_WORD', () => {
  const d = load();
  const opts = { exclude: ['monday'] };
  const errors = validateCurriculum([d.a1, d.a2], d.lexicon, d.topics, opts);
  assert.deepEqual(errors.map((e) => e.code), ['EXCLUDED_WORD']);
  assert.match(errors[0].message, /monday/);
  d.a1.units[0].lessons[0].words = d.a1.units[0].lessons[0].words.filter((w) => w !== 'monday');
  assert.deepEqual(validateCurriculum([d.a1, d.a2], d.lexicon, d.topics, opts), []);
});

test('validateTopics：主題 id 重複、級距引用未定義主題、缺 C1', () => {
  const t = fixture('valid/topics.json');
  t.topics.push({ ...t.topics[0] });
  t.levels.B1 = ['travel', 'office'];
  assert.deepEqual(summary(validateTopics(t)), ['DUPLICATE_ID topics/topics/3', 'UNKNOWN_TOPIC topics/levels/B1/1']);

  const t2 = fixture('valid/topics.json');
  delete t2.levels.C1;
  assert.deepEqual(summary(validateTopics(t2)), ['SCHEMA topics/levels']);
});

test('validateCurriculum 也檢查 topics', () => {
  const d = load();
  d.topics.topics[0].domain = 'work';
  assert.deepEqual(summary(run(d)), ['SCHEMA topics/topics/0/domain']);
});
