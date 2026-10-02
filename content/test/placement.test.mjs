// TASK-17 分級測驗題本（content/placement/placement.json）。級距真值直接從 lexicon 原始欄位算，不用 lib/lexicon.mjs。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildPlacement, loadDictWords } from '../scripts/lib/placement.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const lexicon = read('../../data/lexicon/lexicon.json');
const placement = read('../placement/placement.json');

const ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const lowest = new Map();
for (const e of lexicon) {
  if (!ORDER.includes(e.cefr)) continue;
  const w = e.headword.toLowerCase();
  if (!lowest.has(w) || ORDER.indexOf(e.cefr) < ORDER.indexOf(lowest.get(w))) lowest.set(w, e.cefr);
}

test('題本結構：A1–C1 各 30 個不重複真字、200 個不重複假字、每次抽 10＋10', () => {
  assert.equal(placement.schemaVersion, 1);
  assert.equal(placement.realPerForm, 10);
  assert.equal(placement.pseudoPerForm, 10);
  assert.deepEqual(Object.keys(placement.levels), ['A1', 'A2', 'B1', 'B2', 'C1']);
  for (const words of Object.values(placement.levels)) {
    assert.equal(words.length, 30);
    assert.equal(new Set(words).size, 30);
  }
  assert.equal(placement.pseudowords.length, 200);
  assert.equal(new Set(placement.pseudowords).size, 200);
});

test('真字的級距＝lexicon 中該字各詞性最低級，且有小寫寫法（非專有名詞）', () => {
  const lowerHeadwords = new Set(lexicon.map((e) => e.headword));
  const wrong = [];
  for (const [level, words] of Object.entries(placement.levels)) {
    for (const w of words) {
      if (lowest.get(w) !== level || !lowerHeadwords.has(w)) wrong.push(`${level}:${w}`);
    }
  }
  assert.deepEqual(wrong, []);
});

test('真字池排除 ≤3 字母的字與功能詞（任一詞性為冠詞／限定詞、介系詞、代名詞、連接詞、助動詞）', () => {
  const functionWords = new Set(
    lexicon.filter((e) => ['det', 'prep', 'pron', 'conj', 'aux'].includes(e.pos)).map((e) => e.headword.toLowerCase()),
  );
  const bad = Object.values(placement.levels)
    .flat()
    .filter((w) => w.length <= 3 || functionWords.has(w));
  assert.deepEqual(bad, []);
});

test('真字池排除冒犯／粗俗字（執行長點名 bloody、idiot、raunchy 必在名單內，題本與名單無交集）', async () => {
  const { OFFENSIVE_WORDS } = await import('../scripts/lib/offensive.mjs');
  for (const w of ['bloody', 'idiot', 'raunchy']) assert.ok(OFFENSIVE_WORDS.includes(w), w);
  const hits = Object.values(placement.levels)
    .flat()
    .filter((w) => OFFENSIVE_WORDS.includes(w));
  assert.deepEqual(hits, []);
});

test('已提交的假字池（200 個）無一在 lexicon 或 ECDICT 切片中', () => {
  const lex = new Set(lexicon.map((e) => e.headword.toLowerCase()));
  const dict = loadDictWords(fileURLToPath(new URL('../../data/dict', import.meta.url)));
  assert.deepEqual(
    placement.pseudowords.filter((w) => lex.has(w) || dict.has(w)),
    [],
  );
});

test('已提交的題本＝產生器現在的產出（改了 lexicon 或產生器就要重跑 build-placement）', () => {
  const dict = loadDictWords(fileURLToPath(new URL('../../data/dict', import.meta.url)));
  assert.deepEqual(buildPlacement(lexicon, dict), placement);
});
