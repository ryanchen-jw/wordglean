// 用法：
//   乾跑（不需金鑰、不碰網路）：node scripts/gen-items.mjs --fixture --lessons a1-u01,b1-u01 [--out <dir>]
//   真打（只准 :free）：node scripts/gen-items.mjs --lessons <小課或單元 id，逗號分隔> --model <id>:free --judge-model <id>:free --budget 0
//            [--judge-fallback <id>:free] [--gen-prompt gen-lesson.v2] [--regen-rejected]
//            [--prices <定價快照>] [--env <.env 檔>] [--out <dir>]
//   --judge-fallback：主判題連續 6 次 429 後，本次執行剩下的課改用此模型判題（產題不重做）。
//   --gen-prompt：新產題用的 prompt 版本（預設 gen-lesson.v1）。
//   --regen-rejected：重產授權——退件的課（檢查失敗或產題解析失敗）在累計產題次數 < --max-attempts（預設 2）時，
//                     以 --regen-prompt（預設 gen-lesson.v2）再產一次；前次檔改名 _rejected/<id>.a<N>.* 保留。其餘退件一律跳過。
// 真打前置（任一不符即 exit 2、未呼叫任何 API）：所有模型 id 皆以 :free 結尾、有金鑰、有 --budget（≥ 0，免費模型設 0）、
// 判題（含備援）與產題模型不同家族、定價快照有兩個模型、預估最壞金額 ≤ budget。
// 結束碼：0 全部 ok／skipped；1 有課解析、判題或檢查失敗；3 錯誤、預算不足或回報花費非 0 而停止；
// 4 每日額度將盡收工或有課因 429 列今日未完成（同一指令明天再下即從斷點續：已完成跳過、_pending/ 只補判題）。
// 不自動重跑：失敗的課放 <out>/_rejected/，要重產須另行下指令。

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createFakeClient } from './lib/fake-llm.mjs';
import { MAX_TOKENS, runGeneration } from './lib/generate.mjs';
import { CONTENT_ROOT, DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';
import { MissingKeyError, assertFreeModel, createOpenRouterClient, readApiKey } from './lib/openrouter.mjs';
import { buildGenMessages } from './lib/prompts.mjs';
import { callCost, loadPrices, messagesTokens } from './lib/pricing.mjs';

const { values } = parseArgs({
  options: {
    lessons: { type: 'string' },
    model: { type: 'string' },
    'judge-model': { type: 'string' },
    'judge-fallback': { type: 'string' },
    'gen-prompt': { type: 'string', default: 'gen-lesson.v1' },
    'regen-rejected': { type: 'boolean', default: false },
    'regen-prompt': { type: 'string', default: 'gen-lesson.v2' },
    'max-attempts': { type: 'string', default: '2' },
    budget: { type: 'string' },
    fixture: { type: 'boolean', default: false },
    out: { type: 'string' },
    env: { type: 'string', default: resolve(CONTENT_ROOT, '../.env') },
    prices: { type: 'string', default: resolve(CONTENT_ROOT, 'pricing/openrouter-2026-10-02.json') },
    'run-id': { type: 'string' },
    lexicon: { type: 'string', default: DEFAULT_PATHS.lexicon },
    dict: { type: 'string', default: DEFAULT_PATHS.dict },
    curriculum: { type: 'string', default: DEFAULT_PATHS.curriculum },
    allowlist: { type: 'string', default: DEFAULT_PATHS.allowlist },
  },
});

const refuse = (message) => {
  console.error(`拒絕執行：${message}`);
  process.exit(2);
};

if (!values.lessons) refuse('需要 --lessons');
// 重產授權：每課累計產題最多 3 次（執行長 2026-10-02 代決），硬上限。
const maxAttempts = Number(values['max-attempts']);
if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) refuse(`--max-attempts 須為 1–3（收到 ${values['max-attempts']}）`);
const ctx = loadCheckContext(values);
const lessons = [];
for (const id of values.lessons.split(',').map((s) => s.trim()).filter(Boolean)) {
  const matched = [...ctx.lessons.values()].filter((l) => l.id === id || l.unitId === id);
  if (!matched.length) refuse(`課綱沒有小課或單元 ${id}`);
  lessons.push(...matched);
}

const runId = values['run-id'] ?? `${new Date().toISOString().replace(/[:.]/g, '-')}${values.fixture ? '-dryrun' : ''}`;
let client;
let prices = null;
let budgetUsd = Infinity;
let genModel = values.model ?? 'fixture/fake-gen';
let judgeModel = values['judge-model'] ?? 'fixture/fake-judge';
let outDir = values.out;

