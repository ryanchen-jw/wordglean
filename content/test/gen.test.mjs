// 產題流程測試：OpenRouter 用戶端以假 fetch 驗請求、:free 守衛與不重試；runGeneration 驗記帳、預算、
// 429 排隊延後、每分鐘節流、每日額度、先落檔只補判題、花費非 0 中止；CLI 驗乾跑與拒跑。
// 不連網：真打路徑一律注入假 fetch；時間用假時鐘；CLI 只測「呼叫 API 前就拒跑」的分支。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ApiError,
  FreeOnlyError,
  MissingKeyError,
  RateLimitError,
  createOpenRouterClient,
  readApiKey,
} from '../scripts/lib/openrouter.mjs';
import { LIMITS, assembleDoc, createRateWindow, parseModelJson, runGeneration } from '../scripts/lib/generate.mjs';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';

const ctx = loadCheckContext({ allowlist: 'no-such-file.json' });
const sample = JSON.parse(readFileSync(new URL('./fixtures/items/a1-u01-l01.json', import.meta.url), 'utf8'));
const A1_L01 = ctx.lessons.get('a1-u01-l01');
const A1_L02 = ctx.lessons.get('a1-u01-l02');
const GEN = 'qwen/qwen3.8-27b:free';
const JUDGE = 'google/gemma-4-31b-it:free';
const PRICES = {
  fetchedAt: '2026-10-02',
  models: {
    [GEN]: { promptPerM: 0, completionPerM: 0 },
    [JUDGE]: { promptPerM: 0, completionPerM: 0 },
    'apodex/apodex-1.1-mini:free': { promptPerM: 0, completionPerM: 0 },
  },
};
const SECRET = 'sk-or-v1-TESTSECRET-0123456789';

// 模型輸出（無題號）＋正確判題。
const genBody = { properNouns: sample.properNouns, items: sample.items.map(({ id, ...rest }) => rest) };
const goodVerdicts = { 'a1-u01-l01-q10': [0], 'a1-u01-l01-q13': [0], 'a1-u01-l01-q14': [1], 'a1-u01-l01-q15#0': [1], 'a1-u01-l01-q15#1': [2] };

const headers = (h = {}) => ({ get: (name) => h[name.toLowerCase()] ?? null });
const reply = (content, usage = { prompt_tokens: 1000, completion_tokens: 2000, cost: 0 }) => ({
  ok: true,
  status: 200,
  headers: headers(),
  text: async () => JSON.stringify({ model: GEN, provider: 'ModelRun', choices: [{ message: { content }, finish_reason: 'stop' }], usage }),
});
const httpError = (status, body = 'server error', h = {}) => ({ ok: false, status, headers: headers(h), text: async () => body });
const upstream429 = () =>
  httpError(429, JSON.stringify({ error: { code: 429, message: 'temporarily rate-limited upstream', metadata: { provider_name: 'ModelRun' } } }));
const keyReply = (remaining) => ({
  ok: true,
  status: 200,
  headers: headers(),
  text: async () => JSON.stringify({ data: { is_free_tier: true, free_model_daily_requests: { used: 50 - remaining, limit: 50, remaining } } }),
});

// 假 API：chat 依序回覆、/key 依序回覆（用完後重複最後一個）；記錄每次請求。
function fakeApi({ chat = [], key = [keyReply(50)] } = {}) {
  const requests = [];
  const keyCalls = [];
  const fetch = async (url, init) => {
    if (url.endsWith('/key')) {
      keyCalls.push(url);
      return key.length > 1 ? key.shift() : key[0];
    }
    requests.push({ url, init, body: JSON.parse(init.body) });
    if (!chat.length) throw new Error('非預期的額外呼叫');
    return chat.shift();
  };
  return { fetch, requests, keyCalls };
}

// 假時鐘：sleep 直接推進時間並記錄。
function fakeClock(start = 0) {
  const sleeps = [];
  let t = start;
  return { now: () => t, sleep: async (ms) => { sleeps.push(ms); t += ms; }, sleeps };
}

