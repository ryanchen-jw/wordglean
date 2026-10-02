// 定價與 token 估算：期望值手算。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callCost, estimateTokens } from '../scripts/lib/pricing.mjs';

test('estimateTokens：ASCII 每 4 字元 1 token（無條件進位）、非 ASCII 每字 1 token', () => {
  assert.equal(estimateTokens('abcd'), 1);
  assert.equal(estimateTokens('abcde'), 2);
  assert.equal(estimateTokens('中文'), 2);
  assert.equal(estimateTokens('abcd中文'), 3);
});

test('callCost：USD／百萬 token；快照沒有的模型拋錯', () => {
  const prices = { models: { 'a/x': { promptPerM: 2, completionPerM: 10 } } };
  // 1000×2/1e6＋500×10/1e6＝0.002＋0.005
  assert.equal(callCost(prices, 'a/x', 1000, 500), 0.007);
  assert.throws(() => callCost(prices, 'b/y', 1, 1), /定價快照沒有模型 b\/y/);
});
