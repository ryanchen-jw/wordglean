// 片語單元（TASK-24）：insertPhraseUnits()、validateCurriculum() 的片語規則、schema、統計。fixture 在測試內手造。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocate } from '../scripts/lib/allocate.mjs';
import { insertPhraseUnits } from '../scripts/lib/phrases.mjs';
import { curriculumStats } from '../scripts/lib/stats.mjs';
import { validateCurriculum, validatePhraseUnits } from '../scripts/lib/validate.mjs';

const entry = (headword, cefr, freqRank = null) => ({
  id: `${headword}#n`,
  headword,
  pos: 'n',
  cefr,
  cefrSource: 'cefrj',
  toeic: false,
  ngsl: false,
  freqRank,
  glossZh: null,
});
const words = (prefix, n) => Array.from({ length: n }, (_, i) => entry(`${prefix}${String(i + 1).padStart(2, '0')}`, 'A1', i + 1));

// A1：alpha 12 字（a1-u01，2 課）、beta 8 字（a1-u02，1 課）；hi 屬 B1（下調測試用）
const lexicon = [...words('a', 12), ...words('b', 8), entry('hi', 'B1')];
const topics = {
  schemaVersion: 1,
  topics: [
    { id: 'alpha', titleZh: '甲', titleEn: 'Alpha', domain: 'life', scope: '-', sources: ['fixture'] },
    { id: 'beta', titleZh: '乙', titleEn: 'Beta', domain: 'life', scope: '-', sources: ['fixture'] },
  ],
  levels: { A1: ['alpha', 'beta'], A2: ['alpha'], B1: ['alpha'], B2: ['alpha'], C1: ['alpha'] },
};
const base = allocate(
  { schemaVersion: 1, levels: { A1: { alpha: lexicon.slice(0, 12).map((e) => e.headword), beta: lexicon.slice(12, 20).map((e) => e.headword) } } },
  lexicon,
  topics,
);

const phrase = (p, components, extra = {}) => ({ phrase: p, type: 'pv', cefr: 'A1', glossZh: '測', components, separable: false, topic: 'alpha', ...extra });
// p1–p6 只用 a 字（a1-u01 教過）；q1–q6 用到 b01（a1-u02 才教）
const P = Array.from({ length: 6 }, (_, i) => phrase(`a0${i + 1} up`, [`a0${i + 1}`, 'a07']));
const Q = Array.from({ length: 6 }, (_, i) => phrase(`b01 a0${i + 1}`, ['b01', `a0${i + 1}`]));
const table = (...extra) => ({ schemaVersion: 1, phrases: [...P, ...Q, ...extra] });
const units = (...specs) => ({ schemaVersion: 1, levels: { A1: specs } });
const pNames = P.map((p) => p.phrase);
const qNames = Q.map((p) => p.phrase);
// hi 屬 B1、fixture 不排 B1 課 → 以排除字略過 MISSING_WORD
const validate = (docs, phrases) => validateCurriculum(docs, lexicon, topics, { phrases, exclude: ['hi'] });
const codes = (errors) => errors.map((e) => `${e.code} ${e.path}`);

test('insertPhraseUnits：插在指定主題單元之後、ID 依片語單元順序、標題（一）（二）；主題單元原封不動', () => {
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u01', lessons: [pNames] }, { after: 'a1-u02', lessons: [qNames] }));
  assert.deepEqual(
    doc.units.map((u) => [u.id, u.kind ?? u.topic, u.titleZh, u.lessons.map((l) => l.id)]),
    [
      ['a1-u01', 'alpha', '甲', ['a1-u01-l01', 'a1-u01-l02']],
      ['a1-p01', 'phrase', '常用片語（一）', ['a1-p01-l01']],
      ['a1-u02', 'beta', '乙', ['a1-u02-l01']],
      ['a1-p02', 'phrase', '常用片語（二）', ['a1-p02-l01']],
    ],
  );
  assert.deepEqual(doc.units.filter((u) => !u.kind), base[0].units);
  assert.deepEqual(validate([doc], table()), []);
});