const tmp = () => mkdtempSync(join(tmpdir(), 'gen-test-'));
const withTmp = async (fn) => {
  const dir = tmp();
  try {
    await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

const gen = (fetch, outDir, overrides = {}) =>
  runGeneration({
    lessons: [A1_L01],
    client: createOpenRouterClient({ apiKey: SECRET, fetch }),
    genModel: GEN,
    judgeModel: JUDGE,
    prices: PRICES,
    budgetUsd: 0,
    outDir,
    checkCtx: ctx,
    runId: 'test',
    clock: fakeClock(),
    ...overrides,
  });

test('parseModelJson：可剝 ```json 圍欄；無 JSON 時拋錯', () => {
  assert.deepEqual(parseModelJson('```json\n{"a": 1}\n```'), { a: 1 });
  assert.throws(() => parseModelJson('抱歉，我無法產生'), /沒有 JSON/);
});

test('readApiKey：環境變數優先、可讀 .env、缺席時明確拋 MissingKeyError', async () => {
  await withTmp(async (dir) => {
    const envFile = join(dir, '.env');
    writeFileSync(envFile, 'OTHER=1\nOPENROUTER_API_KEY="sk-or-file"\n');
    assert.equal(readApiKey({ env: { OPENROUTER_API_KEY: 'sk-or-env' }, envFile }), 'sk-or-env');
    assert.equal(readApiKey({ env: {}, envFile }), 'sk-or-file');
    assert.throws(() => readApiKey({ env: {}, envFile: join(dir, 'missing.env') }), (err) => {
      assert.ok(err instanceof MissingKeyError);
      assert.match(err.message, /缺少 OPENROUTER_API_KEY.*本次未呼叫任何 API/s);
      return true;
    });
  });
});

// ---- :free 硬守衛 ----

test(':free 守衛：非 :free 模型與 openrouter/free 在呼叫前拒絕、零次 fetch', async () => {
  const api = fakeApi();
  const client = createOpenRouterClient({ apiKey: SECRET, fetch: api.fetch });
  for (const model of ['anthropic/claude-sonnet-5.5', 'openrouter/free', 'qwen/qwen3.8-27b', 'qwen/qwen3.8-27b:freeish']) {
    await assert.rejects(client.complete({ model, messages: [], maxTokens: 10 }), FreeOnlyError, model);
  }
  assert.equal(api.requests.length, 0);
});

test('回報花費非 0：記帳後中止整批、不再呼叫', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: [reply(JSON.stringify(genBody), { prompt_tokens: 10, completion_tokens: 10, cost: 0.0001 })] });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02] });
    assert.equal(api.requests.length, 1);
    assert.match(run.stoppedReason, /^paid：OpenRouter 回報花費 US\$0\.0001/);
    assert.deepEqual(run.remaining, ['a1-u01-l01', 'a1-u01-l02']);
    assert.equal(run.calls[0].costUsd, 0.0001);
  });
});

// ---- 用戶端 ----

test('OpenRouter 用戶端：帶金鑰、max_tokens、推理強度（null 不送）；回傳 usage 與實際服務模型', async () => {
  const api = fakeApi({ chat: [reply('{"x":1}', { prompt_tokens: 5, completion_tokens: 7, cost: 0, completion_tokens_details: { reasoning_tokens: 3 } }), reply('{}')] });
  const client = createOpenRouterClient({ apiKey: SECRET, fetch: api.fetch });
  const result = await client.complete({ model: GEN, messages: [{ role: 'user', content: 'hi' }], maxTokens: 50, reasoningEffort: 'low' });
  assert.equal(api.requests[0].init.headers.Authorization, `Bearer ${SECRET}`);
  assert.deepEqual(api.requests[0].body, { model: GEN, messages: [{ role: 'user', content: 'hi' }], max_tokens: 50, reasoning: { effort: 'low' } });
  assert.deepEqual(result.usage, { promptTokens: 5, completionTokens: 7, reasoningTokens: 3, cost: 0 });
  assert.equal(result.provider, 'ModelRun');
  await client.complete({ model: JUDGE, messages: [], maxTokens: 50, reasoningEffort: null });
  assert.ok(!('reasoning' in api.requests[1].body));
});

