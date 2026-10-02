// 分級測驗題本（TASK-17）：各級候選真字＋假字池。App 每次測驗各級抽 10 個真字、抽 10 個假字。
// 真字級距規則同課綱：小寫 headword 的級距＝各詞性最低的 CEFR 級。

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { headwordInfo } from './lexicon.mjs';
import { OFFENSIVE_WORDS } from './offensive.mjs';
import { generatePseudowords, rng, segment } from './pseudoword.mjs';

export const PLACEMENT_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const REAL_PER_LEVEL_POOL = 30;
export const PSEUDO_POOL = 200;
export const REAL_PER_FORM = 10;
export const PSEUDO_PER_FORM = 10;
const SEED_REAL = 'task17-real-v1';
const SEED_PSEUDO = 'task17-pseudo-v1';

/** ECDICT 切片（data/dict）的詞條與詞形，小寫 */
export function loadDictWords(dictDir) {
  const read = (name) => JSON.parse(readFileSync(join(dictDir, name), 'utf8'));
  const words = new Set();
  for (const file of Object.values(read('manifest.json').shards)) {
    const shard = read(file);
    for (const w of Object.keys(shard.e)) words.add(w.toLowerCase());
    for (const w of Object.keys(shard.f)) words.add(w.toLowerCase());
  }
  return words;
}

/** 產生器的輸入：語料＝lexicon 純字母小寫字；範本＝A1–B2 的 5–9 字母、2–3 音節字；避開＝lexicon＋ECDICT 切片 */
export function pseudowordInputs(lexicon, dictWords) {
  const lower = [...new Set(lexicon.map((e) => e.headword.toLowerCase()))];
  const corpus = lower.filter((w) => /^[a-z]+$/.test(w));
  const info = headwordInfo(lexicon);
  const templates = corpus.filter((w) => {
    const level = info.get(w)?.level;
    const n = segment(w).length;
    return ['A1', 'A2', 'B1', 'B2'].includes(level) && /^[a-z]{5,9}$/.test(w) && n >= 2 && n <= 3;
  });
  return { corpus, templates, real: new Set([...lower, ...dictWords]) };
}

// 功能詞（任一詞性屬之即排除）：冠詞／限定詞、介系詞、代名詞、連接詞、助動詞——人人都認得，鑑別力低
const FUNCTION_POS = ['det', 'prep', 'pron', 'conj', 'aux'];

// 某級的候選真字：小寫有出現過（排除只以大寫出現的專有名詞）、純字母 4–12 字母、非功能詞、不在冒犯字名單（offensive.mjs）；
// 依詞頻名次排序（無名次排最後）後切成 n 層，每層抽 1 個
function sampleLevel(lexicon, info, level, n, random) {
  const lowercaseHeadwords = new Set(lexicon.filter((e) => e.headword === e.headword.toLowerCase()).map((e) => e.headword));
  const functionWords = new Set(
    lexicon.filter((e) => FUNCTION_POS.includes(e.pos)).map((e) => e.headword.toLowerCase()),
  );
  const words = [...info]
    .filter(
      ([w, i]) =>
        i.level === level &&
        lowercaseHeadwords.has(w) &&
        !functionWords.has(w) &&
        !OFFENSIVE_WORDS.includes(w) &&
        /^[a-z]{4,12}$/.test(w),
    )
    .sort(([wa, a], [wb, b]) => (a.freqRank ?? Infinity) - (b.freqRank ?? Infinity) || (wa < wb ? -1 : 1))
    .map(([w]) => w);
  const picked = [];
  for (let k = 0; k < n; k++) {
    const start = Math.floor((k * words.length) / n);
    const end = Math.floor(((k + 1) * words.length) / n);
    picked.push(words[start + Math.floor(random() * (end - start))]);
  }
  return picked;
}

export function buildPlacement(lexicon, dictWords) {
  const info = headwordInfo(lexicon);
  const random = rng(SEED_REAL);
  const levels = Object.fromEntries(
    PLACEMENT_LEVELS.map((level) => [level, sampleLevel(lexicon, info, level, REAL_PER_LEVEL_POOL, random)]),
  );
  const pseudowords = generatePseudowords({
    ...pseudowordInputs(lexicon, dictWords),
    seed: SEED_PSEUDO,
    count: PSEUDO_POOL,
  });
  return {
    schemaVersion: 1,
    realPerForm: REAL_PER_FORM,
    pseudoPerForm: PSEUDO_PER_FORM,
    levels,
    pseudowords,
  };
}
