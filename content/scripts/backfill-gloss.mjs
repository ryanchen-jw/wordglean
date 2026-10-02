// 用法：node scripts/backfill-gloss.mjs --lessons a1-u01,b1-u01 --model <id>:free --judge-model <id>:free [--env <.env>] [--out <dir>] [--run-id <id>]
// 替已合格、gen-lesson.v1／v2 產生、缺 TASK-12 四選一欄位的課補 glossZh／distractorsZh／optionGlossZh（gloss-backfill.v1），不重產題目。
// 前置（任一不符 exit 2、未呼叫任何 API）：兩個模型皆 :free、不同家族、有金鑰。
// 結束碼：0 全部 ok／不需補；1 有課補欄失敗（解析、檢查、判題同義）；3 錯誤或花費非 0；4 額度收工或今日未完成。

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { runBackfill } from './lib/backfill.mjs';
import { CONTENT_ROOT, DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';
import { MissingKeyError, assertFreeModel, createOpenRouterClient, readApiKey } from './lib/openrouter.mjs';

const { values } = parseArgs({
  options: {
    lessons: { type: 'string' },
    model: { type: 'string' },
    'judge-model': { type: 'string' },
    env: { type: 'string', default: resolve(CONTENT_ROOT, '../.env') },
    out: { type: 'string', default: DEFAULT_PATHS.items },
    'run-id': { type: 'string' },
  },
});
const refuse = (message) => {
  console.error(`拒絕執行：${message}`);
  process.exit(2);
};

if (!values.lessons || !values.model || !values['judge-model']) refuse('需要 --lessons、--model、--judge-model');
for (const m of [values.model, values['judge-model']]) {
  try {
    assertFreeModel(m);
  } catch (err) {
    refuse(err.message);
  }
}
const family = (id) => id.split('/')[0];
if (family(values.model) === family(values['judge-model'])) refuse(`判題模型須與補欄模型不同家族（皆為 ${family(values.model)}）`);
const ctx = loadCheckContext();
const ids = values.lessons.split(',').map((s) => s.trim()).filter(Boolean);
const lessons = [...ctx.lessons.values()].filter((l) => ids.includes(l.id) || ids.includes(l.unitId));
if (!lessons.length) refuse(`課綱沒有 ${values.lessons}`);
let client;
try {
  client = createOpenRouterClient({ apiKey: readApiKey({ envFile: values.env }) });
} catch (err) {
  if (err instanceof MissingKeyError) refuse(err.message);
  throw err;
}

const runId = values['run-id'] ?? `gloss-${new Date().toISOString().replace(/[:.]/g, '-')}`;
console.log(`補欄：${lessons.length} 課（只處理已合格、舊格式、缺欄者）→ ${values.out}`);
const { run, runFile } = await runBackfill({
  lessons,
  client,
  genModel: values.model,
  judgeModel: values['judge-model'],
  outDir: values.out,
  checkCtx: ctx,
  runId,
  log: (line) => console.log(line),
});
const count = (s) => run.lessons.filter((l) => l.status === s).length;
console.log(
  `完成：ok ${count('ok')}、不需補 ${count('not_needed')}、未合格 ${count('not_final')}、parse_failed ${count('parse_failed')}、check_failed ${count('check_failed')}` +
    `、judge_rejected ${count('judge_rejected')}、judge_failed ${count('judge_failed')}、deferred_today ${count('deferred_today')}、未處理 ${run.remaining.length}；呼叫 ${run.calls.length} 次`,
);
console.log(`帳本：${runFile}`);
if (run.quotaChecks.length) console.log(`每日免費額度：${run.quotaChecks.map((q) => q.remaining).join(' → ')}`);
if (run.stoppedReason) console.error(`停止：${run.stoppedReason}`);
if (run.stoppedReason && !run.stoppedReason.startsWith('quota')) process.exitCode = 3;
else if (run.stoppedReason || count('deferred_today')) process.exitCode = 4;
else process.exitCode = count('parse_failed') + count('check_failed') + count('judge_rejected') + count('judge_failed') ? 1 : 0;