test('insertPhraseUnits：同一插入點的多個片語單元依陣列順序；只有一個片語單元時標題不加編號；找不到插入點拋錯', () => {
  const [two] = insertPhraseUnits(base, units({ after: 'a1-u02', lessons: [pNames] }, { after: 'a1-u02', lessons: [qNames] }));
  assert.deepEqual(two.units.map((u) => u.id), ['a1-u01', 'a1-u02', 'a1-p01', 'a1-p02']);
  const [one] = insertPhraseUnits(base, units({ after: 'a1-u02', lessons: [pNames, qNames] }));
  assert.equal(one.units[2].titleZh, '常用片語');
  assert.throws(() => insertPhraseUnits(base, units({ after: 'a1-u09', lessons: [pNames] })), /找不到插入點 a1-u09/);
  // 沒有片語單元的級距原樣回傳
  assert.equal(insertPhraseUnits(base, { schemaVersion: 1, levels: {} })[0], base[0]);
});

test('PHRASE_PREREQ：同級組成字必須在片語單元之前的主題課引入', () => {
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u01', lessons: [pNames, qNames] }));
  const errors = validate([doc], table());
  assert.deepEqual(codes(errors), qNames.map((_, i) => `PHRASE_PREREQ levels/0/units/1/lessons/1/words/${i}`));
  assert.match(errors[0].message, /b01.*尚未引入/);
});

test('PHRASE_PREREQ：組成字級距高於片語者只容許人工下調（downgradedFrom）', () => {
  const hi = phrase('hi there', ['hi', 'a08']);
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u02', lessons: [[...pNames, 'hi there'], qNames] }));
  assert.deepEqual(codes(validate([doc], table(hi))), ['PHRASE_PREREQ levels/0/units/2/lessons/0/words/6']);
  assert.deepEqual(validate([doc], table({ ...hi, downgradedFrom: 'B1' })), []);
});

test('UNKNOWN_PHRASE、LEVEL_MISMATCH、DUPLICATE_INTRO、LESSON_SIZE、MISSING_PHRASE', () => {
  const b1 = phrase('a09 up', ['a09'], { cefr: 'B1' });
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u02', lessons: [[...pNames, 'ghost', 'a09 up', 'a01 up'], qNames.slice(0, 5)] }));
  const errors = validate([doc], table(b1));
  assert.deepEqual(codes(errors), [
    'UNKNOWN_PHRASE levels/0/units/2/lessons/0/words/6',
    'LEVEL_MISMATCH levels/0/units/2/lessons/0/words/7',
    'DUPLICATE_INTRO levels/0/units/2/lessons/0/words/8',
    'LESSON_SIZE levels/0/units/2/lessons/1',
    'MISSING_PHRASE A1',
  ]);
  assert.match(errors.at(-1).message, /b01 a06/);
});

test('ID_MISMATCH：片語單元 ID 必須是 -pNN、主題單元必須是 -uNN；SCHEMA：phrase-units.json 結構', () => {
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u02', lessons: [pNames, qNames] }));
  const swap = structuredClone(doc);
  swap.units[2].id = 'a1-u03';
  swap.units[2].lessons.forEach((l, i) => (l.id = `a1-u03-l0${i + 1}`));
  swap.units[0].id = 'a1-p09';
  swap.units[0].lessons.forEach((l, i) => (l.id = `a1-p09-l0${i + 1}`));
  assert.deepEqual(codes(validate([swap], table())), ['ID_MISMATCH levels/0/units/0', 'ID_MISMATCH levels/0/units/2']);
  // 主題單元少了 topic → UNKNOWN_TOPIC
  const noTopic = structuredClone(doc);
  delete noTopic.units[0].topic;
  assert.deepEqual(codes(validate([noTopic], table())), ['UNKNOWN_TOPIC levels/0/units/0']);
  assert.deepEqual(validatePhraseUnits(units({ after: 'a1-u01', lessons: [pNames] })), []);
  assert.deepEqual(codes(validatePhraseUnits(units({ after: 'a1-p01', lessons: [] }))).sort(), [
    'SCHEMA phraseUnits/levels/A1/0/after',
    'SCHEMA phraseUnits/levels/A1/0/lessons',
  ]);
});

test('統計：片語單元另計，主題單元的數字不變', () => {
  const [doc] = insertPhraseUnits(base, units({ after: 'a1-u01', lessons: [pNames] }, { after: 'a1-u02', lessons: [qNames] }));
  const before = curriculumStats(base, lexicon, topics);
  const after = curriculumStats([doc], lexicon, topics);
  assert.deepEqual(after.perLevel, before.perLevel);
  assert.deepEqual(after.total, before.total);
  assert.deepEqual(after.phrases, [{ level: 'A1', units: 2, lessons: 2, phrases: 12, after: ['a1-u01', 'a1-u02'] }]);
});
