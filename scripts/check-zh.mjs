// 介面文案用語檢查 CLI（TASK-4 AC#2）。
// 用法（scripts/ 下）：node check-zh.mjs <copy-table.json 或 zh-TW.json> [...更多檔案]
// 有違規 exit 1，全部通過 exit 0。
import { readFileSync } from 'node:fs';
import { checkZhUi, collectStrings } from './zh-ui-guard.mjs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('用法：node check-zh.mjs <copy-table.json 或 zh-TW.json> [...]');
  process.exit(2);
}

let total = 0;
let skipped = 0;
const failures = [];
for (const file of files) {
  for (const [key, text] of collectStrings(JSON.parse(readFileSync(file, 'utf8')))) {
    total += 1;
    if (!/\p{Script=Han}/u.test(text)) skipped += 1;
    for (const e of checkZhUi(text)) failures.push(`${file}  ${key}  [${e.code}] ${e.message}\n    原文：${text}`);
  }
}

console.log(`檢查 ${total} 條（不含中文略過 ${skipped} 條）`);
if (failures.length) {
  console.log(`✗ ${failures.length} 個問題：`);
  for (const f of failures) console.log(`  ${f}`);
  process.exit(1);
}
console.log('✓ 無簡體字、無大陸用語、opencc 反查無差異');
