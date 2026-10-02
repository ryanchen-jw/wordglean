// 用法：node scripts/build-placement.mjs [--lexicon <file>] [--dict <data/dict 目錄>] [--out <file>]
// 產生分級測驗題本 placement/placement.json（各級候選真字＋假字池）。輸出位元組可重現。

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { buildPlacement, loadDictWords } from './lib/placement.mjs';

const contentRoot = fileURLToPath(new URL('..', import.meta.url));
const { values } = parseArgs({
  options: {
    lexicon: { type: 'string', default: resolve(contentRoot, '../data/lexicon/lexicon.json') },
    dict: { type: 'string', default: resolve(contentRoot, '../data/dict') },
    out: { type: 'string', default: resolve(contentRoot, 'placement/placement.json') },
  },
});

const lexicon = JSON.parse(readFileSync(values.lexicon, 'utf8'));
const placement = buildPlacement(lexicon, loadDictWords(values.dict));

// 字串陣列放同一行，其餘照 JSON.stringify 兩格縮排
const text =
  JSON.stringify(placement, null, 2).replace(
    /\[\s+("[^\]]*?")\s+\]/g,
    (_, items) => `[${items.replace(/,\s+/g, ', ')}]`,
  ) + '\n';

mkdirSync(dirname(values.out), { recursive: true });
writeFileSync(values.out, text);
console.log(`產生題本：A1–C1 各 ${placement.levels.A1.length} 個真字、${placement.pseudowords.length} 個假字`);
