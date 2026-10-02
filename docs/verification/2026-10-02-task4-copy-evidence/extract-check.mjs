// TASK-4 覆蓋檢查：設計稿 41 狀態裡每段中文（含 aria-label、placeholder）都要在 copy-table.json
// 某列的 design 裡，或列在 excluded；另檢查每個狀態至少被一列的 where 提到、key 不重複、類型合法。
// 用法（repo 根）：node docs/verification/2026-10-02-task4-copy-evidence/extract-check.mjs
import { readFileSync } from 'node:fs';

const here = new URL('./', import.meta.url);
const root = new URL('../../../', here);
const src = readFileSync(new URL('docs/design/v1.0/review.src.html', root), 'utf8');
const table = JSON.parse(readFileSync(new URL('copy-table.json', here), 'utf8'));

const TYPES = ['按鈕', '標題', '標籤', '說明', '錯誤', '空狀態', 'Toast', '權限說明', '無金鑰', '隱私', '無障礙'];
const han = /\p{Script=Han}/u;
const problems = [];

// 設計稿：逐畫面、逐狀態抽字
const fragments = new Map(); // text -> Set("s01/default")
const states = [];
for (const [, sid, body] of src.matchAll(/<article class="shot-row" id="(s\d\d)"([\s\S]*?)<div class="shot-info">/g)) {
  const parts = body.split(/<div class="phone" data-state="/).slice(1);
  for (const part of parts) {
    const state = part.slice(0, part.indexOf('"'));
    states.push(`${sid}/${state}`);
    const clean = part.replace(/\{\{i(?:24)?:[a-z0-9-]+\}\}/g, '');
    const found = [
      ...[...clean.matchAll(/(?:aria-label|placeholder)="([^"]+)"/g)].map((m) => m[1]),
      ...[...clean.matchAll(/>([^<>]+)</g)].map((m) => m[1]),
    ];
    for (const raw of found) {
      const text = raw.trim();
      if (!han.test(text)) continue;
      if (!fragments.has(text)) fragments.set(text, new Set());
      fragments.get(text).add(`${sid}/${state}`);
    }
  }
}

const covered = new Set([...table.rows.flatMap((r) => r.design), ...table.excluded.map((e) => e.text)]);
for (const [text, where] of fragments) {
  if (!covered.has(text)) problems.push(`漏收：「${text}」（${[...where].join('、')}）`);
}
for (const text of covered) {
  if (han.test(text) && !fragments.has(text)) {
    // design 欄寫的字必須真的在設計稿裡（防止打錯字而假裝有對照）
    problems.push(`設計稿裡找不到：「${text}」`);
  }
}

const keys = new Set();
for (const r of table.rows) {
  if (keys.has(r.key)) problems.push(`key 重複：${r.key}`);
  keys.add(r.key);
  if (!/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*){1,3}$/.test(r.key)) problems.push(`key 格式不符：${r.key}`);
  if (!TYPES.includes(r.type)) problems.push(`類型不合法：${r.key}「${r.type}」`);
  if (!r.text || !r.where) problems.push(`缺推薦文案或位置：${r.key}`);
  if (r.undrawn && (r.design.length || r.states.length)) problems.push(`設計未畫卻填了設計稿原字或狀態：${r.key}`);
  if (!r.undrawn && !r.states.length) problems.push(`有畫卻沒標狀態：${r.key}`);
}

// 每個狀態都要被某列的 states 提到
const referenced = new Set(table.rows.flatMap((r) => r.states ?? []));
for (const s of states) if (!referenced.has(s)) problems.push(`沒有任何一列標到狀態：${s}`);

console.log(`設計稿：畫面 ${new Set(states.map((s) => s.slice(0, 3))).size}、狀態 ${states.length}、中文片段 ${fragments.size}`);
console.log(`總表：${table.rows.length} 列（設計未畫 ${table.rows.filter((r) => r.undrawn).length}）、刻意不收 ${table.excluded.length}`);
if (problems.length) {
  console.log(`\n✗ ${problems.length} 個問題：`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('✓ 設計稿中文全數收錄或列為不收，41 狀態皆有對應列');
