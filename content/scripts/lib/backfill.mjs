// 補欄流程（gloss-backfill.v1，執行長 2026-10-02 放行）：只替「已合格、gen-lesson.v1／v2 產生、缺 TASK-12 欄位」的課
// 補 glossZh、distractorsZh、optionGlossZh，不重產題目、不動其他欄位。
// 流程：補欄（產題模型）→ 合併後跑檢查器（含完整性）→ 判題模型檢查干擾項是否與正解同義 → 全過才寫回合格檔。
// 規則同產題流程：只准 :free、429 排隊延後（超過 5 次今日未完成）、每分鐘節流、每日額度 ≤2 收工、花費非 0 中止、不自動重跑。
// 帳本角色為 gloss／gloss-judge，不計入產題次數（重產授權以 role=gen 計次）。

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { blockingErrors, checkLessonItems } from './check-items.mjs';
import { LIMITS, PaidUsageError, QuotaStop, createRateWindow, parseModelJson } from './generate.mjs';
import { LEGACY_PROMPTS } from './item-rules.mjs';
import { RateLimitError } from './openrouter.mjs';
import { fill, loadPrompt } from './prompts.mjs';

export const GLOSS_PROMPT = 'gloss-backfill.v1';
export const GLOSS_JUDGE_PROMPT = 'gloss-judge.v1';
const MAX_TOKENS = { gloss: 8000, 'gloss-judge': 12000 };

const writeJson = (file, data) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const cardsOf = (doc) => doc.items.filter((it) => it.type === 'wordCard');
const needsBackfill = (doc) => LEGACY_PROMPTS.has(doc.promptVersion) && cardsOf(doc).some((c) => c.glossZh === undefined);

// 模型輸出 { cards: [{word, glossZh, distractorsZh}], mcq: {id: [...]} } 合併進題目檔；只加這三個欄位。
export function mergeGloss(doc, parsed) {
  const merged = structuredClone(doc);
  const byWord = new Map((parsed.cards ?? []).map((c) => [c.word, c]));
  for (const it of merged.items) {
    if (it.type === 'wordCard' && byWord.has(it.word)) {
      const c = byWord.get(it.word);
      if (c.glossZh !== undefined) it.glossZh = c.glossZh;
      if (c.distractorsZh !== undefined) it.distractorsZh = c.distractorsZh;
    }
    if (it.type === 'mcq' && parsed.mcq?.[it.id] !== undefined) it.optionGlossZh = parsed.mcq[it.id];
  }
  return merged;
}

function glossMessages(doc) {
  const prompt = loadPrompt(GLOSS_PROMPT);
  const vars = {
    lessonId: doc.lessonId,
    level: doc.level,
    cards: JSON.stringify(cardsOf(doc).map(({ word, exampleEn, exampleZh }) => ({ word, exampleEn, exampleZh })), null, 1),
    mcqs: JSON.stringify(doc.items.filter((it) => it.type === 'mcq').map(({ id, stemEn, options }) => ({ id, stemEn, options })), null, 1),
  };
  return [
    { role: 'system', content: fill(prompt.system, vars) },
    { role: 'user', content: fill(prompt.user, vars) },
  ];
}

function judgeMessages(doc) {
  const prompt = loadPrompt(GLOSS_JUDGE_PROMPT);
  const cards = cardsOf(doc).map(({ word, exampleEn, glossZh, distractorsZh }) => ({ word, sentence: exampleEn, correct: glossZh, candidates: distractorsZh }));
  const vars = { cards: JSON.stringify(cards, null, 1) };
  return [
    { role: 'system', content: fill(prompt.system, vars) },
    { role: 'user', content: fill(prompt.user, vars) },
  ];
}

