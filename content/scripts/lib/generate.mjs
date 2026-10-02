// 產題流程：逐課「產題 → 先落檔 _pending/ → 判題 → 檢查 → 寫檔」，每次呼叫記帳。
// 失敗規則（執行長 2026-10-02 代決，見 proposal「實作偏離」）：
// - 429（平台或上游限流）＝排隊延後，不算重試：該課（或該課的判題）放佇列尾、至少 60 秒後再輪；同一課延後超過 5 次列「今日未完成」。
// - 產題成功先落檔 _pending/；判題失敗只補判題、不重產（下次執行也從 _pending/ 接續）。
// - 其他錯誤不自動重跑：解析或檢查失敗放 _rejected/；判題回應解析失敗留在 _pending/ 待下次手動執行補判題；
//   HTTP 其他錯誤、預算不足、回報花費非 0、每日額度將盡 → 停止整批，寫進度後收工。

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { blockingErrors, checkLessonItems } from './check-items.mjs';
import { RateLimitError } from './openrouter.mjs';
import { GEN_PROMPT, JUDGE_PROMPT, buildGenMessages, buildJudgeMessages } from './prompts.mjs';
import { callCost, estimateTokens, messagesTokens } from './pricing.mjs';

// 單次輸出（含推理）token 上限；同時是預算檢查的最壞情況。
// 2026-10-02 pilot 實測：判題備援 apodex 推理就用 1,000–2,100 token，2,000 上限讓 4 次判題被截斷（finish_reason=length）；
// Qwen 產題最高 11,009 token 逼近 12,000。免費模型不影響花費，上調。判題 6,000 仍有 1 次截斷（推理 5,166）→ 12,000（執行長 2026-10-02 同意）。
export const MAX_TOKENS = { gen: 16000, judge: 12000 };

// 各模型的推理強度（null＝不送 reasoning 欄）；未列者用 low。依據：docs/research/free-models.md §1。
export const REASONING = {
  'qwen/qwen3.8-27b:free': 'low',
  'google/gemma-4-31b-it:free': null,
};
export const reasoningFor = (model) => (model in REASONING ? REASONING[model] : 'low');

export const LIMITS = {
  perMinute: 20, // OpenRouter 免費模型每分鐘上限
  deferMs: 60_000, // 429 後至少間隔
  maxDefers: 5, // 同一課延後超過此次數 → 今日未完成
  quotaCheckEvery: 10, // 每幾次模型呼叫查一次 /key
  quotaFloor: 2, // 每日剩餘 ≤ 此數即收工
  judgeFallbackAfter: 6, // 主判題連續 429 達此次數 → 改用備援判題模型
};

// 重產授權（執行長 2026-10-02 代決）：判題後檢查失敗的課，可用此版 prompt 各重產一次（attempt 2）。
export const REGEN_PROMPT = 'gen-lesson.v2';

export class BudgetError extends Error {}
export class PaidUsageError extends Error {}
export class QuotaStop extends Error {}

const realClock = { now: () => Date.now(), sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };

// 每分鐘呼叫次數上限：滑動 60 秒視窗，滿了就等到最舊那次滿 60 秒。
export function createRateWindow(perMinute, clock) {
  const stamps = [];
  return async () => {
    for (;;) {
      const now = clock.now();
      while (stamps.length && now - stamps[0] >= 60_000) stamps.shift();
      if (stamps.length < perMinute) {
        stamps.push(now);
        return;
      }
      await clock.sleep(60_000 - (now - stamps[0]));
    }
  };
}

export function parseModelJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('回應中沒有 JSON 物件');
  return JSON.parse(text.slice(start, end + 1));
}

// 模型輸出 { properNouns, items } → 一課題目檔（題號依輸出順序編）。
export function assembleDoc(lesson, parsed, { model, promptVersion }) {
  if (!Array.isArray(parsed.items)) throw new Error('回應缺少 items 陣列');
  return {
    schemaVersion: 1,
    lessonId: lesson.id,
    level: lesson.level,
    promptVersion,
    model,
    properNouns: Array.isArray(parsed.properNouns) ? parsed.properNouns : [],
    items: parsed.items.map((item, i) => ({ id: `${lesson.id}-q${String(i + 1).padStart(2, '0')}`, ...item })),
  };
}

const writeJson = (file, data) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