test('OpenRouter 用戶端：429 拋 RateLimitError（含上游提供商）；其他 HTTP 錯誤拋 ApiError；皆只呼叫一次', async () => {
  const api = fakeApi({ chat: [upstream429(), httpError(500)] });
  const client = createOpenRouterClient({ apiKey: SECRET, fetch: api.fetch });
  await assert.rejects(client.complete({ model: GEN, messages: [], maxTokens: 5 }), (err) => {
    assert.ok(err instanceof RateLimitError);
    assert.equal(err.detail.providerName, 'ModelRun');
    return true;
  });
  await assert.rejects(client.complete({ model: GEN, messages: [], maxTokens: 5 }), (err) => !(err instanceof RateLimitError) && err instanceof ApiError);
  assert.equal(api.requests.length, 2);
});

test('OpenRouter 用戶端 keyInfo：讀每日免費額度', async () => {
  const api = fakeApi({ key: [keyReply(37)] });
  const info = await createOpenRouterClient({ apiKey: SECRET, fetch: api.fetch }).keyInfo();
  assert.deepEqual(info, { remaining: 37, used: 13, limit: 50, isFreeTier: true });
});

// ---- runGeneration ----

test('成功：寫入題目檔與判題、帳本記 token／提供商；判題請求不附答案；金鑰不出現在帳本與 log', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts }), { prompt_tokens: 800, completion_tokens: 60, cost: 0 })] });
    const lines = [];
    const { run, runFile } = await gen(api.fetch, dir, { log: (l) => lines.push(l) });
    assert.deepEqual(run.lessons, [{ lessonId: 'a1-u01-l01', status: 'ok' }]);
    assert.deepEqual(api.requests.map((r) => r.body.model), [GEN, JUDGE]);
    assert.ok(!('reasoning' in api.requests[1].body), 'Gemma 不送 reasoning');
    assert.doesNotMatch(api.requests[1].body.messages[1].content, /"answer"/);
    const doc = JSON.parse(readFileSync(join(dir, 'a1', 'a1-u01-l01.json'), 'utf8'));
    assert.deepEqual(doc.judge.verdicts, goodVerdicts);
    assert.deepEqual(run.totals, { promptTokens: 1800, completionTokens: 2060, costUsd: 0 });
    assert.equal(run.calls[0].provider, 'ModelRun');
    assert.ok(!existsSync(join(dir, '_pending', 'a1-u01-l01.json')), '完成後清掉 _pending');
    const ledger = readFileSync(runFile, 'utf8');
    assert.ok(!ledger.includes(SECRET) && !lines.join('\n').includes(SECRET));
  });
});

test('429 排隊延後：該課放佇列尾、至少 60 秒後再輪；不算重試、其他課先做', async () => {
  await withTmp(async (dir) => {
    const body2 = { ...genBody, items: genBody.items };
    const api = fakeApi({
      chat: [
        upstream429(), // l01 產題 429
        reply('抱歉'), // l02 產題（解析失敗，僅為推進佇列）
        reply(JSON.stringify(body2)), // l01 再輪：產題
        reply(JSON.stringify({ verdicts: goodVerdicts })), // l01 判題
      ],
    });
    const clock = fakeClock();
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02], clock });
    assert.deepEqual(run.lessons.map((l) => [l.lessonId, l.status]), [['a1-u01-l02', 'parse_failed'], ['a1-u01-l01', 'ok']]);
    const at = run.calls.map((c) => [c.lessonId, c.role, c.status, Date.parse(c.at)]);
    assert.deepEqual(at.map((x) => x.slice(0, 3)), [
      ['a1-u01-l01', 'gen', 'rate_limited'],
      ['a1-u01-l02', 'gen', 'ok'],
      ['a1-u01-l01', 'gen', 'ok'],
      ['a1-u01-l01', 'judge', 'ok'],
    ]);
    assert.ok(at[2][3] - at[0][3] >= 60_000, '429 後至少 60 秒才再輪到');
    assert.equal(run.stoppedReason, null);
  });
});