// 合併後的檢查：檢查器阻擋錯誤＋每張單字卡都有兩個新欄位（舊格式缺欄在檢查器只是提示，這裡要求完整）。
function checkMerged(doc, lesson, checkCtx) {
  const errors = blockingErrors(checkLessonItems(doc, { ...checkCtx, lesson, requireJudge: true }));
  doc.items.forEach((it, i) => {
    if (it.type !== 'wordCard') return;
    for (const key of ['glossZh', 'distractorsZh']) {
      if (it[key] === undefined) errors.push({ code: 'MISSING_FIELD', path: `items/${i}/${key}`, message: `補欄後仍缺 ${key}` });
    }
  });
  return errors;
}

// opts：{ lessons, client, genModel, judgeModel, outDir, checkCtx, runId, log, clock, limits }
export async function runBackfill(opts) {
  const { lessons, client, genModel, judgeModel, outDir, checkCtx, runId } = opts;
  const log = opts.log ?? (() => {});
  const clock = opts.clock ?? { now: () => Date.now(), sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };
  const limits = { ...LIMITS, ...opts.limits };
  const dirs = { runs: join(outDir, '_runs'), rejected: join(outDir, '_rejected'), pending: join(outDir, '_pending') };
  for (const d of Object.values(dirs)) mkdirSync(d, { recursive: true });
  const run = {
    runId,
    kind: 'gloss-backfill',
    startedAt: new Date(clock.now()).toISOString(),
    genModel,
    judgeModel,
    glossPrompt: GLOSS_PROMPT,
    judgePrompt: GLOSS_JUDGE_PROMPT,
    quotaChecks: [],
    calls: [],
    lessons: [],
    remaining: [],
    stoppedReason: null,
  };
  const runFile = join(dirs.runs, `${runId}.json`);
  const save = () => writeJson(runFile, run);
  const finalFile = (lesson) => join(outDir, lesson.level.toLowerCase(), `${lesson.id}.json`);
  const pendingFile = (lesson) => join(dirs.pending, `${lesson.id}.gloss.json`);
  const finish = (lesson, status, extra = {}) => {
    run.lessons.push({ lessonId: lesson.id, status, ...extra });
    log(`${lesson.id}\t${status}${extra.note ? `：${extra.note}` : ''}`);
    save();
  };

  const waitTurn = createRateWindow(limits.perMinute, clock);
  let quotaRemaining = null;
  let sinceCheck = 0;
  const checkQuota = async () => {
    const info = await client.keyInfo();
    run.quotaChecks.push({ at: new Date(clock.now()).toISOString(), ...info });
    quotaRemaining = info.remaining;
    sinceCheck = 0;
    save();
  };
  const call = async (role, model, messages, lesson) => {
    if (quotaRemaining !== null && quotaRemaining <= limits.quotaFloor) {
      throw new QuotaStop(`每日免費額度剩 ${quotaRemaining} 次（≤ ${limits.quotaFloor}），收工`);
    }
    await waitTurn();
    const record = { lessonId: lesson.id, role, model, at: new Date(clock.now()).toISOString() };
    let result;
    try {
      result = await client.complete({ model, messages, maxTokens: MAX_TOKENS[role], reasoningEffort: 'low' });
    } catch (err) {
      if (err instanceof RateLimitError) {
        run.calls.push({ ...record, status: 'rate_limited', rateLimit: err.detail ?? null });
        save();
      }
      throw err;
    } finally {
      sinceCheck += 1;
    }
    if (quotaRemaining !== null) quotaRemaining -= 1; // 只有成功的請求扣額度估算（429 不扣）
    run.calls.push({
      ...record,
      status: 'ok',
      provider: result.provider ?? null,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      reasoningTokens: result.usage.reasoningTokens ?? null,
      costUsd: result.usage.cost,
      finishReason: result.finishReason ?? null,
      durationMs: result.durationMs ?? null,
    });
    save();
    if (typeof result.usage.cost === 'number' && result.usage.cost !== 0) {
      throw new PaidUsageError(`OpenRouter 回報花費 US$${result.usage.cost}（應為 0），中止整批`);
    }
    if (sinceCheck >= limits.quotaCheckEvery) await checkQuota();
    return result.text;
  };

  // 回傳 'done' 或 'deferred'
  const processLesson = async (lesson, original) => {
    let merged;
    if (existsSync(pendingFile(lesson))) {
      merged = JSON.parse(readFileSync(pendingFile(lesson), 'utf8'));
    } else {
      let text;
      try {
        text = await call('gloss', genModel, glossMessages(original), lesson);
      } catch (err) {
        if (err instanceof RateLimitError) return 'deferred';
        throw err;
      }
      try {
        merged = mergeGloss(original, parseModelJson(text));
      } catch (err) {
        writeFileSync(join(dirs.rejected, `${lesson.id}.gloss.raw.txt`), text);
        finish(lesson, 'parse_failed', { note: err.message });
        return 'done';
      }
      const errors = checkMerged(merged, lesson, checkCtx);
      if (errors.length) {
        writeJson(join(dirs.rejected, `${lesson.id}.gloss.json`), merged);
        finish(lesson, 'check_failed', { errors, note: `${errors.length} 個錯誤` });
        return 'done';
      }
      writeJson(pendingFile(lesson), merged);
    }
    let text;
    try {
      text = await call('gloss-judge', judgeModel, judgeMessages(merged), lesson);
    } catch (err) {
      if (err instanceof RateLimitError) return 'deferred';
      throw err;
    }
    let verdicts;
    try {
      verdicts = parseModelJson(text).verdicts;
      if (!verdicts || typeof verdicts !== 'object') throw new Error('回應缺少 verdicts');
    } catch (err) {
      writeFileSync(join(dirs.rejected, `${lesson.id}.gloss-judge.raw.txt`), text);
      finish(lesson, 'judge_failed', { note: '補欄結果留在 _pending/，下次執行只補判題' });
      return 'done';
    }
    const synonyms = Object.entries(verdicts).filter(([, v]) => Array.isArray(v) && v.length);
    if (synonyms.length) {
      writeJson(join(dirs.rejected, `${lesson.id}.gloss.json`), { ...merged, glossJudge: verdicts });
      finish(lesson, 'judge_rejected', { note: `干擾項與正解同義：${synonyms.map(([w, v]) => `${w}[${v.join(',')}]`).join('、')}` });
    } else {
      merged.glossBackfill = { model: genModel, promptVersion: GLOSS_PROMPT, judgeModel, judgePromptVersion: GLOSS_JUDGE_PROMPT };
      writeJson(finalFile(lesson), merged);
      finish(lesson, 'ok');
    }
    rmSync(pendingFile(lesson), { force: true });
    return 'done';
  };

  const queue = [];
  for (const lesson of lessons) {
    const file = finalFile(lesson);
    if (!existsSync(file)) {
      run.lessons.push({ lessonId: lesson.id, status: 'not_final' });
      continue;
    }
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    if (!needsBackfill(doc)) {
      run.lessons.push({ lessonId: lesson.id, status: 'not_needed' });
      continue;
    }
    queue.push({ lesson, doc, notBefore: 0, defers: 0 });
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
        if ((await processLesson(task.lesson, task.doc)) === 'deferred') {
          task.defers += 1;
          if (task.defers > limits.maxDefers) finish(task.lesson, 'deferred_today', { note: `429 延後 ${task.defers} 次` });
          else {
            task.notBefore = clock.now() + limits.deferMs;
            queue.push(task);
          }
        }
      } catch (err) {
        queue.unshift(task);
        throw err;
      }
    }
  } catch (err) {
    const kind = err instanceof QuotaStop ? 'quota' : err instanceof PaidUsageError ? 'paid' : 'error';
    run.stoppedReason = `${kind}：${err.message}`;
    run.remaining = queue.map((t) => t.lesson.id);
    log(`停止：${run.stoppedReason}`);
  }
  run.finishedAt = new Date(clock.now()).toISOString();
  save();
  return { run, runFile };
}
