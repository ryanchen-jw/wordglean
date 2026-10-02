// 用法：node scripts/recheck-rejected.mjs [--dir <items dir>]
// 檢查器或 schema 修正後，以目前規則重判 <dir>/_rejected/<lessonId>.json（只限已有判題結果者）；
// 無阻擋錯誤 → 移到 <dir>/<level>/<lessonId>.json；其餘留在退件。不打 API、不重產、不動 .a<N>.* 保留檔。

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { blockingErrors, checkLessonItems } from './lib/check-items.mjs';
import { DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';

const { values } = parseArgs({ options: { dir: { type: 'string', default: DEFAULT_PATHS.items } } });
const ctx = loadCheckContext();
const rejectedDir = join(values.dir, '_rejected');
const files = existsSync(rejectedDir) ? readdirSync(rejectedDir).filter((f) => /^[a-c][12]-u\d{2}-l\d{2}\.json$/.test(f)) : [];

let moved = 0;
for (const f of files) {
  const doc = JSON.parse(readFileSync(join(rejectedDir, f), 'utf8'));
  const lesson = ctx.lessons.get(doc.lessonId);
  if (!doc.judge || !lesson) {
    console.log(`${doc.lessonId}\t略過（${doc.judge ? '課綱沒有此課' : '未判題'}）`);
    continue;
  }
  const errors = blockingErrors(checkLessonItems(doc, { ...ctx, lesson, requireJudge: true }));
  if (errors.length) {
    console.log(`${doc.lessonId}\t仍退件：${errors.map((e) => e.code).join('、')}`);
    continue;
  }
  const levelDir = join(values.dir, lesson.level.toLowerCase());
  mkdirSync(levelDir, { recursive: true });
  renameSync(join(rejectedDir, f), join(levelDir, f));
  moved += 1;
  console.log(`${doc.lessonId}\t通過 → 合格`);
}
console.log(`重判 ${files.length} 個退件檔：${moved} 課移到合格`);