test('同一課 429 延後超過 5 次 → 今日未完成、不再排（共送 6 次）', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: Array.from({ length: 6 }, upstream429) });
    const { run } = await gen(api.fetch, dir);
    assert.equal(api.requests.length, 6);
    assert.deepEqual(run.lessons.map((l) => l.status), ['deferred_today']);
  });
});

test('產題先落檔；判題 429 只補判題、不重產', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: [reply(JSON.stringify(genBody)), upstream429(), reply(JSON.stringify({ verdicts: goodVerdicts }))] });
    const { run } = await gen(api.fetch, dir);
    assert.deepEqual(api.requests.map((r) => r.body.model), [GEN, JUDGE, JUDGE]);
    assert.deepEqual(run.lessons, [{ lessonId: 'a1-u01-l01', status: 'ok' }]);
  });
});

test('下次執行時 _pending/ 的課只補判題（不呼叫產題模型）', async () => {
  await withTmp(async (dir) => {
    mkdirSync(join(dir, '_pending'), { recursive: true });
    writeFileSync(join(dir, '_pending', 'a1-u01-l01.json'), JSON.stringify(assembleDoc(A1_L01, genBody, { model: GEN, promptVersion: 'gen-lesson.v1' })));
    const api = fakeApi({ chat: [reply(JSON.stringify({ verdicts: goodVerdicts }))] });
    const { run } = await gen(api.fetch, dir);
    assert.deepEqual(api.requests.map((r) => r.body.model), [JUDGE]);
    assert.deepEqual(run.lessons, [{ lessonId: 'a1-u01-l01', status: 'ok' }]);
  });
});

test('判題回應解析失敗：不重跑、題目留在 _pending/ 待下次補判題', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: [reply(JSON.stringify(genBody)), reply('我無法判斷')] });
    const { run } = await gen(api.fetch, dir);
    assert.equal(api.requests.length, 2);
    assert.deepEqual(run.lessons.map((l) => l.status), ['judge_failed']);
    assert.ok(existsSync(join(dir, '_pending', 'a1-u01-l01.json')));
  });
});

test('每分鐘節流常數＝OpenRouter 免費模型上限 20 次／分（docs/research/free-models.md §2.1）；以常數驅動：第 21 次要等', async () => {
  assert.equal(LIMITS.perMinute, 20);
  const clock = fakeClock(0);
  const acquire = createRateWindow(LIMITS.perMinute, clock);
  for (let i = 0; i < 20; i += 1) await acquire();
  assert.deepEqual(clock.sleeps, []);
  await acquire();
  assert.deepEqual(clock.sleeps, [60_000]);
});

test('每分鐘節流：第 21 次呼叫等到第 1 次滿 60 秒', async () => {
  const clock = fakeClock(1000);
  const acquire = createRateWindow(20, clock);
  for (let i = 0; i < 20; i += 1) await acquire();
  assert.deepEqual(clock.sleeps, []);
  await acquire();
  assert.deepEqual(clock.sleeps, [60_000]);
});

test('每日額度：開跑時剩 ≤ 2 → 零次模型呼叫、收工並列出未處理的課', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ key: [keyReply(2)] });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02] });
    assert.equal(api.requests.length, 0);
    assert.match(run.stoppedReason, /^quota：每日免費額度剩 2 次/);
    assert.deepEqual(run.remaining, ['a1-u01-l01', 'a1-u01-l02']);
  });
});

test('每日額度：本地扣減到 ≤ 2 即停（剩 4 → 產題＋判題後停在第二課之前）', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ key: [keyReply(4)], chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts }))] });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02] });
    assert.equal(api.requests.length, 2);
    assert.deepEqual(run.lessons.map((l) => l.status), ['ok']);
    assert.match(run.stoppedReason, /^quota/);
    assert.deepEqual(run.remaining, ['a1-u01-l02']);
  });
});

