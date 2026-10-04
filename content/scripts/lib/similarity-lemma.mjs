// 單字卡例句與同課情境句的雷同自查（TASK-9 執行長裁示 §11.4）。
// 做法：去功能字 → 詞形還原（ECDICT 詞形表，查不到再用規則還原）→ 去掉該卡的目標字 →
// 共同實詞數 ÷ 兩句實詞數的較小者。比率只是篩選，≥門檻的句對要人工確認「主詞、情境、句型至少換兩項」。

import { ruleLemmas } from './english.mjs';

export const STOPWORDS = new Set(
  ('a an the and or but so to of in on at for with from by as is are was were be been being am do does did have has had ' +
    'will would can could should may might must shall i you he she it we they me him her us them my your his its our their ' +
    'this that these those there here what which who whom when where why how not no very too also just only all some any more ' +
    "most many much than then if because about into out up down over after before again let let's it's i'm don't can't won't " +
    "didn't doesn't isn't aren't wasn't weren't i'll we'll you're they're").split(/\s+/),
);

// 一個字的原形：ECDICT 詞形表的第一個原形；查不到就試規則還原中 lexicon 有收的；都沒有就用原字。
export function lemmatize(word, { lemmas, levels }) {
  const w = word.toLowerCase();
  const fromDict = lemmas(w);
  if (fromDict.length) return fromDict[0];
  if (levels.has(w)) return w;
  return ruleLemmas(w).find((c) => levels.has(c)) ?? w;
}

