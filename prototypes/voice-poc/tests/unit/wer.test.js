// 期望值皆為手算（單字層編輯距離：替換／刪除／插入各算 1），不與實作共用邏輯。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, wordErrors, corpusAccuracy } from '../../src/wer.js';

test('正規化：大小寫、標點、撇號、多餘空白', () => {
  assert.deepEqual(normalize('  Hello,   World! '), ['hello', 'world']);
  assert.deepEqual(normalize("I'm here."), ['im', 'here']);
  assert.deepEqual(normalize('well-known'), ['well', 'known']);
  assert.deepEqual(normalize(''), []);
});

test('完全相同 → 0 錯', () => {
  assert.deepEqual(wordErrors('the cat sat', 'The cat sat.'), { errors: 0, refWords: 3 });
});

test('漏一字 → 1 錯（刪除）', () => {
  assert.deepEqual(wordErrors('the cat sat', 'the cat'), { errors: 1, refWords: 3 });
});

test('一個替換＋一個插入 → 2 錯', () => {
  assert.deepEqual(wordErrors('a b c d', 'a x c d e'), { errors: 2, refWords: 4 });
});

test('辨識結果為空 → 錯數＝參考字數', () => {
  assert.deepEqual(wordErrors('one two three four', ''), { errors: 4, refWords: 4 });
});

test('前後錯位不重複計：多一字在開頭 → 1 錯', () => {
  assert.deepEqual(wordErrors('i always am', 'yes i always am'), { errors: 1, refWords: 3 });
});

test('語料層正確率＝1 − 總錯數／總參考字數（下限 0）', () => {
  // (0 + 1) / (3 + 3) → 1 - 1/6
  assert.equal(corpusAccuracy([{ errors: 0, refWords: 3 }, { errors: 1, refWords: 3 }]), 1 - 1 / 6);
  assert.equal(corpusAccuracy([{ errors: 9, refWords: 3 }]), 0);
});
