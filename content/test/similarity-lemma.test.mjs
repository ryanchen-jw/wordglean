// 雷同自查（scripts/lib/similarity-lemma.mjs）最小測試：用真 lexicon 與 dict 做詞形還原。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';
import { overlap, similarPairs, skeleton, skeletonPairs, stemLeaks } from '../scripts/lib/similarity-lemma.mjs';

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
