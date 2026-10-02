// 假字產生器（TASK-17 分級測驗）。方法參考 Wuggy（Keuleers & Brysbaert, 2010, Behavior Research Methods
// 42(3), 627–633, doi:10.3758/BRM.42.3.627）：把字切成音節內的開頭（onset）、母音（nucleus）、結尾（coda）三段，
// 依段與段之間在真字語料中出現過的轉移替換範本字的段。本檔是拼寫層的簡化版、自己實作；
// 不使用 Wuggy 的程式碼與語言資料（英文資料無授權），也不使用原版 GPL Wuggy。

import { OFFENSIVE_SUBSTRINGS } from './offensive.mjs';

// 拼寫上合法的字首子音串（最大開頭原則用）：單一子音字母＋常見子音群
const ONSETS = new Set([
  ...'bcdfghjklmnpqrstvwxyz',
  ...['bl', 'br', 'ch', 'cl', 'cr', 'dr', 'dw', 'fl', 'fr', 'gl', 'gn', 'gr', 'kn', 'ph', 'phr', 'pl', 'pr'],
  ...['qu', 'sc', 'sch', 'scr', 'sh', 'shr', 'sk', 'sl', 'sm', 'sn', 'sp', 'spl', 'spr', 'squ', 'st', 'str'],
  ...['sw', 'th', 'thr', 'tr', 'tw', 'wh', 'wr'],
]);

const VOWELS = new Set('aeiou');

// 第 i 個字母是否當母音：y 在字首或接在母音後當子音；qu 的 u 當子音
function isVowel(word, i) {
  const ch = word[i];
  if (ch === 'y') return i > 0 && !isVowel(word, i - 1);
  if (ch === 'u' && word[i - 1] === 'q') return false;
  return VOWELS.has(ch);
}

/** 切成音節陣列 [{ o, n, c }]；沒有母音的字回傳 [] */
export function segment(word) {
  const runs = []; // 交替的子音串／母音串
  for (let i = 0; i < word.length; i++) {
    const vowel = isVowel(word, i);
    const last = runs.at(-1);
    if (last && last.vowel === vowel) last.text += word[i];
    else runs.push({ vowel, text: word[i] });
  }
  const nuclei = runs.filter((r) => r.vowel).length;
  if (nuclei === 0) return [];

  const syllables = [];
  let onset = runs[0].vowel ? '' : runs.shift().text;
  while (runs.length) {
    const n = runs.shift().text;
    const cons = runs.length && !runs[0].vowel ? runs.shift().text : '';
    if (!runs.length) {
      syllables.push({ o: onset, n, c: cons });
      break;
    }
    // 兩個母音之間的子音串：取最長的合法字首子音串給下一音節，其餘當本音節結尾
    let split = cons.length;
    for (let k = 0; k < cons.length; k++) {
      if (ONSETS.has(cons.slice(k))) {
        split = k;
        break;
      }
    }
    syllables.push({ o: onset, n, c: cons.slice(0, split) });
    onset = cons.slice(split);
  }

  // 字尾「子音＋e」且前面還有音節：e 不發音，併入前一音節的結尾
  const last = syllables.at(-1);
  if (syllables.length > 1 && last.n === 'e' && last.c === '' && last.o !== '') {
    syllables.pop();
    syllables.at(-1).c += `${last.o}e`;
  }
  return syllables;
}

// 段序列：每段帶槽位（角色 O/N/C × 音節位置 m 單音節／f 首／i 中／l 尾）
function slots(syllables) {
  const segs = [];
  syllables.forEach((s, i) => {
    const pos = syllables.length === 1 ? 'm' : i === 0 ? 'f' : i === syllables.length - 1 ? 'l' : 'i';
    segs.push({ slot: `O${pos}`, text: s.o }, { slot: `N${pos}`, text: s.n }, { slot: `C${pos}`, text: s.c });
  });
  return segs;
}

// 轉移表：`${槽位}|${前一段}` → Map(段 → 次數)
function buildTransitions(corpus) {
  const table = new Map();
  for (const word of corpus) {
    let prev = '^';
    for (const { slot, text } of slots(segment(word))) {
      const key = `${slot}|${prev}`;
      if (!table.has(key)) table.set(key, new Map());
      const next = table.get(key);
      next.set(text, (next.get(text) ?? 0) + 1);
      prev = text;
    }
  }
  return table;
}

// 固定種子亂數（FNV-1a 雜湊 → mulberry32）
export function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates，就地打散並回傳同一陣列 */
export function shuffle(items, random) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function weightedPick(entries, random) {
  const total = entries.reduce((s, [, n]) => s + n, 0);
  let r = random() * total;
  for (const [text, n] of entries) {
    r -= n;
    if (r < 0) return text;
  }
  return entries.at(-1)[0];
}

