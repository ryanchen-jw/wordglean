// 補欄（gloss-backfill.v1）：只替合格的舊格式課補 TASK-12 欄位，不動其他欄位；判題認為干擾項與正解同義 → 不寫入。
// 假 fetch＋假時鐘，不連網。期望值取手寫樣本課（test/fixtures/items/a1-u01-l01.json）的人工釋義。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mergeGloss, runBackfill } from '../scripts/lib/backfill.mjs';
import { createOpenRouterClient } from '../scripts/lib/openrouter.mjs';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';

const ctx = loadCheckContext({ allowlist: 'no-such-file.json' });
const LESSON = ctx.lessons.get('a1-u01-l01');
const GEN = 'qwen/qwen3.8-27b:free';
const JUDGE = 'apodex/apodex-1.1-mini:free';
const full = JSON.parse(readFileSync(new URL('./fixtures/items/a1-u01-l01.json', import.meta.url), 'utf8'));

// 舊格式合格課：v1、已判題、沒有 TASK-12 欄位。
function legacyDoc() {
  const doc = structuredClone(full);
  doc.promptVersion = 'gen-lesson.v1';
  doc.judge = { model: 'google/gemma-4-31b-it:free', promptVersion: 'judge-mcq.v1', verdicts: { 'a1-u01-l01-q10': [0], 'a1-u01-l01-q13': [0], 'a1-u01-l01-q14': [1], 'a1-u01-l01-q15#0': [1], 'a1-u01-l01-q15#1': [2] } };
  for (const it of doc.items) {
    delete it.glossZh;
    delete it.distractorsZh;
    delete it.optionGlossZh;
  }
  return doc;
}
const glossBody = () => ({
  cards: full.items.filter((i) => i.type === 'wordCard').map(({ word, glossZh, distractorsZh }) => ({ word, glossZh, distractorsZh })),
  mcq: Object.fromEntries(full.items.filter((i) => i.type === 'mcq').map((i) => [i.id, i.optionGlossZh])),
});
const noSynonyms = () => ({ verdicts: Object.fromEntries(full.items.filter((i) => i.type === 'wordCard').map((i) => [i.word, []])) });

