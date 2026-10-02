// 用法：node scripts/extract-review-rounds.mjs --out <json> <commit:輪次>…
// 從 git 歷史抽出各輪審題結果（每輪＝審題員寫入判題的那個 commit），整理成「課 → 各輪紀錄」，供抽審頁顯示三輪摘要。
// 例：node scripts/extract-review-rounds.mjs --out ../docs/pending/2026-10-01-item-bank-pilot/review-rounds.json 504298b:1 e9929be:2 f453e35:3

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { CONTENT_ROOT } from './lib/items-context.mjs';

const { values, positionals } = parseArgs({ allowPositionals: true, options: { out: { type: 'string' } } });
if (!values.out || !positionals.length) throw new Error('用法：--out <json> <commit:輪次>…');
const repoRoot = resolve(CONTENT_ROOT, '..');
const git = (...args) => execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' });

const byLesson = {};
for (const spec of positionals) {
  const [commit, round] = spec.split(':');
  const files = git('show', commit, '--name-only', '--format=', '--', 'content/items/a1', 'content/items/b1', 'content/items/a2', 'content/items/b2', 'content/items/c1')
    .split('\n')
    .filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const doc = JSON.parse(git('show', `${commit}:${file}`));
    if (!doc.judge?.judgedBy) continue;
    const verdicts = Object.entries(doc.judge.verdicts);
    (byLesson[doc.lessonId] ??= []).push({
      round: Number(round),
      commit,
      reviewedAt: doc.judge.reviewedAt,
      choiceQuestions: verdicts.length,
      ambiguous: verdicts.filter(([, v]) => v.length !== 1).length,
      glossSynonyms: Object.values(doc.judge.glossVerdicts ?? {}).filter((v) => v.length).length,
      issues: doc.judge.issues ?? [],
    });
  }
}
writeFileSync(values.out, `${JSON.stringify(byLesson, null, 2)}\n`);
console.log(`寫入 ${values.out}：${Object.keys(byLesson).length} 課`);
