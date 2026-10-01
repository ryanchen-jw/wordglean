// 逐段量測執行器：一次只跑一個情境、依序、絕不並行。
// 每段開跑前以 PowerShell 量系統空閒記憶體：≥4 GB 才開跑；不足每 2 分鐘再量，最多等 45 分鐘，等不到就停。
// 跑中中止（空閒 <1.2 GB 或本量測行程 >3 GB）由 voice.spec.js 的取樣器負責。
// 結果記在 results/segments.json；重跑只跳過 exitCode 0 的段落，失敗段落重跑後覆蓋舊紀錄。
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const SEGMENTS = [
  ['chromium-android', 'A'], ['chromium-android', 'B'], ['chromium-android', 'B2'], ['chromium-android', 'C'],
  ['chromium-android', 'E'], ['chromium-android', 'F'], ['chromium-android', 'G'],
  ['webkit-ios', 'A'], ['webkit-ios', 'B'], ['webkit-ios', 'B2'], ['webkit-ios', 'C'], ['webkit-ios', 'E'], ['webkit-ios', 'F'],
  ['chromium-android', 'D'], ['webkit-ios', 'D'],
  ['chromium-android-coi', 'C'], ['chromium-android-coi', 'F'],
];
// 可帶參數只跑指定段落，例：node tests/run-segments.mjs webkit-ios:C webkit-ios:E
const ONLY = process.argv.slice(2);
const START_MB = 4 * 1024;
const WAIT_STEP_MS = 2 * 60 * 1000;
const WAIT_MAX_MS = 45 * 60 * 1000;
const LOG = 'results/segments.json';

const log = (msg) => console.log(`${new Date().toISOString()} ${msg}`);
const freeMB = () =>
  Number(execFileSync('powershell.exe', ['-NoProfile', '-Command', '(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory']).toString().trim()) / 1024;

mkdirSync('results', { recursive: true });
const done = existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf-8')) : [];
const save = () => writeFileSync(LOG, JSON.stringify(done, null, 1));

log('build');
spawnSync('npx vite build', { shell: true, stdio: 'ignore' });

for (const [project, letter] of SEGMENTS) {
  if (ONLY.length && !ONLY.includes(`${project}:${letter}`)) continue;
  if (done.some((d) => d.project === project && d.letter === letter && d.exitCode === 0)) continue;
  const waitStart = Date.now();
  let free = freeMB();
  while (free < START_MB) {
    if (Date.now() - waitStart >= WAIT_MAX_MS) {
      log(`STOP 等待 45 分鐘仍不足 4 GB（現 ${free.toFixed(0)} MB），停在 ${project} ${letter}`);
      process.exit(2);
    }
    log(`WAIT ${project} ${letter}：空閒 ${free.toFixed(0)} MB < 4096，2 分鐘後再量`);
    await new Promise((r) => setTimeout(r, WAIT_STEP_MS));
    free = freeMB();
  }
  log(`RUN ${project} ${letter}（空閒 ${free.toFixed(0)} MB）`);
  const t0 = Date.now();
  const r = spawnSync(`npx playwright test --project=${project} -g " ${letter}\\. "`, { shell: true, encoding: 'utf-8' });
  const tail = (r.stdout + r.stderr).split('\n').filter((l) => /passed|failed|skipped|Error/.test(l)).slice(-4).join(' | ');
  const prev = done.findIndex((d) => d.project === project && d.letter === letter);
  if (prev >= 0) done.splice(prev, 1);
  done.push({ project, letter, exitCode: r.status, freeMBAtStart: Math.round(free), minutes: +((Date.now() - t0) / 60000).toFixed(1), tail: tail.replace(/\x1b\[[0-9;]*m/g, '') });
  save();
  log(`END ${project} ${letter} exit=${r.status} ${done.at(-1).minutes} 分`);
}
log('ALL DONE');