// 編輯距離 1 的所有字串（刪、插、換、相鄰對調）
function neighbors(word) {
  const out = [];
  const abc = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i <= word.length; i++) {
    const head = word.slice(0, i);
    const tail = word.slice(i);
    if (tail) out.push(head + tail.slice(1));
    if (tail.length > 1) out.push(head + tail[1] + tail[0] + tail.slice(2));
    for (const ch of abc) {
      out.push(head + ch + tail);
      if (tail) out.push(head + ch + tail.slice(1));
    }
  }
  return out;
}


// 編輯距離（OSA）是否 ≤ 2；逐列最小值超過 2 即提早結束
function withinTwo(a, b) {
  if (Math.abs(a.length - b.length) > 2) return false;
  let prev2 = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let min = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      row.push(v);
      min = Math.min(min, v);
    }
    if (min > 2) return false;
    prev2 = prev;
    prev = row;
  }
  return prev[b.length] <= 2;
}

// 可唸性：連續 3 個以上子音字母（y 視為母音）的組合，至少要在這麼多個語料字中出現過
const MIN_CLUSTER_WORDS = 20;
const CLUSTER = /[^aeiouy]{3,}/g;

/**
 * 假字過濾器：回傳擋下的理由，通過則為 null。
 * format＝非 4–9 個小寫字母或有三連同字母；real＝是真字；near-real＝與真字差一個字母（常見拼錯型）；
 * offensive＝含不雅字串；hard＝含語料中罕見的子音串（難唸）；
 * familiar＝與 6 字母以上的語料字差兩個字母以內（長字改兩個字母仍認得出原字）
 */
export function pseudowordFilter({ corpus, real }) {
  const familiar = corpus.filter((w) => w.length >= 6);
  const clusters = new Map();
  for (const w of corpus)
    for (const run of w.match(CLUSTER) ?? []) clusters.set(run, (clusters.get(run) ?? 0) + 1);
  return (word) => {
    if (!/^[a-z]{4,9}$/.test(word) || /(.)\1\1/.test(word)) return 'format';
    if (real.has(word)) return 'real';
    if (neighbors(word).some((n) => real.has(n))) return 'near-real';
    if (OFFENSIVE_SUBSTRINGS.some((bad) => word.includes(bad))) return 'offensive';
    if ((word.match(CLUSTER) ?? []).some((run) => (clusters.get(run) ?? 0) < MIN_CLUSTER_WORDS))
      return 'hard';
    if (familiar.some((w) => withinTwo(word, w))) return 'familiar';
    return null;
  };
}

/**
 * 產生 count 個不重複假字。
 * corpus：建轉移表的真字（小寫）；templates：範本真字；real：要避開的真字集合；過濾規則見 pseudowordFilter
 */
export function generatePseudowords({ corpus, templates, real, seed, count }) {
  const random = rng(seed);
  const table = buildTransitions(corpus);
  const reject = pseudowordFilter({ corpus, real });
  const legal = (slot, prev, text) => table.get(`${slot}|${prev}`)?.has(text) ?? false;
  const out = new Set();
  for (let attempt = 0; out.size < count; attempt++) {
    if (attempt > count * 2000) throw new Error(`假字產生失敗：只產出 ${out.size}／${count}`);
    const template = templates[Math.floor(random() * templates.length)];
    const syllables = segment(template);
    const segs = slots(syllables);
    // 換掉約一半的非空段（至少 2 段），避免長字只換一兩段仍像原字
    const filled = segs.filter((s) => s.text).length;
    const want = Math.max(2, Math.ceil(filled / 2));
    const order = shuffle(
      segs.map((_, i) => i),
      random,
    );
    let changed = 0;
    for (const i of order) {
      if (changed === want) break;
      const prev = i === 0 ? '^' : segs[i - 1].text;
      const next = segs[i + 1];
      const options = [...(table.get(`${segs[i].slot}|${prev}`) ?? [])].filter(
        ([text]) => text !== segs[i].text && (!next || legal(next.slot, text, next.text)),
      );
      if (!options.length) continue;
      segs[i] = { ...segs[i], text: weightedPick(options, random) };
      changed++;
    }
    if (changed < want) continue;
    const word = segs.map((s) => s.text).join('');
    // 重新切段後音節數須與範本相同（母音段相連時會併成一個音節）
    if (!out.has(word) && segment(word).length === syllables.length && reject(word) === null)
      out.add(word);
  }
  return [...out];
}