test('每日額度：429 不扣本地估算（實測 429 不扣 OpenRouter 額度）——剩 4 時 3 次 429 後仍可產題＋判題', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({
      key: [keyReply(4)],
      chat: [upstream429(), upstream429(), upstream429(), reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts }))],
    });
    const { run } = await gen(api.fetch, dir);
    assert.equal(api.requests.length, 5);
    assert.deepEqual(run.lessons.map((l) => l.status), ['ok']);
    assert.equal(run.stoppedReason, null);
  });
});

test('每日額度：每 10 次模型呼叫重查一次 /key', async () => {
  await withTmp(async (dir) => {
    // 10 課各 1 次（產題解析失敗即結束該課）＝10 次呼叫：開跑查 1 次＋第 10 次後查 1 次
    const lessons = [...ctx.lessons.values()].filter((l) => l.unitId === 'a1-u01');
    const api = fakeApi({ chat: lessons.map(() => reply('不是 JSON')) });
    await gen(api.fetch, dir, { lessons });
    assert.equal(api.requests.length, 10);
    assert.equal(api.keyCalls.length, 2);
  });
});

test('HTTP 其他錯誤：停止整批、不重試（第二課產題 500 後不再呼叫）', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({ chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts })), httpError(500)] });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02, ctx.lessons.get('a1-u01-l03')] });
    assert.equal(api.requests.length, 3);
    assert.deepEqual(run.lessons.map((l) => l.status), ['ok']);
    assert.match(run.stoppedReason, /^error：OpenRouter HTTP 500/);
    assert.deepEqual(run.remaining, ['a1-u01-l02', 'a1-u01-l03']);
  });
});

test('解析失敗：保留原文、不重試、繼續下一課；檢查失敗：放 _rejected', async () => {
  await withTmp(async (dir) => {
    const ambiguous = { ...goodVerdicts, 'a1-u01-l01-q13': [0, 1] };
    const api = fakeApi({ chat: [reply('抱歉，我無法產生'), reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))] });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L02, A1_L01] });
    assert.equal(api.requests.length, 3);
    assert.deepEqual(run.lessons.map((l) => l.status), ['parse_failed', 'check_failed']);
    assert.equal(readFileSync(join(dir, '_rejected', 'a1-u01-l02.raw.txt'), 'utf8'), '抱歉，我無法產生');
    assert.deepEqual(run.lessons[1].errors.map((e) => e.code), ['MCQ_AMBIGUOUS']);
    assert.ok(existsSync(join(dir, '_rejected', 'a1-u01-l01.json')));
    assert.ok(!existsSync(join(dir, 'a1', 'a1-u01-l01.json')));
  });
});

test('已有輸出檔的課跳過、不呼叫 API', async () => {
  await withTmp(async (dir) => {
    const first = fakeApi({ chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts }))] });
    await gen(first.fetch, dir);
    const second = fakeApi();
    const { run } = await gen(second.fetch, dir, { runId: 'again' });
    assert.equal(second.requests.length, 0);
    assert.deepEqual(run.lessons, [{ lessonId: 'a1-u01-l01', status: 'skipped' }]);
  });
});

test('預算把關仍在：快照單價非 0 時最壞金額超過 budget 0 → 零次呼叫', async () => {
  await withTmp(async (dir) => {
    const paidSnapshot = { models: { [GEN]: { promptPerM: 1, completionPerM: 1 }, [JUDGE]: { promptPerM: 0, completionPerM: 0 } } };
    const api = fakeApi();
    const { run } = await gen(api.fetch, dir, { prices: paidSnapshot });
    assert.equal(api.requests.length, 0);
    assert.match(run.stoppedReason, /^budget：預算不足/);
  });
});

// ---- 退件、重產（v2 一次）、判題備援 ----

const ambiguous = { ...goodVerdicts, 'a1-u01-l01-q13': [0, 1] };
const isV2 = (req) => req.body.messages[0].content.includes('every item is checked automatically');