// opts：{ lessons, client, genModel, judgeModel, judgeFallback, genPrompt, regenRejected, prices, budgetUsd, outDir,
//         checkCtx, runId, log, clock, limits }
// prices＝null 表示乾跑（成本記 0、不檢查預算）。client.keyInfo 存在才做每日額度查核。
// regenRejected：允許把「判題後檢查失敗、attempt 1」的課用 REGEN_PROMPT 重產一次；其餘退件一律跳過。
export async function runGeneration(opts) {
  const { lessons, client, genModel, judgeModel, prices, budgetUsd = Infinity, outDir, checkCtx, runId } = opts;
  const genPrompt = opts.genPrompt ?? GEN_PROMPT;
  const regenPrompt = opts.regenPrompt ?? REGEN_PROMPT;
  const maxAttempts = opts.maxAttempts ?? 2;
  const judgeFallback = opts.judgeFallback ?? null;
  const log = opts.log ?? (() => {});
  const clock = opts.clock ?? realClock;
  const limits = { ...LIMITS, ...opts.limits };
  const run = {
    runId,
    startedAt: new Date(clock.now()).toISOString(),
    genModel,
    judgeModel,
    judgeFallback,
    judgeSwitches: [],
    genPrompt,
    regenRejected: Boolean(opts.regenRejected),
    judgePrompt: JUDGE_PROMPT,
    budgetUsd: Number.isFinite(budgetUsd) ? budgetUsd : null,
    dryRun: prices === null,
    quotaChecks: [],
    calls: [],
    lessons: [],
    remaining: [],
    totals: { promptTokens: 0, completionTokens: 0, costUsd: 0 },
    stoppedReason: null,
  };
  const dirs = { runs: join(outDir, '_runs'), rejected: join(outDir, '_rejected'), pending: join(outDir, '_pending') };
  for (const dir of Object.values(dirs)) mkdirSync(dir, { recursive: true });
  const runFile = join(dirs.runs, `${runId}.json`);
  const save = () => writeJson(runFile, run);
  const finalFile = (lesson) => join(outDir, lesson.level.toLowerCase(), `${lesson.id}.json`);
  const pendingFile = (lesson) => join(dirs.pending, `${lesson.id}.json`);

  const waitTurn = createRateWindow(limits.perMinute, clock);
  let quotaRemaining = null;
  let callsSinceCheck = 0;
  const checkQuota = async () => {
    if (typeof client.keyInfo !== 'function') return;
    const info = await client.keyInfo();
    run.quotaChecks.push({ at: new Date(clock.now()).toISOString(), ...info });
    quotaRemaining = info.remaining;
    callsSinceCheck = 0;
    save();
  };
  const assertQuota = () => {
    if (quotaRemaining !== null && quotaRemaining <= limits.quotaFloor) {
      throw new QuotaStop(`每日免費額度剩 ${quotaRemaining} 次（≤ ${limits.quotaFloor}），收工`);
    }
  };

  const call = async (role, model, messages, meta) => {
    assertQuota();
    if (prices) {
      const worst = callCost(prices, model, messagesTokens(messages), MAX_TOKENS[role]);
      if (run.totals.costUsd + worst > budgetUsd) {
        throw new BudgetError(
          `預算不足：已花 US$${run.totals.costUsd.toFixed(4)}，下一次 ${role} 最壞 US$${worst.toFixed(4)}，上限 US$${budgetUsd}`,
        );
      }
    }
    await waitTurn();
    const record = {
      lessonId: meta.lesson.id,
      role,
      model,
      attempt: meta.attempt,
      prompt: role === 'gen' ? meta.prompt : JUDGE_PROMPT,
      at: new Date(clock.now()).toISOString(),
    };
    let result;
    try {
      result = await client.complete({ model, messages, maxTokens: MAX_TOKENS[role], reasoningEffort: reasoningFor(model), meta });
    } catch (err) {
      if (err instanceof RateLimitError) {
        run.calls.push({ ...record, status: 'rate_limited', rateLimit: err.detail ?? null });
        save();
      }
      throw err;
    } finally {
      callsSinceCheck += 1;
    }
    // 只有成功的請求扣本地額度估算：實測 429 不扣 OpenRouter 每日額度（day3：42 次 429＋10 次成功，額度 50→42）。
    if (quotaRemaining !== null) quotaRemaining -= 1;
    const promptTokens = result.usage.promptTokens ?? messagesTokens(messages);
    const completionTokens = result.usage.completionTokens ?? estimateTokens(result.text);
    let cost = result.usage.cost;
    let costSource = 'openrouter';
    if (cost === null) {
      cost = prices ? callCost(prices, model, promptTokens, completionTokens) : 0;
      costSource = prices ? 'pricing-snapshot' : 'dry-run';
    }
    run.calls.push({
      ...record,
      status: 'ok',
      provider: result.provider ?? null,
      servedModel: result.servedModel ?? null,
      promptTokens,
      completionTokens,
      reasoningTokens: result.usage.reasoningTokens ?? null,
      costUsd: cost,
      costSource,
      finishReason: result.finishReason ?? null,
      durationMs: result.durationMs ?? null,
    });
    run.totals.promptTokens += promptTokens;
    run.totals.completionTokens += completionTokens;
    run.totals.costUsd += cost;
    save();
    if (costSource === 'openrouter' && cost !== 0) {
      throw new PaidUsageError(`OpenRouter 回報花費 US$${cost}（應為 0），中止整批`);
    }
    if (callsSinceCheck >= limits.quotaCheckEvery) await checkQuota();
    return result.text;
  };

  const finish = (lesson, status, extra = {}) => {
    run.lessons.push({ lessonId: lesson.id, status, ...extra });
    log(`${lesson.id}\t${status}${extra.note ? `：${extra.note}` : ''}`);
    save();
  };

  // 判題模型：主判題連續 429 達門檻 → 改用備援（本次執行剩下的課都用備援）。
  let judgeNow = judgeModel;
  let judge429InRow = 0;

  // task：{ lesson, attempt, prompt }。回傳 'done'、'deferred'（遇 429）或 'switched'（剛切到備援判題，立刻再輪）。
  const processLesson = async ({ lesson, attempt, prompt }) => {
    let doc;
    if (existsSync(pendingFile(lesson))) {
      doc = JSON.parse(readFileSync(pendingFile(lesson), 'utf8'));
      attempt = doc.attempt ?? 1;
    } else {
      let genText;
      try {
        genText = await call('gen', genModel, buildGenMessages(lesson, checkCtx, prompt), { role: 'gen', lesson, attempt, prompt });
      } catch (err) {
        if (err instanceof RateLimitError) return 'deferred';
        throw err;
      }
      // 重產：前一次的退件檔（題目檔或原文）改名 .a<前次>.* 保留，抽審頁並列各次結果。
      if (attempt > 1) {
        for (const ext of ['json', 'raw.txt']) {
          const file = join(dirs.rejected, `${lesson.id}.${ext}`);
          if (existsSync(file)) renameSync(file, join(dirs.rejected, `${lesson.id}.a${attempt - 1}.${ext}`));
        }
      }
      try {
        doc = assembleDoc(lesson, parseModelJson(genText), { model: genModel, promptVersion: prompt });
        if (attempt > 1) doc.attempt = attempt;
      } catch (err) {
        writeFileSync(join(dirs.rejected, `${lesson.id}.raw.txt`), genText);
        finish(lesson, 'parse_failed', { attempt, errors: [{ code: 'PARSE', message: err.message }], note: err.message });
        return 'done';
      }
      writeJson(pendingFile(lesson), doc);
    }

    let judgeText;
    const judgeModelUsed = judgeNow;
    try {
      judgeText = await call('judge', judgeModelUsed, buildJudgeMessages(doc), { role: 'judge', lesson, doc, attempt });
      if (judgeModelUsed === judgeModel) judge429InRow = 0;
    } catch (err) {
      if (!(err instanceof RateLimitError)) throw err;
      if (judgeModelUsed === judgeModel && judgeFallback) {
        judge429InRow += 1;
        if (judge429InRow >= limits.judgeFallbackAfter) {
          judgeNow = judgeFallback;
          run.judgeSwitches.push({ at: new Date(clock.now()).toISOString(), from: judgeModel, to: judgeFallback, after429: judge429InRow });
          log(`判題改用備援 ${judgeFallback}（${judgeModel} 連續 ${judge429InRow} 次 429）`);
          save();
          return 'switched';
        }
      }
      return 'deferred';
    }
    let verdicts;
    try {
      verdicts = parseModelJson(judgeText).verdicts;
      if (!verdicts || typeof verdicts !== 'object') throw new Error('回應缺少 verdicts');
    } catch (err) {
      writeFileSync(join(dirs.rejected, `${lesson.id}.judge.raw.txt`), judgeText);
      finish(lesson, 'judge_failed', { attempt, errors: [{ code: 'JUDGE_PARSE', message: err.message }], note: '題目留在 _pending/，下次執行只補判題' });
      return 'done';
    }
    doc.judge = { model: judgeModelUsed, promptVersion: JUDGE_PROMPT, verdicts };
    const all = checkLessonItems(doc, { ...checkCtx, lesson, requireJudge: true });
    const errors = blockingErrors(all);
    const notices = all.length - errors.length;
    const extra = { ...(attempt > 1 ? { attempt } : {}), ...(notices ? { notices } : {}) };
    if (errors.length) {
      writeJson(join(dirs.rejected, `${lesson.id}.json`), doc);
      finish(lesson, 'check_failed', { ...extra, errors, note: `${errors.length} 個錯誤` });
    } else {
      mkdirSync(join(outDir, lesson.level.toLowerCase()), { recursive: true });
      writeJson(finalFile(lesson), doc);
      finish(lesson, 'ok', extra);
    }
    rmSync(pendingFile(lesson), { force: true });
    return 'done';
  };

  // 排程：已完成跳過；_pending/ 只補判題；退件不再產題——唯一例外是 regenRejected（重產授權，執行長 2026-10-02 代決）：
  // 退件的課（檢查失敗或產題解析失敗）在累計產題次數 < maxAttempts 時，以 regenPrompt 再產一次。
  // 累計產題次數＝本輸出目錄所有帳本中該課「產題呼叫成功」的次數（含解析失敗的那次）。
  const genAttempts = new Map();
  for (const file of readdirSync(dirs.runs).filter((f) => f.endsWith('.json') && f !== `${runId}.json`)) {
    for (const c of JSON.parse(readFileSync(join(dirs.runs, file), 'utf8')).calls ?? []) {
      if (c.role === 'gen' && c.status === 'ok') genAttempts.set(c.lessonId, (genAttempts.get(c.lessonId) ?? 0) + 1);
    }
  }
  const rejectedFiles = new Set(readdirSync(dirs.rejected));
  const isRejected = (lesson) =>
    [...rejectedFiles].some((f) => f.startsWith(`${lesson.id}.`) && !f.startsWith(`${lesson.id}.judge.`));
  const queue = [];
  for (const lesson of lessons) {
    const task = { lesson, attempt: 1, prompt: genPrompt, notBefore: 0, defers: 0 };
    const done = genAttempts.get(lesson.id) ?? 1;
    if (existsSync(finalFile(lesson))) {
      run.lessons.push({ lessonId: lesson.id, status: 'skipped' });
      log(`${lesson.id}\tskipped（已有輸出檔）`);
    } else if (existsSync(pendingFile(lesson))) {
      queue.push(task);
    } else if (isRejected(lesson) && opts.regenRejected && done < maxAttempts) {
      queue.push({ ...task, attempt: done + 1, prompt: regenPrompt });
    } else if (isRejected(lesson)) {
      run.lessons.push({ lessonId: lesson.id, status: 'rejected' });
      log(`${lesson.id}\trejected（已退件，不再產題）`);
    } else {
      queue.push(task);
    }
  }
  save();

  try {
    if (queue.length) await checkQuota();
    while (queue.length) {
      const now = clock.now();
      const idx = queue.findIndex((t) => t.notBefore <= now);
      if (idx === -1) {
        await clock.sleep(Math.min(...queue.map((t) => t.notBefore)) - now);
        continue;
      }
      const [task] = queue.splice(idx, 1);
      try {
        const outcome = await processLesson(task);
        if (outcome === 'switched') {
          queue.unshift(task); // 切換那一次不計入延後次數，立刻改用備援判題
        } else if (outcome === 'deferred') {
          task.defers += 1;
          if (task.defers > limits.maxDefers) {
            finish(task.lesson, 'deferred_today', { note: `429 延後 ${task.defers} 次，今日不再排` });
          } else {
            task.notBefore = clock.now() + limits.deferMs;
            queue.push(task);
            log(`${task.lesson.id}\t429 延後（第 ${task.defers} 次）`);
          }
        }
      } catch (err) {
        queue.unshift(task);
        throw err;
      }
    }
  } catch (err) {
    const kind =
      err instanceof QuotaStop ? 'quota' : err instanceof BudgetError ? 'budget' : err instanceof PaidUsageError ? 'paid' : 'error';
    run.stoppedReason = `${kind}：${err.message}`;
    run.remaining = queue.map((t) => t.lesson.id);
    log(`停止：${run.stoppedReason}；未處理 ${run.remaining.length} 課`);
  }
  run.finishedAt = new Date(clock.now()).toISOString();
  save();
  return { run, runFile };
}
