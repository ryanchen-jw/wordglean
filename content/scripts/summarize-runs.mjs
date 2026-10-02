// 用法：node scripts/summarize-runs.mjs <帳本 _runs/*.json…>
// 彙總真打帳本：請求數、成功／429 次數與比例、每次成功呼叫的耗時與 token、各課最終狀態。輸出 markdown。

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const files = process.argv.slice(2);
if (!files.length) throw new Error('請給帳本檔');

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const fmt = (n, d = 0) => (n === null ? '—' : n.toFixed(d));

const lines = [];
const p = (s = '') => lines.push(s);
const all = [];
p('| 帳本 | 產題／判題模型 | 請求 | 成功 | 429 | 429 比例 | 每日額度（查詢序） | 停止原因 |');
p('|---|---|---|---|---|---|---|---|');
for (const file of files) {
  const run = JSON.parse(readFileSync(file, 'utf8'));
  all.push(run);
  const ok = run.calls.filter((c) => c.status === 'ok').length;
  const limited = run.calls.filter((c) => c.status === 'rate_limited').length;
  p(
    `| ${basename(file, '.json')} | ${run.genModel}／${run.judgeModel} | ${run.calls.length} | ${ok} | ${limited} | ${run.calls.length ? fmt((limited / run.calls.length) * 100) : '—'}% | ${run.quotaChecks.map((q) => q.remaining).join(' → ') || '—'} | ${run.stoppedReason ?? '—'} |`,
  );
}
p();
p('| 角色 | 模型 | 成功次數 | 429 次數 | 耗時中位（秒） | 耗時範圍（秒） | 輸入 token 中位 | 輸出 token 中位（其中推理） | finish_reason |');
p('|---|---|---|---|---|---|---|---|---|');
const calls = all.flatMap((r) => r.calls);
const groups = new Map();
for (const c of calls) {
  const key = `${c.role}\t${c.model}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(c);
}
for (const [key, cs] of groups) {
  const [role, model] = key.split('\t');
  const ok = cs.filter((c) => c.status === 'ok');
  const secs = ok.map((c) => c.durationMs / 1000);
  const reasons = [...new Set(ok.map((c) => c.finishReason))].join('、') || '—';
  p(
    `| ${role} | ${model} | ${ok.length} | ${cs.length - ok.length} | ${fmt(median(secs))} | ${secs.length ? `${fmt(Math.min(...secs))}–${fmt(Math.max(...secs))}` : '—'} | ${fmt(median(ok.map((c) => c.promptTokens)))} | ${fmt(median(ok.map((c) => c.completionTokens)))}（${fmt(median(ok.map((c) => c.reasoningTokens ?? 0)))}） | ${reasons} |`,
  );
}
p();
p('| 帳本 | 課 | 狀態 | 錯誤代碼 |');
p('|---|---|---|---|');
for (const [i, run] of all.entries()) {
  for (const l of run.lessons) {
    const codes = (l.errors ?? []).map((e) => e.code);
    const counted = [...new Set(codes)].map((c) => `${c}×${codes.filter((x) => x === c).length}`).join('、');
    p(`| ${basename(files[i], '.json')} | ${l.lessonId} | ${l.status} | ${counted || '—'} |`);
  }
  for (const id of run.remaining ?? []) p(`| ${basename(files[i], '.json')} | ${id} | 未處理（收工） | — |`);
}
process.stdout.write(`${lines.join('\n')}\n`);