if (values.fixture) {
  process.env.LINGUAAPP_OFFLINE = '1'; // 乾跑：網路守衛擋下任何真請求
  client = createFakeClient();
  outDir ??= mkdtempSync(join(tmpdir(), 'linguaapp-dryrun-'));
} else {
  if (!values.model || !values['judge-model']) refuse('真打必須指定 --model 與 --judge-model');
  const judgeFallback = values['judge-fallback'];
  for (const m of [genModel, judgeModel, ...(judgeFallback ? [judgeFallback] : [])]) {
    try {
      assertFreeModel(m);
    } catch (err) {
      refuse(err.message);
    }
  }
  try {
    client = createOpenRouterClient({ apiKey: readApiKey({ envFile: values.env }) });
  } catch (err) {
    if (err instanceof MissingKeyError) refuse(err.message);
    throw err;
  }
  if (values.budget === undefined || !(Number(values.budget) >= 0)) refuse('真打必須帶 --budget <USD>（≥ 0；免費模型設 0）');
  const family = (id) => id.split('/')[0];
  if (family(genModel) === family(judgeModel)) refuse(`判題模型須與產題模型不同家族（皆為 ${family(genModel)}）`);
  if (judgeFallback && family(genModel) === family(judgeFallback)) {
    refuse(`備援判題模型須與產題模型不同家族（皆為 ${family(genModel)}）`);
  }
  budgetUsd = Number(values.budget);
  prices = loadPrices(values.prices);
  for (const m of [genModel, judgeModel, ...(judgeFallback ? [judgeFallback] : [])]) {
    if (!prices.models[m]) refuse(`定價快照 ${values.prices} 沒有 ${m}`);
  }
  // 開跑前預估最壞金額（每課輸出都打滿上限；判題輸入以產題輸入近似）。
  const worst = lessons.reduce((sum, lesson) => {
    const input = messagesTokens(buildGenMessages(lesson, ctx));
    return sum + callCost(prices, genModel, input, MAX_TOKENS.gen) + callCost(prices, judgeModel, input, MAX_TOKENS.judge);
  }, 0);
  console.log(`預估最壞金額 US$${worst.toFixed(4)}（${lessons.length} 課，定價快照 ${prices.fetchedAt.slice(0, 10)}）`);
  if (worst > budgetUsd) refuse(`預估最壞金額 US$${worst.toFixed(4)} 超過 --budget ${budgetUsd}`);
  outDir ??= DEFAULT_PATHS.items;
}

console.log(`${values.fixture ? '乾跑' : '真打'}：${lessons.length} 課 → ${outDir}`);
const { run, runFile } = await runGeneration({
  lessons,
  client,
  genModel,
  judgeModel,
  judgeFallback: values.fixture ? null : (values['judge-fallback'] ?? null),
  genPrompt: values['gen-prompt'],
  regenRejected: values['regen-rejected'],
  regenPrompt: values['regen-prompt'],
  maxAttempts,
  prices,
  budgetUsd,
  outDir,
  checkCtx: ctx,
  runId,
  log: (line) => console.log(line),
  // 乾跑不碰網路，不需要每分鐘節流。
  limits: values.fixture ? { perMinute: Infinity } : {},
});

const count = (status) => run.lessons.filter((l) => l.status === status).length;
console.log(
  `完成：ok ${count('ok')}、skipped ${count('skipped')}、parse_failed ${count('parse_failed')}、check_failed ${count('check_failed')}` +
    `、judge_failed ${count('judge_failed')}、deferred_today ${count('deferred_today')}、未處理 ${run.remaining.length}` +
    `；呼叫 ${run.calls.length} 次、token 輸入 ${run.totals.promptTokens}／輸出 ${run.totals.completionTokens}、` +
    `花費 US$${run.totals.costUsd.toFixed(4)}${run.dryRun ? '（乾跑，token 為估算）' : ''}`,
);
console.log(`帳本：${runFile}`);
if (run.quotaChecks.length) console.log(`每日免費額度：${run.quotaChecks.map((q) => q.remaining).join(' → ')}（剩餘次數，依查詢順序）`);
if (run.stoppedReason) console.error(`停止：${run.stoppedReason}`);
if (run.stoppedReason && !run.stoppedReason.startsWith('quota')) process.exitCode = 3;
else if (run.stoppedReason || count('deferred_today')) process.exitCode = 4;
else process.exitCode = count('parse_failed') + count('check_failed') + count('judge_failed') ? 1 : 0;
