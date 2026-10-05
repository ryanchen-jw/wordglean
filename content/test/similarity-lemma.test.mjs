// 雷同自查（scripts/lib/similarity-lemma.mjs）最小測試：用真 lexicon 與 dict 做詞形還原。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';
import { overlap, similarPairs, skeleton, skeletonPairs, stemLeaks, translatePairs } from '../scripts/lib/similarity-lemma.mjs';

const ctx = loadCheckContext({ allowlist: 'no-such-file.json' });

test('詞形還原：occurred／occurs、problems／problem 視為同字（目標字不計）', () => {
  const r = overlap('The problem occurred when I opened the file.', 'This problem often occurs in the morning.', ctx, ['occur']);
  assert.deepEqual(r.shared, ['problem']);
  assert.equal(r.ratio, 1 / 3); // 較短句扣除 occur 後：problem、often、morning
});

test('主詞、情境都換掉的句子不列出；照抄的句子列出', () => {
  const doc = {
    items: [
      { id: 'x-q01', type: 'wordCard', word: 'protect', exampleEn: 'Sunglasses protect your eyes from the sun.' },
      { id: 'x-q02', type: 'shadowing', sentenceEn: 'A good lock can protect your bike.' },
      { id: 'x-q03', type: 'listenType', sentenceEn: 'Sunglasses protected his eyes from the strong sun.' },
    ],
  };
  const pairs = similarPairs(doc, ctx, 0.4);
  assert.deepEqual(pairs.map((p) => p.where), ['q03 listenType']);
});

test('mcq 題幹出現正解字的變形會被抓到', () => {
  const doc = {
    items: [
      { id: 'x-q13', type: 'mcq', stemEn: 'We stopped at the ____ station to buy petrol.', options: ['bus', 'petrol'], answer: 1 },
      { id: 'x-q14', type: 'mcq', stemEn: 'He ____ to answer the question.', options: ['refused', 'decided'], answer: 0 },
    ],
  };
  assert.deepEqual(stemLeaks(doc, ctx), ['x-q13']);
});

test('門檻含等號、分母取較短句：剛好 40% 的句對要列出', () => {
  // 卡片扣除目標字後 5 個實詞（old teacher stayed long test），情境句共用 old、test 兩個（2/5＝40%）
  const doc = {
    items: [
      { id: 'x-q01', type: 'wordCard', word: 'calm', exampleEn: 'The old teacher stayed calm in the long test.' },
      { id: 'x-q02', type: 'shadowing', sentenceEn: 'The old driver felt calm on the short test road near the big green river.' },
    ],
  };
  const [p] = similarPairs(doc, ctx, 0.4);
  assert.ok(p, '應列出剛好 40% 的句對');
  assert.equal(p.ratio, 0.4);
});

test('題幹出現正解字的屈折變形（refuses vs refused）也會被抓到', () => {
  const doc = { items: [{ id: 'x-q13', type: 'mcq', stemEn: 'She always refuses help, and yesterday she ____ my offer too.', options: ['refused', 'accepted'], answer: 0 }] };
  assert.deepEqual(stemLeaks(doc, ctx), ['x-q13']);
});

test('句型骨架：同主詞類別＋目標字後接同類，字面不重疊也抓得到', () => {
  // B1 第 1 批最終複審抓到、字面重疊抓不到的實例
  const same = (a, b, w) => assert.equal(skeleton(a, w, ctx), skeleton(b, w, ctx));
  same('I need to renew my passport before the trip.', 'I am going to renew my driving license next month.', 'renew');
  same('Women constitute half of our staff.', 'Students from abroad constitute ten percent of our school.', 'constitute');
  same('Can you prove that you were at home?', "He couldn't prove that he was at work that day.", 'prove');
  // 主詞類別或後接類別不同就不算
  assert.notEqual(skeleton('Seven days constitute a week.', 'constitute', ctx), skeleton('Women constitute half of our staff.', 'constitute', ctx));
  // 後接一般實詞或句尾不比對
  assert.equal(skeleton('He works irregular hours.', 'irregular', ctx), null);
});

test('skeletonPairs 只列出同骨架的情境句', () => {
  const doc = {
    items: [
      { id: 'x-q01', type: 'wordCard', word: 'rely', exampleEn: 'Many farmers rely on the rain in spring.' },
      { id: 'x-q02', type: 'listenType', sentenceEn: 'Many people rely on their phones to find their way.' },
      { id: 'x-q03', type: 'shadowing', sentenceEn: "You can't just rely on other people." },
    ],
  };
  assert.deepEqual(skeletonPairs(doc, ctx).map((p) => p.where), ['q02 listenType']);
});

// ---- TASK-24 片語課：骨架以整個片語為目標（不再只取第一個字） ----