test('已退件（檢查失敗或解析失敗）的課，下次執行不再產題', async () => {
  await withTmp(async (dir) => {
    const first = fakeApi({ chat: [reply('不是 JSON'), reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))] });
    await gen(first.fetch, dir, { lessons: [A1_L02, A1_L01] });
    const second = fakeApi();
    const { run } = await gen(second.fetch, dir, { lessons: [A1_L02, A1_L01], runId: 'again' });
    assert.equal(second.requests.length, 0);
    assert.deepEqual(run.lessons.map((l) => [l.lessonId, l.status]), [['a1-u01-l02', 'rejected'], ['a1-u01-l01', 'rejected']]);
  });
});

test('重產授權：解析失敗與判題後檢查失敗的課都可重產（預設 v2、attempt 由帳本計次）、前次檔改名 .a1 保留', async () => {
  await withTmp(async (dir) => {
    const first = fakeApi({ chat: [reply('不是 JSON'), reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))] });
    await gen(first.fetch, dir, { lessons: [A1_L02, A1_L01] });
    const second = fakeApi({ chat: [reply('還是不是 JSON'), reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: goodVerdicts }))] });
    const { run } = await gen(second.fetch, dir, { lessons: [A1_L02, A1_L01], runId: 'regen', regenRejected: true });
    assert.equal(second.requests.length, 3);
    assert.ok(isV2(second.requests[0]) && isV2(second.requests[1]), '重產預設用 gen-lesson.v2');
    assert.deepEqual(run.lessons.map((l) => [l.lessonId, l.status]), [['a1-u01-l02', 'parse_failed'], ['a1-u01-l01', 'ok']]);
    const doc = JSON.parse(readFileSync(join(dir, 'a1', 'a1-u01-l01.json'), 'utf8'));
    assert.equal(doc.attempt, 2);
    assert.equal(doc.promptVersion, 'gen-lesson.v2');
    assert.equal(JSON.parse(readFileSync(join(dir, '_rejected', 'a1-u01-l01.a1.json'), 'utf8')).promptVersion, 'gen-lesson.v1');
    assert.equal(readFileSync(join(dir, '_rejected', 'a1-u01-l02.a1.raw.txt'), 'utf8'), '不是 JSON');
    assert.equal(readFileSync(join(dir, '_rejected', 'a1-u01-l02.raw.txt'), 'utf8'), '還是不是 JSON');
    assert.deepEqual(run.calls.map((c) => [c.lessonId, c.role, c.attempt, c.prompt]), [
      ['a1-u01-l02', 'gen', 2, 'gen-lesson.v2'],
      ['a1-u01-l01', 'gen', 2, 'gen-lesson.v2'],
      ['a1-u01-l01', 'judge', 2, 'judge-mcq.v1'],
    ]);
  });
});

test('重產上限 3 次（--max-attempts 3）：第 3 次用指定的 prompt（v3），之後不再送', async () => {
  await withTmp(async (dir) => {
    const fail = () => [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))];
    await gen(fakeApi({ chat: fail() }).fetch, dir);
    await gen(fakeApi({ chat: fail() }).fetch, dir, { runId: 'r2', regenRejected: true });
    const third = fakeApi({ chat: fail() });
    const r3 = await gen(third.fetch, dir, { runId: 'r3', regenRejected: true, maxAttempts: 3, regenPrompt: 'gen-lesson.v3' });
    assert.equal(third.requests.length, 2);
    assert.ok(third.requests[0].body.messages[1].content.includes('ALLOWED WORD LIST'), '第 3 次用 gen-lesson.v3');
    assert.equal(r3.run.calls[0].attempt, 3);
    assert.ok(existsSync(join(dir, '_rejected', 'a1-u01-l01.a1.json')) && existsSync(join(dir, '_rejected', 'a1-u01-l01.a2.json')));
    const fourth = fakeApi();
    const r4 = await gen(fourth.fetch, dir, { runId: 'r4', regenRejected: true, maxAttempts: 3, regenPrompt: 'gen-lesson.v3' });
    assert.equal(fourth.requests.length, 0);
    assert.deepEqual(r4.run.lessons.map((l) => l.status), ['rejected']);
  });
});

