// 撰寫自查（TASK-9 執行長裁示 a2b2、b1b1）：
//  ① 情境句與單字卡例句雷同：兩句先詞形還原、去功能字，算「共同實詞數 ÷ 單字卡例句實詞數」；
//     ≥ reviewAt（預設 40%）列入人工複查——人工確認主詞、情境、句型三者至少換了兩項，不符就改寫。
//  ② 題幹洩漏：mcq 題幹出現正解字或其變形（詞形還原後相同，或共用 ≥4 字母的字根）。
// 比對的情境句：聽打、跟讀、聽選音檔、mcq 題幹（填入正解）、閱讀短文逐句、翻譯／造句參考答案。

const FUNCTION_WORDS = new Set(
  ('a an the is are was were be been being am i you he she it we they me him her us them my your his its our their ' +
    'this that these those to of in on at for with by from as and or but so if then than not no do does did done ' +
    'have has had will would can could should must may might there here what which who whom when where why how all ' +
    "any some very too also just only about into up down out over after before again more most don't can't won't " +
    "it's i'm let's isn't didn't doesn't").split(/\s+/),
);

// lemmas(word)→原形清單（items-context 的 createDictLemmas）；沒有就退回簡單去字尾。
function baseForm(word, lemmas) {
  const w = word.toLowerCase().replace(/'s$/, '');
  const fromDict = lemmas?.(w) ?? [];
  if (fromDict.length) return fromDict[0];
  return w.replace(/ies$/, 'y').replace(/(ing|ed|es|s)$/, '');
}

export function contentWords(text, lemmas) {
  const words = text.match(/[A-Za-z]+(?:'[a-z]+)?/g) ?? [];
  return new Set(words.filter((w) => !FUNCTION_WORDS.has(w.toLowerCase())).map((w) => baseForm(w, lemmas)));
}

const sentences = (text) => text.split(/(?<=[.!?"])\s+/).filter(Boolean);

export function contextSentences(doc) {
  const out = [];
  for (const it of doc.items) {
    if (it.type === 'listenType' || it.type === 'shadowing') out.push([it.id, it.sentenceEn]);
    if (it.type === 'listenChoice') out.push([it.id, it.audioEn]);
    if (it.type === 'mcq') out.push([it.id, it.stemEn.replace('____', it.options[it.answer])]);
    if (it.type === 'reading') sentences(it.passageEn).forEach((s, k) => out.push([`${it.id}/s${k}`, s]));
    if (it.type === 'translate' || it.type === 'makeSentence') it.referenceEn.forEach((s, k) => out.push([`${it.id}/ref${k}`, s]));
  }
  return out;
}

// 回傳 { similar: [{ word, cardId, id, ratio, card, sentence }], leaks: [{ id, answer, words }] }
export function selfcheck(doc, { lemmas, reviewAt = 0.4 } = {}) {
  const similar = [];
  const others = contextSentences(doc);
  for (const card of doc.items.filter((it) => it.type === 'wordCard')) {
    const a = contentWords(card.exampleEn, lemmas);
    for (const [id, sentence] of others) {
      const b = contentWords(sentence, lemmas);
      const ratio = [...a].filter((w) => b.has(w)).length / Math.max(1, a.size);
      if (ratio >= reviewAt) similar.push({ word: card.word, cardId: card.id, id, ratio, card: card.exampleEn, sentence });
    }
  }
  const leaks = [];
  for (const it of doc.items.filter((x) => x.type === 'mcq')) {
    const answer = it.options[it.answer].toLowerCase();
    const answerBases = new Set(answer.split(/\s+/).map((w) => baseForm(w, lemmas)));
    const root = answer.replace(/(ally|ly|ed|ing|s)$/, '');
    const stemWords = it.stemEn.toLowerCase().match(/[a-z]+/g) ?? [];
    const hits = stemWords.filter((w) => answerBases.has(baseForm(w, lemmas)) || (w.length >= 4 && root.length >= 4 && (root.startsWith(w) || w.startsWith(root))));
    if (hits.length) leaks.push({ id: it.id, answer, words: hits });
  }
  return { similar, leaks };
}
