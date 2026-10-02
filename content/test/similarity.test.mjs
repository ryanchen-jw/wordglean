import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contentWords, contextSentences, selfcheck } from '../scripts/lib/similarity.mjs';

// 測試用詞形還原：只認得幾個不規則形
const FORMS = { occurred: ['occur'], occurs: ['occur'], went: ['go'], gone: ['go'] };
const lemmas = (w) => FORMS[w] ?? [];

const doc = (cardEn, others) => ({
  lessonId: 'b2-u99-l01',
  items: [{ id: 'q01', type: 'wordCard', word: 'occur', exampleEn: cardEn }, ...others],
});
const shadow = (id, s) => ({ id, type: 'shadowing', sentenceEn: s });

test('詞形還原後比對：occur／occurs／occurred 視為同一字', () => {
  assert.deepEqual([...contentWords('The problem occurred twice.', lemmas)].sort(), ['occur', 'problem', 'twice']);
  const r = selfcheck(doc('Problems occur twice a year.', [shadow('q02', 'The problem occurred twice.')]), { lemmas });
  assert.equal(r.similar.length, 1);
  assert.equal(r.similar[0].ratio, 3 / 4);
});

test('共同實詞 ≥40% 列入複查，未達門檻不列', () => {
  const card = 'Accidents occur often on this busy road.'; // accident occur often busy road → 5 個實詞
  const twoOfFive = selfcheck(doc(card, [shadow('q02', 'Mistakes occur often at night.')]), { lemmas });
  assert.equal(twoOfFive.similar.length, 1); // occur, often → 40%
  const oneOfFive = selfcheck(doc(card, [shadow('q02', 'Mistakes occur at night.')]), { lemmas });
  assert.equal(oneOfFive.similar.length, 0); // occur → 20%
});

test('情境句包含聽選音檔、mcq 題幹（填入正解）、閱讀逐句、翻譯與造句參考答案', () => {
  const d = {
    lessonId: 'x',
    items: [
      { id: 'c', type: 'wordCard', word: 'harbor', exampleEn: 'The boats rest in the harbor.' },
      { id: 'lc', type: 'listenChoice', audioEn: 'The ferry leaves the harbor at noon.', options: ['a', 'b', 'c'], answer: 0 },
      { id: 'm', type: 'mcq', stemEn: 'Fishing boats come back to the ____ at night.', options: ['harbor', 'cloud', 'shelf', 'song'], answer: 0 },
      { id: 'r', type: 'reading', passageEn: 'The town is small. Its harbor is busy in summer.', questions: [] },
      { id: 't', type: 'translate', referenceEn: ['The harbor is beautiful at night.', 'At night, the harbor looks beautiful.'] },
      { id: 'ms', type: 'makeSentence', referenceEn: ['I walked along the harbor yesterday.'] },
    ],
  };
  const map = Object.fromEntries(contextSentences(d));
  assert.equal(map.lc, 'The ferry leaves the harbor at noon.');
  assert.equal(map.m, 'Fishing boats come back to the harbor at night.');
  assert.equal(map['r/s1'], 'Its harbor is busy in summer.');
  assert.equal(map['t/ref1'], 'At night, the harbor looks beautiful.');
  assert.equal(map['ms/ref0'], 'I walked along the harbor yesterday.');
  assert.equal(map.c, undefined, '單字卡本身不算情境句');
});

test('各類情境句與單字卡雷同時都會被列入複查', () => {
  const card = 'Strong winds damaged the old bridge.'; // strong wind damage old bridge → 5 個實詞
  const d = {
    lessonId: 'x',
    items: [
      { id: 'c', type: 'wordCard', word: 'damage', exampleEn: card },
      { id: 'lc', type: 'listenChoice', audioEn: 'Strong winds damaged the bridge again.', options: ['a', 'b', 'c'], answer: 0 },
      { id: 'm', type: 'mcq', stemEn: 'Last night, strong winds ____ the old bridge.', options: ['damaged', 'painted', 'crossed', 'built'], answer: 0 },
      { id: 'r', type: 'reading', passageEn: 'It was a calm day. Strong winds damaged the old bridge last year.', questions: [] },
      { id: 't', type: 'translate', referenceEn: ['Strong winds damaged the old bridge in town.'] },
      { id: 'ms', type: 'makeSentence', referenceEn: ['Strong winds once damaged the old bridge near my home.'] },
    ],
  };
  const ids = selfcheck(d, { lemmas }).similar.map((s) => s.id).sort();
  assert.deepEqual(ids, ['lc', 'm', 'ms/ref0', 'r/s1', 't/ref0']);
});

test('題幹洩漏：題幹含正解的變形就報，無關字不報', () => {
  const mcq = (stemEn, options) => ({ id: 'q03', type: 'mcq', stemEn, options, answer: 0 });
  const leak = selfcheck(doc('A.', [mcq('Parking is paid by the hour; the ____ rate is low.', ['hourly', 'serial', 'odd', 'neat'])]), { lemmas });
  assert.deepEqual(leak.leaks.map((l) => l.words), [['hour']]);
  const clean = selfcheck(doc('A.', [mcq('In this job, the ____ pay is low.', ['hourly', 'serial', 'odd', 'neat'])]), { lemmas });
  assert.deepEqual(clean.leaks, []);
  const irregular = selfcheck(doc('A.', [mcq('She has ____ home already.', ['gone', 'went', 'go', 'goes'])]), { lemmas });
  assert.deepEqual(irregular.leaks, []);
});