test('重產最多一次：v2 仍檢查失敗 → 退件（attempt 2），之後即使授權重產也不再送', async () => {
  await withTmp(async (dir) => {
    await gen(fakeApi({ chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))] }).fetch, dir);
    const second = fakeApi({ chat: [reply(JSON.stringify(genBody)), reply(JSON.stringify({ verdicts: ambiguous }))] });
    const r2 = await gen(second.fetch, dir, { runId: 'regen', regenRejected: true });
    assert.deepEqual(r2.run.lessons.map((l) => l.status), ['check_failed']);
    assert.equal(JSON.parse(readFileSync(join(dir, '_rejected', 'a1-u01-l01.json'), 'utf8')).attempt, 2);
    const third = fakeApi();
    const r3 = await gen(third.fetch, dir, { runId: 'regen2', regenRejected: true });
    assert.equal(third.requests.length, 0);
    assert.deepEqual(r3.run.lessons.map((l) => l.status), ['rejected']);
  });
});

const FALLBACK = 'apodex/apodex-1.1-mini:free';

test('判題備援：主判題連續 6 次 429 → 改用備援判剩下的課，產題不重做', async () => {
  await withTmp(async (dir) => {
    const api = fakeApi({
      chat: [
        reply(JSON.stringify(genBody)), // l01 產題
        ...Array.from({ length: 6 }, upstream429), // 主判題 Gemma 連續 6 次 429
        reply(JSON.stringify({ verdicts: goodVerdicts })), // 備援判題
      ],
    });
    const { run } = await gen(api.fetch, dir, { judgeFallback: FALLBACK });
    assert.deepEqual(api.requests.map((r) => r.body.model), [GEN, ...Array(6).fill(JUDGE), FALLBACK]);
    assert.deepEqual(run.lessons, [{ lessonId: 'a1-u01-l01', status: 'ok' }]);
    const doc = JSON.parse(readFileSync(join(dir, 'a1', 'a1-u01-l01.json'), 'utf8'));
    assert.equal(doc.judge.model, FALLBACK);
    assert.equal(run.judgeSwitches.length, 1);
  });
});

test('判題備援：主判題中途成功會重置連續計數（門檻 2：429、成功、429 不切換）', async () => {
  await withTmp(async (dir) => {
    // 佇列 [l01, l02]：l01 產題 → l01 判題 429（連續 1，l01 延後）→ l02 產題 → l02 判題成功（歸零）
    // → 60 秒後 l01 判題 429（連續 1；若沒歸零就是 2 → 會切備援）→ l01 判題成功。
    const api = fakeApi({
      chat: [
        reply(JSON.stringify(genBody)),
        upstream429(),
        reply(JSON.stringify(genBody)),
        reply(JSON.stringify({ verdicts: {} })), // l02 題目沿用 l01 樣本、判題鍵不符→檢查失敗，無妨
        upstream429(),
        reply(JSON.stringify({ verdicts: goodVerdicts })),
      ],
    });
    const { run } = await gen(api.fetch, dir, { lessons: [A1_L01, A1_L02], judgeFallback: FALLBACK, limits: { judgeFallbackAfter: 2 } });
    assert.deepEqual(api.requests.map((r) => r.body.model), [GEN, JUDGE, GEN, JUDGE, JUDGE, JUDGE]);
    assert.equal(run.judgeSwitches.length, 0);
  });
});

test('CLI：--max-attempts 硬上限 3（4 即拒跑 exit 2）', () => {
  const key = { OPENROUTER_API_KEY: 'sk-test-not-used' };
  const base = ['--out', refuseOut, '--lessons', 'a1-u01-l01', '--env', 'none.env', '--model', GEN, '--judge-model', JUDGE, '--budget', '0', '--regen-rejected'];
  const over = runCli([...base, '--max-attempts', '4'], key);
  assert.equal(over.status, 2);
  assert.match(over.stderr, /--max-attempts 須為 1–3/);
  const bad = runCli([...base, '--max-attempts', 'abc'], key);
  assert.equal(bad.status, 2);
});

