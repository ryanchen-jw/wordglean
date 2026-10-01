// 用法：node scripts/validate-curriculum.mjs [--lexicon <file>] [--dir <curriculum dir>]
// 讀 <dir>/topics.json 與存在的 <dir>/{a1,a2,b1,b2,c1}.json（缺檔＝該級的字報 MISSING_WORD；檔名須與檔內 level 一致）；無錯 exit 0，有錯逐條印出、exit 1。

import { existsSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { validateCurriculum } from './lib/validate.mjs';

const contentRoot = fileURLToPath(new URL('..', import.meta.url));
const { values } = parseArgs({
  options: {
    lexicon: { type: 'string', default: resolve(contentRoot, '../data/lexicon/lexicon.json') },
    dir: { type: 'string', default: resolve(contentRoot, 'curriculum') },
  },
});

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const levelFiles = ['a1', 'a2', 'b1', 'b2', 'c1']
  .map((name) => join(values.dir, `${name}.json`))
  .filter((file) => existsSync(file));

const docs = levelFiles.map(readJson);
const errors = validateCurriculum(docs, readJson(values.lexicon), readJson(join(values.dir, 'topics.json')));
docs.forEach((doc, i) => {
  const file = basename(levelFiles[i]);
  if (`${String(doc.level).toLowerCase()}.json` !== file) {
    errors.push({ code: 'ID_MISMATCH', path: file, message: `檔名 ${file} 與檔內 level ${doc.level} 不符` });
  }
});

for (const e of errors) console.error(`${e.code}\t${e.path}\t${e.message}`);
console.log(`檢查 ${levelFiles.length} 個級距檔：${errors.length ? `${errors.length} 個錯誤` : '全綠'}`);
process.exitCode = errors.length ? 1 : 0;
