// 測試環境網路守衛：NODE_ENV=test 或 LINGUAAPP_OFFLINE=1（--fixture 會設）時，未明確注入 fetch 的用戶端
// 在送出任何請求前拒絕。以探針替換全域 fetch：守衛失效時探針會被呼叫，但不會真的連網。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NetworkBlockedError, createOpenRouterClient } from '../scripts/lib/openrouter.mjs';

function withEnv(env, fn) {
  const saved = { NODE_ENV: process.env.NODE_ENV, LINGUAAPP_OFFLINE: process.env.LINGUAAPP_OFFLINE };
  const savedFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (...args) => {
    calls.push(args);
    throw new Error('探針：不應該被呼叫');
  };
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return fn(calls).finally(() => {
    globalThis.fetch = savedFetch;
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
}

for (const env of [{ NODE_ENV: 'test', LINGUAAPP_OFFLINE: undefined }, { NODE_ENV: undefined, LINGUAAPP_OFFLINE: '1' }]) {
  test(`網路守衛（${JSON.stringify(env)}）：未注入 fetch 的 complete／keyInfo 在送出前拒絕、全域 fetch 零呼叫`, () =>
    withEnv(env, async (calls) => {
      const client = createOpenRouterClient({ apiKey: 'sk-fake' });
      await assert.rejects(client.complete({ model: 'qwen/qwen3.8-27b:free', messages: [], maxTokens: 5 }), NetworkBlockedError);
      await assert.rejects(client.keyInfo(), NetworkBlockedError);
      assert.equal(calls.length, 0);
    }));
}

test('網路守衛：明確注入假 fetch 時照常運作（單元測試的正常路徑）', () =>
  withEnv({ NODE_ENV: 'test' }, async () => {
    const fake = async () => ({ ok: true, status: 200, headers: { get: () => null }, text: async () => JSON.stringify({ data: { free_model_daily_requests: { remaining: 9 } } }) });
    const info = await createOpenRouterClient({ apiKey: 'sk-fake', fetch: fake }).keyInfo();
    assert.equal(info.remaining, 9);
  }));