export function contentLemmas(text, ctx, exclude = []) {
  const skip = new Set(exclude.flatMap((e) => e.toLowerCase().split(/[\s-]+/)));
  const toks = text.toLowerCase().replaceAll('’', "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
  const out = new Set();
  for (const t of toks) {
    if (STOPWORDS.has(t)) continue;
    const l = lemmatize(t, ctx);
    if (!STOPWORDS.has(l) && !skip.has(l) && !skip.has(t)) out.add(l);
  }
  return [...out];
}

// 回傳 { ratio, shared }；任一句扣除目標字後沒有實詞時 ratio＝0。
export function overlap(a, b, ctx, exclude = []) {
  const x = contentLemmas(a, ctx, exclude);
  const y = contentLemmas(b, ctx, exclude);
  const shared = x.filter((w) => y.includes(w));
  const denom = Math.min(x.length, y.length);
  return { ratio: denom ? shared.length / denom : 0, shared };
}

// 同課要和單字卡比對的句子：聽打、聽選音檔、跟讀、mcq 題幹（填入正解）、閱讀各句、翻譯與造句參考答案。
export function lessonSentences(doc) {
  const out = [];
  doc.items.forEach((it) => {
    const q = it.id.replace(/^.*-(q\d+)$/, '$1');
    if (it.type === 'listenType' || it.type === 'shadowing') out.push([`${q} ${it.type}`, it.sentenceEn]);
    if (it.type === 'listenChoice') out.push([`${q} listenChoice`, it.audioEn]);
    if (it.type === 'mcq') out.push([`${q} mcq`, it.stemEn.replace('____', it.options[it.answer])]);
    if (it.type === 'reading') it.passageEn.split(/(?<=[.!?]["”]?)\s+/).forEach((s, k) => out.push([`${q} reading#${k}`, s]));
    if (it.type === 'translate' || it.type === 'makeSentence') it.referenceEn.forEach((s, k) => out.push([`${q} ${it.type}#${k}`, s]));
  });
  return out;
}

// 每張單字卡 × 每個情境句，比率 ≥ threshold 的列出來。
export function similarPairs(doc, ctx, threshold = 0.4) {
  const sentences = lessonSentences(doc);
  const pairs = [];
  for (const card of doc.items.filter((it) => it.type === 'wordCard')) {
    for (const [where, s] of sentences) {
      const { ratio, shared } = overlap(card.exampleEn, s, ctx, [card.word]);
      if (ratio >= threshold) pairs.push({ word: card.word, card: card.exampleEn, where, sentence: s, ratio, shared });
    }
  }
  return pairs;
}

// 句型骨架（補字面重疊抓不到的「同主詞＋同句型、只換實詞」）：
//   [主詞類別, 目標字原形, 目標字後第一個詞的類別]
//   主詞類別＝句首（略過情態／助動詞與 please）第一個詞：代名詞 PRON、數量詞 QTY、限定詞 DET、其他 N；
//   後接類別＝代名詞或限定詞 NP、that＝THAT、數量詞 QTY、介系詞照原字（後接其他實詞或句尾不比對）。
// 例：I need to renew my passport ／ I am going to renew my driving license → [PRON, renew, NP] 相同。
const PRONOUNS = new Set('i you he she it we they'.split(' '));
const DETERMINERS = new Set('a an the this that these those my your his her its our their'.split(' '));
const QUANTITY = new Set('many most some all several few half every each one two three four five six seven eight nine ten twenty hundred thousand percent'.split(' '));
const SKIP_START = new Set("can could do does did will would should please don't can't couldn't didn't".split(' '));
// of 不列入：名詞＋of 太常見（a selection of、a layer of），只會產生噪音
const PREPOSITIONS = new Set('on in at to for from with about into by'.split(' '));
const classOf = (t) => (PRONOUNS.has(t) ? 'PRON' : QUANTITY.has(t) || /^\d/.test(t) ? 'QTY' : DETERMINERS.has(t) ? 'DET' : 'N');
const nextClass = (t) => (t === undefined ? 'END' : t === 'that' ? 'THAT' : PRONOUNS.has(t) || DETERMINERS.has(t) ? 'NP' : QUANTITY.has(t) || /^\d/.test(t) ? 'QTY' : PREPOSITIONS.has(t) ? t : 'W');

export function skeleton(text, target, ctx) {
  const toks = text.toLowerCase().replaceAll('’', "'").match(/[a-z0-9]+(?:'[a-z]+)?/g) ?? [];
  const t = target.toLowerCase().split(/\s+/)[0];
  const at = toks.findIndex((w) => w === t || lemmatize(w, ctx) === t);
  if (at < 0) return null;
  const start = toks.findIndex((w) => !SKIP_START.has(w));
  const next = nextClass(toks[at + 1]);
  // 後接一般實詞（W）或句尾太常見，不列入骨架比對，避免噪音
  if (next === 'W' || next === 'END') return null;
  return [classOf(toks[start]), t, next].join('|');
}

export function skeletonPairs(doc, ctx) {
  const sentences = lessonSentences(doc);
  const pairs = [];
  for (const card of doc.items.filter((it) => it.type === 'wordCard')) {
    const k = skeleton(card.exampleEn, card.word, ctx);
    if (!k) continue;
    for (const [where, s] of sentences) {
      if (skeleton(s, card.word, ctx) === k) pairs.push({ word: card.word, card: card.exampleEn, where, sentence: s, skeleton: k });
    }
  }
  return pairs;
}

// 翻譯題彼此雷同（創辦人裁示 2026-10-04 造句改翻譯，每課 2 題翻譯）：參考答案兩兩比對（各變體取最高）。
//   字面：共同實詞（不計兩題的提示字）÷ 較短句實詞 ≥ threshold——同課兩題、同單元跨課都比。
//         提示字只從分子扣、分母照算，避免一兩個實詞的短句被放大成 100%。
//         （提示字撞本課目標字由檢查器 TRANSLATE_HINT_DUP 另管。）
//   句型：實詞換成 X（連續合併）後的骨架相同——只比同課兩題（跨課的 A1 短句骨架天生常撞，只會產生噪音）。
// 回傳 [{ a, b, scope: 'lesson'|'unit', reason: '字面'|'句型', ratio, shared, sentences }]。
const pattern = (text) =>
  (text.toLowerCase().replaceAll('’', "'").match(/[a-z0-9]+(?:'[a-z]+)?/g) ?? [])
    .map((t) => (STOPWORDS.has(t) ? t : 'X'))
    .join(' ')
    .replace(/X( X)+/g, 'X');

export function translatePairs(docs, ctx, threshold = 0.4) {
  const all = docs.flatMap((doc) =>
    doc.items.filter((it) => it.type === 'translate').map((it) => ({ it, lesson: doc.lessonId, unit: doc.lessonId.replace(/-l\d+$/, '') })),
  );
  const out = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const [x, y] = [all[i], all[j]];
      const scope = x.lesson === y.lesson ? 'lesson' : x.unit === y.unit ? 'unit' : null;
      if (!scope) continue;
      let best = null;
      const hints = new Set([...x.it.hintWords, ...y.it.hintWords].flatMap((h) => h.toLowerCase().split(/[\s-]+/)).map((w) => lemmatize(w, ctx)));
      for (const s of x.it.referenceEn) {
        for (const t of y.it.referenceEn) {
          const o = overlap(s, t, ctx);
          const shared = o.shared.filter((w) => !hints.has(w));
          const r = { shared, ratio: o.shared.length ? (o.ratio * shared.length) / o.shared.length : 0 };
          if (r.ratio >= threshold && (!best || r.ratio > best.ratio)) best = { reason: '字面', ratio: r.ratio, shared: r.shared, sentences: [s, t] };
          if (!best && scope === 'lesson' && pattern(s) === pattern(t)) best = { reason: '句型', ratio: r.ratio, shared: [pattern(s)], sentences: [s, t] };
        }
      }
      if (best) out.push({ a: x.it.id, b: y.it.id, scope, ...best });
    }
  }
  return out;
}

// mcq 題幹不可出現正解字或其變形（§11.15）：比原形。
export function stemLeaks(doc, ctx) {
  return doc.items
    .filter((it) => it.type === 'mcq')
    .filter((it) => {
      const ans = contentLemmas(it.options[it.answer], ctx);
      const stem = contentLemmas(it.stemEn.replace('____', ' '), ctx);
      return ans.some((w) => stem.includes(w));
    })
    .map((it) => it.id);
}
