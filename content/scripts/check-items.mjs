// 用法：node scripts/check-items.mjs [--require-judge] [--dir <items dir>] [--lexicon <file>] [--dict <dir>] [--curriculum <dir>] [--allowlist <file>] [檔案…]
// 未指定檔案＝檢查 <dir>/<level>/*.json 全部，並查課綱每課都有題檔（MISSING_ITEMS；片語課過渡規則見 item-rules.mjs
// 的 PHRASE_ITEMS_PENDING_LEVELS）。無錯 exit 0；有錯逐條印出、exit 1。

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { blockingErrors, checkAnswerLongest, checkAnswerPositionPatterns, checkItemCoverage, checkLessonItems, checkLevelAnswerPositions, checkUnitAnswerPositions } from './lib/check-items.mjs';
import { DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'require-judge': { type: 'boolean', default: false },
    dir: { type: 'string', default: DEFAULT_PATHS.items },
    lexicon: { type: 'string', default: DEFAULT_PATHS.lexicon },
    dict: { type: 'string', default: DEFAULT_PATHS.dict },
    curriculum: { type: 'string', default: DEFAULT_PATHS.curriculum },
    allowlist: { type: 'string', default: DEFAULT_PATHS.allowlist },
  },
});

const ctx = loadCheckContext(values);
const files = positionals.length
  ? positionals
  : ['a1', 'a2', 'b1', 'b2', 'c1']
      .map((level) => join(values.dir, level))
      .filter((dir) => existsSync(dir))
      .flatMap((dir) => readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => join(dir, f)));

let total = 0;
let notices = 0;
const docs = [];
for (const file of files) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  docs.push(doc);
  // 課號以檔內 lessonId 為準（退件保留檔名為 <id>.a<N>.json）；檔名對不上課綱時才報錯。
  const lessonId = doc.lessonId ?? basename(file, '.json');
  const lesson = ctx.lessons.get(lessonId);
  const all = lesson
    ? checkLessonItems(doc, { ...ctx, lesson, requireJudge: values['require-judge'] })
    : [{ code: 'LESSON_MISMATCH', path: '/', message: `課綱沒有 ${lessonId}` }];
  for (const e of all) console.error(`${e.notice ? '提示 ' : ''}${e.code}\t${relative(process.cwd(), file)}\t${e.path}\t${e.message}`);
  const blocking = blockingErrors(all).length;
  total += blocking;
  notices += all.length - blocking;
}
// 正解位置②③④：同一級、同一單元跨課合計；同一級相鄰題位置差的規律；正解長度：同一級正解的長度名次分布＋單題異常值
for (const e of [...checkLevelAnswerPositions(docs), ...checkUnitAnswerPositions(docs), ...checkAnswerPositionPatterns(docs), ...checkAnswerLongest(docs)]) {
  console.error(`${e.code}	${e.path}	${e.message}`);
  total += 1;
}
let pending = 0;
if (!positionals.length) {
  const coverage = checkItemCoverage(ctx.lessons, new Set(files.map((f) => basename(f, '.json'))));
  for (const e of coverage.errors) console.error(`${e.code}	${e.path}	${e.message}`);
  total += coverage.errors.length;
  pending = coverage.pending;
}
console.log(
  `檢查 ${files.length} 課：${total ? `${total} 個錯誤` : '全綠'}${notices ? `（另有 ${notices} 個提示：舊格式缺 TASK-12 欄位）` : ''}` +
    (pending ? `；${pending} 堂片語課尚未產題（過渡，見 PHRASE_ITEMS_PENDING_LEVELS）` : ''),
);
process.exitCode = total ? 1 : 0;
