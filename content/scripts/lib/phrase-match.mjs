// 片語比對（TASK-24 片語課）：詞形變化＋可分離片語。規則（寫進 content/CLAUDE.md「片語比對」）：
//   ① 逐字比對，不跨子句：遇 . , ; : ! ? 引號、括號就斷開。
//   ② 每個成分都接受詞形變化：ECDICT 詞形表（gave→give）或規則還原（looking→look）的原形＝成分即算；
//      小品詞、介系詞沒有變化形，實際上就是比原字（give in 不會對到 give up）。
//   ③ 片語裡的 your／one's 代表「任一所有格」（do your best ↔ did my best）；冠詞照原字（a 不等於 an、the）。
//   ④ 可分離片語（separable：true）：第 1 個成分後可插入 1–MAX_GAP 個字當受詞（pick it up、turn the light on），
//      其餘成分要接連出現。不可分離的片語一律接連出現。
//   ⑤ 不收插入形容詞或省略冠詞（made an important decision、take photos 都不算 take a photo／make a decision）。

import { ruleLemmas } from './english.mjs';

export const MAX_GAP = 3;
const POSSESSIVES = new Set('my your his her its our their'.split(' '));

// 文字 → 子句陣列，每個子句＝[{ w: 小寫字, start, end }]（start／end＝原文字元位置）。
export function clauses(text) {
  const out = [[]];
  for (const m of text.replaceAll('’', "'").matchAll(/[A-Za-z]+(?:'[A-Za-z]+)*|[.,;:!?"“”()]/g)) {
    if (/^[A-Za-z]/.test(m[0])) out.at(-1).push({ w: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length });
    else if (out.at(-1).length) out.push([]);
  }
  return out.filter((c) => c.length);
}

// 一個字可對到的原形（含自己）；依 lemmas 函式快取（同一份詞形表）。
const formCache = new WeakMap();
function formsOf(word, lemmas) {
  if (!formCache.has(lemmas)) formCache.set(lemmas, new Map());
  const cache = formCache.get(lemmas);
  if (!cache.has(word)) cache.set(word, new Set([word, ...lemmas(word), ...ruleLemmas(word)]));
  return cache.get(word);
}

const isSlot = (part) => part === 'your' || part === "one's";

function matchesPart(word, part, lemmas) {
  if (word === part) return true;
  if (isSlot(part)) return POSSESSIVES.has(word);
  return formsOf(word, lemmas).has(part);
}

// 在 text 裡找 phrase，回傳每處符合的成分字 [{ start, end }]（只含片語本身的字，不含插入的受詞）。
export function findPhrase(text, phrase, { lemmas, separable = false }) {
  const parts = phrase.toLowerCase().split(/\s+/);
  const hits = [];
  for (const toks of clauses(text)) {
    for (let i = 0; i < toks.length; i++) {
      if (!matchesPart(toks[i].w, parts[0], lemmas)) continue;
      const gaps = separable && parts.length > 1 ? [0, ...Array.from({ length: MAX_GAP }, (_, g) => g + 1)] : [0];
      for (const gap of gaps) {
        const rest = parts.slice(1).map((p, k) => toks[i + 1 + gap + k]);
        if (rest.every((t, k) => t && matchesPart(t.w, parts[k + 1], lemmas))) {
          hits.push([toks[i], ...rest].map(({ start, end }) => ({ start, end })));
          break;
        }
      }
    }
  }
  return hits;
}

export const hasPhrase = (text, phrase, opts) => findPhrase(text, phrase, opts).length > 0;

// 整個字串恰為片語的一個詞形（不分離）：mcq 正解要填整個片語用。
export function isPhraseForm(text, phrase, { lemmas }) {
  const cs = clauses(text);
  if (cs.length !== 1 || cs[0].length !== phrase.trim().split(/\s+/).length) return false;
  return findPhrase(text, phrase, { lemmas }).length > 0;
}

// 把文字中的片語挖掉（長的先比），回傳 { phrases: 找到的片語, rest: 剩下的文字 }。entries＝[{ phrase, separable }]。
export function extractPhrases(text, entries, { lemmas }) {
  const sorted = [...entries].sort((a, b) => b.phrase.length - a.phrase.length);
  const found = [];
  let rest = text;
  // 預篩：片語每個成分（所有格位置除外）都要對得到文字裡某個字的原形，才逐字比對
  const forms = new Set(clauses(text).flat().flatMap(({ w }) => [...formsOf(w, lemmas)]));
  for (const { phrase, separable } of sorted) {
    if (!phrase.split(/\s+/).every((p) => isSlot(p) || forms.has(p))) continue;
    for (const spans of findPhrase(rest, phrase, { lemmas, separable })) {
      found.push(phrase);
      for (const { start, end } of spans) rest = rest.slice(0, start) + ' '.repeat(end - start) + rest.slice(end);
    }
  }
  return { phrases: found, rest };
}