test('CLI：備援判題須 :free 且不得與產題同家族', () => {
  const key = { OPENROUTER_API_KEY: 'sk-test-not-used' };
  const base = ['--out', refuseOut, '--lessons', 'a1-u01-l01', '--env', 'none.env', '--model', GEN, '--judge-model', JUDGE, '--budget', '0'];
  const paid = runCli([...base, '--judge-fallback', 'anthropic/claude-sonnet-5.5'], key);
  assert.equal(paid.status, 2);
  assert.match(paid.stderr, /只准 :free 模型，拒絕呼叫 anthropic\/claude-sonnet-5\.5/);
  const sameFamily = runCli([...base, '--judge-fallback', 'qwen/qwen3.8-coder:free'], key);
  assert.equal(sameFamily.status, 2);
  assert.match(sameFamily.stderr, /備援判題模型須與產題模型不同家族/);
});

// ---- CLI ----

const cli = fileURLToPath(new URL('../scripts/gen-items.mjs', import.meta.url));
// 拒跑類測試一律輸出到暫存目錄：守衛若失效，也不會寫進正式的 content/items。
const refuseOut = join(tmpdir(), 'linguaapp-cli-refuse');
const runCli = (args, env = {}) => {
  const cleanEnv = { ...process.env, ...env };
  if (!('OPENROUTER_API_KEY' in env)) delete cleanEnv.OPENROUTER_API_KEY;
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: cleanEnv });
};

test('CLI 乾跑 pilot 16 課：全 ok、exit 0、輸出寫到指定目錄', async () => {
  await withTmp(async (dir) => {
    const r = runCli(['--fixture', '--lessons', 'a1-u01,b1-u01', '--out', dir, '--run-id', 'cli']);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /完成：ok 16、skipped 0、parse_failed 0、check_failed 0、judge_failed 0、deferred_today 0、未處理 0；呼叫 32 次/);
    const ledger = JSON.parse(readFileSync(join(dir, '_runs', 'cli.json'), 'utf8'));
    assert.equal(ledger.dryRun, true);
  });
});

test('CLI 真打但沒有金鑰：exit 2、明確拒絕、沒有寫任何東西', async () => {
  await withTmp(async (dir) => {
    const out = join(dir, 'out');
    const r = runCli(['--lessons', 'a1-u01-l01', '--model', GEN, '--judge-model', JUDGE, '--budget', '0', '--env', join(dir, 'none.env'), '--out', out]);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /拒絕執行：缺少 OPENROUTER_API_KEY.*本次未呼叫任何 API/s);
    assert.ok(!existsSync(out));
  });
});

test('CLI 真打的其他前置：非 :free、缺 budget、同家族判題皆 exit 2', () => {
  const key = { OPENROUTER_API_KEY: 'sk-test-not-used' };
  const base = ['--out', refuseOut, '--lessons', 'a1-u01-l01', '--env', 'none.env'];
  const paid = runCli([...base, '--model', 'anthropic/claude-sonnet-5.5', '--judge-model', JUDGE, '--budget', '0'], key);
  assert.equal(paid.status, 2);
  assert.match(paid.stderr, /只准 :free 模型，拒絕呼叫 anthropic\/claude-sonnet-5\.5/);
  const noBudget = runCli([...base, '--model', GEN, '--judge-model', JUDGE], key);
  assert.equal(noBudget.status, 2);
  assert.match(noBudget.stderr, /必須帶 --budget/);
  const sameFamily = runCli([...base, '--model', 'google/gemma-4-26b-a4b-it:free', '--judge-model', JUDGE, '--budget', '0'], key);
  assert.equal(sameFamily.status, 2);
  assert.match(sameFamily.stderr, /不同家族/);
});
