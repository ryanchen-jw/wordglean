// TASK-17 假字產生器（AC#1）。真值來源與產生器分開：lexicon 與 ECDICT 切片在本檔直接讀檔建集合，
// 編輯距離用本檔自己的動態規劃暴力比對，不用產生器的鄰居展開。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generatePseudowords, pseudowordFilter, segment } from '../scripts/lib/pseudoword.mjs';
import { pseudowordInputs } from '../scripts/lib/placement.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const lexicon = read('../../data/lexicon/lexicon.json');
const manifest = read('../../data/dict/manifest.json');

const lexiconWords = new Set(lexicon.map((e) => e.headword.toLowerCase()));
const ecdictWords = new Set();
for (const file of Object.values(manifest.shards)) {
  const shard = read(`../../data/dict/${file}`);
  for (const w of Object.keys(shard.e)) ecdictWords.add(w.toLowerCase());
  for (const w of Object.keys(shard.f)) ecdictWords.add(w.toLowerCase());
}

// Damerau–Levenshtein（OSA）距離，暴力 DP
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

const syl = (word) => segment(word).map(({ o, n, c }) => `${o}.${n}.${c}`);

test('切段：最大開頭原則、y 與不發音 e、qu（手標例子）', () => {
  assert.deepEqual(syl('budget'), ['b.u.d', 'g.e.t']);
  assert.deepEqual(syl('happy'), ['h.a.p', 'p.y.']);
  assert.deepEqual(syl('invoice'), ['.i.n', 'v.oi.ce']);
  assert.deepEqual(syl('make'), ['m.a.ke']);
  assert.deepEqual(syl('the'), ['th.e.']);
  assert.deepEqual(syl('yes'), ['y.e.s']);
  assert.deepEqual(syl('player'), ['pl.a.', 'y.e.r']);
  assert.deepEqual(syl('queen'), ['qu.ee.n']);
  assert.deepEqual(syl('reluctant'), ['r.e.', 'l.u.c', 't.a.nt']);
});

const inputs = pseudowordInputs(lexicon, ecdictWords);
const sample = generatePseudowords({ ...inputs, seed: 'ac1-sample', count: 200 });

test('AC#1：抽 200 個假字，無一在 lexicon／ECDICT（切片詞條＋詞形）', () => {
  assert.equal(sample.length, 200);
  assert.equal(new Set(sample).size, 200, '不重複');
  const hits = sample.filter((w) => lexiconWords.has(w) || ecdictWords.has(w));
  assert.deepEqual(hits, []);
});

test('假字格式：純小寫字母、4–9 字母、無三連同字母', () => {
  for (const w of sample) {
    assert.match(w, /^[a-z]{4,9}$/, w);
    assert.doesNotMatch(w, /(.)\1\1/, w);
  }
});

test('不是常見拼錯：與 lexicon 字距離 ≥ 2，與 6 字母以上的 lexicon 字距離 ≥ 3', () => {
  const near = [];
  for (const w of sample) {
    for (const real of lexiconWords) {
      if (Math.abs(real.length - w.length) > 2) continue;
      const min = /^[a-z]{6,}$/.test(real) ? 3 : 2;
      if (distance(w, real) < min) near.push(`${w}~${real}`);
    }
  }
  assert.deepEqual(near, []);
});

// 直接對過濾器餵「已知必須擋掉」的候選（P2-1：只看產出樣本時，拿掉某道過濾仍可能恰好 0 命中而假綠）
const reject = pseudowordFilter(inputs);
const pickEvery = (list, n) => list.filter((_, i) => i % Math.floor(list.length / n) === 0).slice(0, n);

test('過濾器：lexicon 真字一律以 real 擋下', () => {
  const words = pickEvery(
    [...lexiconWords].filter((w) => /^[a-z]{4,9}$/.test(w) && !/(.)\1\1/.test(w)).sort(),
    200,
  );
  assert.equal(words.length, 200);
  assert.deepEqual(words.filter((w) => reject(w) !== 'real'), []);
});

test('過濾器：只在 ECDICT（不在 lexicon）的字一律以 real 擋下', () => {
  const words = pickEvery(
    // 三連同字母（如 aaah）先被 format 擋下，不列入
    [...ecdictWords]
      .filter((w) => /^[a-z]{4,9}$/.test(w) && !/(.)\1\1/.test(w) && !lexiconWords.has(w))
      .sort(),
    200,
  );
  assert.equal(words.length, 200);
  assert.deepEqual(words.filter((w) => reject(w) !== 'real'), []);
});

test('過濾器：與真字差一個字母（常見拼錯型）以 near-real 擋下', () => {
  // 手寫例：各差一個字母（刪、插、換、對調）且本身不在字典
  for (const w of ['tabel', 'freind', 'recieve', 'beautful', 'smilee']) {
    if (lexiconWords.has(w) || ecdictWords.has(w)) continue;
    assert.equal(reject(w), 'near-real', w);
  }
});

// P2-2 可唸性：連續 3 個以上子音字母（y 視為母音）的組合，須在 lexicon 至少 20 個字出現過
const runCounts = new Map();
for (const w of lexiconWords)
  for (const run of w.match(/[^aeiouy]{3,}/g) ?? []) runCounts.set(run, (runCounts.get(run) ?? 0) + 1);

test('可唸性：評審點名的難唸假字（eduptcy、upightnin、awsponker）以 hard 擋下', () => {
  for (const w of ['eduptcy', 'upightnin', 'awsponker']) assert.equal(reject(w), 'hard', w);
});

test('可唸性：樣本中 3 個以上的連續子音組合都在 lexicon 至少 20 個字出現過', () => {
  const rare = sample.flatMap((w) =>
    (w.match(/[^aeiouy]{3,}/g) ?? []).filter((run) => (runCounts.get(run) ?? 0) < 20).map((run) => `${w}:${run}`),
  );
  assert.deepEqual(rare, []);
});

test('同種子位元組可重現、不同種子結果不同', () => {
  assert.deepEqual(generatePseudowords({ ...inputs, seed: 'ac1-sample', count: 200 }), sample);
  assert.notDeepEqual(generatePseudowords({ ...inputs, seed: 'other', count: 200 }), sample);
});