const headers = { get: () => null };
const reply = (body) => ({ ok: true, status: 200, headers, text: async () => JSON.stringify({ choices: [{ message: { content: JSON.stringify(body) }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 10, cost: 0 } }) });
const r429 = () => ({ ok: false, status: 429, headers, text: async () => '{"error":{"code":429,"metadata":{"provider_name":"X"}}}' });
const keyReply = { ok: true, status: 200, headers, text: async () => JSON.stringify({ data: { free_model_daily_requests: { remaining: 40 } } }) };
function fakeApi(chat) {
  const requests = [];
  return {
    requests,
    fetch: async (url, init) => {
      if (url.endsWith('/key')) return keyReply;
      requests.push(JSON.parse(init.body));
      if (!chat.length) throw new Error('非預期的額外呼叫');
      return chat.shift();
    },
  };
}
const fakeClock = () => {
  let t = 0;
  return { now: () => t, sleep: async (ms) => { t += ms; } };
};

async function withOut(doc, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'backfill-'));
  try {
    mkdirSync(join(dir, 'a1'), { recursive: true });
    writeFileSync(join(dir, 'a1', 'a1-u01-l01.json'), JSON.stringify(doc));
    await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
const run = (fetch, dir) =>
  runBackfill({ lessons: [LESSON], client: createOpenRouterClient({ apiKey: 'sk-fake', fetch }), genModel: GEN, judgeModel: JUDGE, outDir: dir, checkCtx: ctx, runId: 'bf', clock: fakeClock() });
const finalDoc = (dir) => JSON.parse(readFileSync(join(dir, 'a1', 'a1-u01-l01.json'), 'utf8'));

test('mergeGloss：只加三個欄位，其他欄位一字不動', () => {
  const doc = legacyDoc();
  const merged = mergeGloss(doc, glossBody());
  const strip = (d) => JSON.stringify({ ...d, items: d.items.map(({ glossZh, distractorsZh, optionGlossZh, ...rest }) => rest) });
  assert.equal(strip(merged), strip(doc));
  assert.equal(merged.items[0].glossZh, '這個；那個（特指）');
  assert.deepEqual(merged.items[13].optionGlossZh, ['⋯的', '在⋯裡', '和', '到']);
});

test('成功：補欄＋判題無同義 → 寫回合格檔、記 glossBackfill；帳本角色為 gloss／gloss-judge（不計入產題次數）', () =>
  withOut(legacyDoc(), async (dir) => {
    const api = fakeApi([reply(glossBody()), reply(noSynonyms())]);
    const { run: r } = await run(api.fetch, dir);
    assert.deepEqual(r.lessons, [{ lessonId: 'a1-u01-l01', status: 'ok' }]);
    assert.deepEqual(api.requests.map((b) => b.model), [GEN, JUDGE]);
    const doc = finalDoc(dir);
    assert.equal(doc.items[7].glossZh, '有；擁有');
    assert.deepEqual(doc.glossBackfill, { model: GEN, promptVersion: 'gloss-backfill.v1', judgeModel: JUDGE, judgePromptVersion: 'gloss-judge.v1' });
    assert.equal(doc.promptVersion, 'gen-lesson.v1');
    assert.deepEqual(r.calls.map((c) => c.role), ['gloss', 'gloss-judge']);
  }));

test('判題認為干擾項與正解同義 → 不寫入、存 _rejected/<id>.gloss.json', () =>
  withOut(legacyDoc(), async (dir) => {
    const verdicts = noSynonyms();
    verdicts.verdicts.and = [0];
    const api = fakeApi([reply(glossBody()), reply(verdicts)]);
    const { run: r } = await run(api.fetch, dir);
    assert.deepEqual(r.lessons.map((l) => l.status), ['judge_rejected']);
    assert.equal(finalDoc(dir).items[0].glossZh, undefined);
    assert.ok(existsSync(join(dir, '_rejected', 'a1-u01-l01.gloss.json')));
  }));

test('補的欄位有簡體或缺卡 → check_failed、不寫入、不送判題', () =>
  withOut(legacyDoc(), async (dir) => {
    const body = glossBody();
    body.cards[0].glossZh = '这个';
    body.cards.pop();
    const api = fakeApi([reply(body)]);
    const { run: r } = await run(api.fetch, dir);
    assert.equal(api.requests.length, 1);
    assert.deepEqual(r.lessons.map((l) => l.status), ['check_failed']);
    const codes = r.lessons[0].errors.map((e) => e.code);
    assert.ok(codes.includes('SIMPLIFIED') && codes.includes('MISSING_FIELD'));
    assert.equal(finalDoc(dir).items[0].glossZh, undefined);
  }));

test('不需補欄的課跳過、零請求：v3（即使缺欄也不補，缺欄由檢查器擋）、舊格式但已有欄位', async () => {
  const v3Missing = legacyDoc();
  v3Missing.promptVersion = 'gen-lesson.v3';
  const legacyFilled = structuredClone(full);
  legacyFilled.promptVersion = 'gen-lesson.v2';
  for (const doc of [v3Missing, legacyFilled]) {
    await withOut(doc, async (dir) => {
      const api = fakeApi([]);
      const { run: r } = await run(api.fetch, dir);
      assert.equal(api.requests.length, 0);
      assert.deepEqual(r.lessons, [{ lessonId: 'a1-u01-l01', status: 'not_needed' }]);
    });
  }
});

test('CLI 前置：非 :free、同家族判題皆 exit 2（輸出到暫存目錄）', () => {
  const cli = fileURLToPath(new URL('../scripts/backfill-gloss.mjs', import.meta.url));
  const out = join(tmpdir(), 'linguaapp-backfill-refuse');
  const runCli = (args) => spawnSync(process.execPath, [cli, '--out', out, '--lessons', 'a1-u01-l01', '--env', 'none.env', ...args], { encoding: 'utf8', env: { ...process.env, OPENROUTER_API_KEY: 'sk-test-not-used' } });
  const paid = runCli(['--model', 'anthropic/claude-sonnet-5.5', '--judge-model', JUDGE]);
  assert.equal(paid.status, 2);
  assert.match(paid.stderr, /只准 :free 模型/);
  const same = runCli(['--model', GEN, '--judge-model', 'qwen/qwen3.8-coder:free']);
  assert.equal(same.status, 2);
  assert.match(same.stderr, /不同家族/);
});

test('判題 429：排隊延後，補欄結果先落檔、不重新補欄', () =>
  withOut(legacyDoc(), async (dir) => {
    const api = fakeApi([reply(glossBody()), r429(), reply(noSynonyms())]);
    const { run: r } = await run(api.fetch, dir);
    assert.deepEqual(api.requests.map((b) => b.model), [GEN, JUDGE, JUDGE]);
    assert.deepEqual(r.lessons.map((l) => l.status), ['ok']);
  }));