test('句型骨架（片語）：目標＝整個片語、後接類別取片語最後一字之後；同動詞的別的片語或單用動詞不算', () => {
  assert.equal(skeleton('We gave up the plan.', 'give up', ctx), 'PRON|give up|NP');
  assert.equal(skeleton('They gave the book to her.', 'give up', ctx), null); // 只有 give，沒有 give up
  assert.equal(skeleton('We gave in to the plan.', 'give up', ctx), null);
  assert.equal(skeleton('I am looking forward to the trip.', 'look forward to', ctx), 'PRON|look forward to|NP');
  // 可分離寫法（真實片語表 pick up 為 separable）也找得到片語，後接類別取 up 之後
  assert.equal(skeleton('She picked it up at the station.', 'pick up', ctx), 'PRON|pick up|at');
  assert.equal(skeleton('She picked it up at the station.', 'pick up', { ...ctx, phrases: new Map() }), null); // 沒有片語表＝不可分離
});

test('skeletonPairs（片語）：give up 卡不會和只出現 give 的句子配成對', () => {
  const doc = {
    items: [
      { id: 'x-q01', type: 'wordCard', word: 'give up', exampleEn: 'We gave up the plan.' },
      { id: 'x-q02', type: 'listenType', sentenceEn: 'They gave the book to her.' },
      { id: 'x-q03', type: 'shadowing', sentenceEn: 'I never give up my dream.' },
    ],
  };
  assert.deepEqual(skeletonPairs(doc, ctx).map((p) => p.where), ['q03 shadowing']);
});

// ---- 創辦人裁示 2026-10-04 造句改翻譯：翻譯題彼此不雷同（同課兩題、同單元跨課） ----

const tr = (id, ...referenceEn) => ({ id, type: 'translate', promptZh: '…', hintWords: [], referenceEn, rubricZh: ['…'] });
const lessonDoc = (lessonId, ...items) => ({ lessonId, items });

test('translatePairs：共同實詞 ≥40% 列出——同課兩題、同單元跨課都比；不同單元不比', () => {
  const docs = [
    lessonDoc('a1-u01-l01', tr('a1-u01-l01-q16', 'I have an apple and a banana.'), tr('a1-u01-l01-q17', 'She has two apples and a cup of milk.')),
    lessonDoc('a1-u01-l02', tr('a1-u01-l02-q16', 'My brother likes bananas.'), tr('a1-u01-l02-q17', 'The pen is on the desk.')),
    lessonDoc('a1-u02-l01', tr('a1-u02-l01-q16', 'The pen is on the desk.'), tr('a1-u02-l01-q17', 'We play ball in the park.')),
  ];
  const pairs = translatePairs(docs, ctx, 0.4).map((p) => `${p.a}|${p.b}|${p.scope}|${p.reason}`).sort();
  assert.deepEqual(pairs, [
    'a1-u01-l01-q16|a1-u01-l01-q17|lesson|字面', // apple 共用
    'a1-u01-l01-q16|a1-u01-l02-q16|unit|字面', // banana 共用
  ]);
});

test('translatePairs：同課兩題句型骨架相同（實詞換成 X）也列出；跨課不比句型', () => {
  const docs = [
    lessonDoc('a1-u01-l01', tr('a1-u01-l01-q16', 'The pen is on the desk.'), tr('a1-u01-l01-q17', 'The cat is on the bed.')),
    lessonDoc('a1-u01-l02', tr('a1-u01-l02-q16', 'The book is on the chair.'), tr('a1-u01-l02-q17', 'We play ball in the park.')),
  ];
  const pairs = translatePairs(docs, ctx, 0.4).map((p) => `${p.a}|${p.b}|${p.scope}|${p.reason}`).sort();
  assert.deepEqual(pairs, ['a1-u01-l01-q16|a1-u01-l01-q17|lesson|句型']);
});

test('translatePairs：字面比對扣除兩題的提示字（同單字卡自查扣目標字）', () => {
  const withHint = (item, hintWords) => ({ ...item, hintWords });
  const docs = [
    lessonDoc(
      'a1-u14-l01',
      withHint(tr('a1-u14-l01-q16', 'My hobby is basketball.'), ['basketball']),
      withHint(tr('a1-u14-l01-q17', 'My grandmother has many hobbies.'), ['hobby']),
    ),
  ];
  assert.deepEqual(translatePairs(docs, ctx, 0.4), []);
  docs[0].items[1].hintWords = [];
  assert.deepEqual(translatePairs(docs, ctx, 0.4).map((p) => p.shared), [['hobby']]);
});

test('translatePairs：提示字只從共同字扣除、分母不縮小（否則只剩一兩個實詞的句子會被放大成 100%）', () => {
  const withHint = (item, hintWords) => ({ ...item, hintWords });
  const docs = [
    lessonDoc('a1-u08-l01', withHint(tr('a1-u08-l01-q16', 'I am hungry. I want some soup.'), ['hungry', 'soup'])),
    lessonDoc('a1-u08-l03', withHint(tr('a1-u08-l03-q16', 'I want fish for dinner.'), ['fish', 'dinner'])),
  ];
  // 共同字 want（非提示字）÷ 較短句實詞 3（want fish dinner）＝33%，不報
  assert.deepEqual(translatePairs(docs, ctx, 0.4), []);
});
