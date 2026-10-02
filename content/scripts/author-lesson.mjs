// 開發端撰寫工具（創辦人 G5 裁示 2026-10-02：題庫由開發端 Claude 逐課撰寫，不以 OpenRouter 產題）。
// 用法：
//   node scripts/author-lesson.mjs start <lessonId>          記錄開始撰寫時間
//   node scripts/author-lesson.mjs write <lessonId> <spec>   spec＝{ properNouns, items（不含 id） }；補題號與中繼資料、寫入
//                                                            content/items/<level>/<lessonId>.json、跑檢查器（不要求判題）
// 每次 write 都記入帳本 content/items/_runs/claude-dev-pilot.json（撰寫輪次、檢查器錯誤數）；檢查器 0 錯才算該課完成。
// 撰寫準則＝prompts/gen-lesson.v3.md 的全部規則（promptVersion 記為 claude-dev.gen-lesson.v3）。

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { blockingErrors, checkLessonItems } from './lib/check-items.mjs';
import { DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';

const [cmd, lessonId, specFile] = process.argv.slice(2);
const ledgerFile = join(DEFAULT_PATHS.items, '_runs', 'claude-dev-pilot.json');
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const readLedger = () =>
  existsSync(ledgerFile) ? JSON.parse(readFileSync(ledgerFile, 'utf8')) : { kind: 'claude-dev-authoring', author: 'claude-dev', guide: 'gen-lesson.v3', lessons: {} };
const saveLedger = (l) => {
  mkdirSync(join(DEFAULT_PATHS.items, '_runs'), { recursive: true });
  writeFileSync(ledgerFile, `${JSON.stringify(l, null, 2)}\n`);
};

const ctx = loadCheckContext();
const lesson = ctx.lessons.get(lessonId);
if (!lesson) throw new Error(`課綱沒有 ${lessonId}`);
const ledger = readLedger();
const entry = (ledger.lessons[lessonId] ??= { startedAt: null, rounds: [], finishedAt: null });

if (cmd === 'start') {
  entry.startedAt = now();
  saveLedger(ledger);
  console.log(`${lessonId} 開始：${entry.startedAt}`);
} else if (cmd === 'write') {
  const spec = JSON.parse(readFileSync(specFile, 'utf8'));
  const authoredAt = now();
  const doc = {
    schemaVersion: 1,
    lessonId,
    level: lesson.level,
    promptVersion: 'claude-dev.gen-lesson.v3',
    model: 'claude-dev',
    author: 'claude-dev',
    authoredAt,
    properNouns: spec.properNouns ?? [],
    items: spec.items.map((item, i) => ({ id: `${lessonId}-q${String(i + 1).padStart(2, '0')}`, ...item })),
  };
  const errors = blockingErrors(checkLessonItems(doc, { ...ctx, lesson, requireJudge: false }));
  const dir = join(DEFAULT_PATHS.items, lesson.level.toLowerCase());
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${lessonId}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  entry.rounds.push({ at: authoredAt, errors: errors.length });
  entry.finishedAt = errors.length ? null : authoredAt;
  saveLedger(ledger);
  for (const e of errors) console.log(`${e.code}\t${e.path}\t${e.message}`);
  console.log(`${lessonId} 第 ${entry.rounds.length} 輪：${errors.length ? `${errors.length} 個錯誤` : '0 錯（完成）'}`);
  process.exitCode = errors.length ? 1 : 0;
} else {
  throw new Error('用法：start <lessonId> | write <lessonId> <spec.json>');
}
