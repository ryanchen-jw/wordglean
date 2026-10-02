// 英文用字的級距查找：分詞、縮寫展開、多字詞整段比對、ECDICT 詞形還原。

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CEFR_ORDER } from './lexicon.mjs';

// 縮寫後綴 → 要檢查的字（null＝不檢：'s 可為 is／has／所有格，'d 可為 would／had）。
const CONTRACTION_SUFFIXES = [
  ["n't", 'not'],
  ["'m", 'am'],
  ["'re", 'are'],
  ["'ll", 'will'],
  ["'ve", 'have'],
  ["'s", null],
  ["'d", null],
];
const IRREGULAR_NEGATIVES = new Map([
  ["can't", 'can'],
  ["won't", 'will'],
  ["shan't", 'shall'],
]);

// 把文字切成要查級距的字（保留原大小寫）。
export function tokenize(text) {
  const words = [];
  // \p{L}：含 é 等重音字母（café 不可被切成 caf）。
  const raw = text.replaceAll('’', "'").match(/\p{L}+(?:'\p{L}+)*/gu) ?? [];
  for (const token of raw) {
    const lower = token.toLowerCase();
    if (IRREGULAR_NEGATIVES.has(lower)) {
      words.push(IRREGULAR_NEGATIVES.get(lower), 'not');
      continue;
    }
    const suffix = CONTRACTION_SUFFIXES.find(([s]) => lower.endsWith(s) && lower.length > s.length);
    if (suffix) {
      words.push(token.slice(0, token.length - suffix[0].length));
      if (suffix[1]) words.push(suffix[1]);
    } else {
      words.push(token);
    }
  }
  return words;
}

// 多字詞（lexicon 中含空格的 headword，例：according to）：整段比對、取其級距，並從文字中移除。
// 含「.」或「-」的 headword（Mr.、Mrs.、Ms.、a.m.、T-shirt）同樣整段比對——分詞器會把它們拆成 Mr、T＋shirt 而查無級距。
export function extractMultiwords(text, levels) {
  const phrases = [...levels.keys()].filter((w) => /[ .-]/.test(w)).sort((a, b) => b.length - a.length);
  const found = [];
  let rest = text;
  for (const phrase of phrases) {
    // 含「-」的 headword 允許複數 s（T-shirts）
    const plural = phrase.includes('-') && /[a-z]$/.test(phrase) ? 's?' : '';
    const pattern = new RegExp(`(?<![A-Za-z'])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${plural}(?![A-Za-z'])`, 'gi');
    rest = rest.replace(pattern, () => {
      found.push(phrase);
      return ' ';
    });
  }
  return { phrases: found, rest };
}

const rank = (level) => CEFR_ORDER.indexOf(level);

// 規則還原（只在 lexicon 與 ECDICT 詞形表都查不到時才用）：美式拼法 traveled／canceling（單子音不重複）、
// 以及其他規則變化。候選原形必須是 lexicon 中有級距的字才算數。
export function ruleLemmas(word) {
  const out = [];
  // -ieth／-th：序數（twentieth→twenty、tenth→ten），lexicon 只收基數。
  for (const [suffix, repl] of [['ieth', 'y'], ['th', ''], ['ied', 'y'], ['ies', 'y'], ['ed', ''], ['ed', 'e'], ['ing', ''], ['ing', 'e'], ['es', ''], ['s', '']]) {
    if (word.length > suffix.length + 2 && word.endsWith(suffix)) out.push(word.slice(0, -suffix.length) + repl);
  }
  return out;
}

// 一個字的級距：本身（小寫、去重音）與詞形原形中最低的級。無級距回傳 null。
// 本身有級距也要看原形：found 是動詞「創立」（B2），也是 find（A1）的過去式。
export function wordLevel(word, levels, lemmas) {
  const lower = word.toLowerCase();
  const plain = lower.normalize('NFD').replace(/\p{M}/gu, '');
  let best = null;
  const pick = (candidates) => {
    for (const candidate of new Set(candidates)) {
      const level = levels.get(candidate.toLowerCase());
      if (level && (best === null || rank(level) < rank(best))) best = level;
    }
  };
  pick([lower, plain, ...lemmas(lower), ...lemmas(plain)]);
  if (best === null) pick(ruleLemmas(plain));
  // 複合字的不規則變化（grandchildren、firemen）：ECDICT 詞形表只收單字（children→child），
  // 拆出字尾查詞形表、換回原形再查（grand＋child）。字尾至少 3 個字母。
  if (best === null) {
    for (let i = 1; i <= plain.length - 3; i++) {
      pick(lemmas(plain.slice(i)).map((lemma) => plain.slice(0, i) + lemma));
    }
  }
  return best;
}

// 讀 data/dict 切片的 f 欄（變化形 → 原形），依 manifest 規則找切片並快取。
export function createDictLemmas(dictDir) {
  const manifest = JSON.parse(readFileSync(join(dictDir, 'manifest.json'), 'utf8'));
  const lengths = [...manifest.prefixLengths].sort((a, b) => b - a);
  const cache = new Map();
  const shardKey = (word) => {
    for (const n of lengths) {
      const key = [...word.slice(0, n).padEnd(n, '_')].map((c) => (c >= 'a' && c <= 'z' ? c : '_')).join('');
      if (manifest.shards[key]) return key;
    }
    return null;
  };
  return (word) => {
    const key = shardKey(word);
    if (!key) return [];
    if (!cache.has(key)) cache.set(key, JSON.parse(readFileSync(join(dictDir, manifest.shards[key]), 'utf8')));
    return cache.get(key).f[word] ?? [];
  };
}
