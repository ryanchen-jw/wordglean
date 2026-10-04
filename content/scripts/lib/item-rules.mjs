// 題庫數量與長度規則（proposal 決策 1）。改規則只改本檔。

// 每課題量（單字卡另計：該課每個新字一張）。
// 創辦人裁示 2026-10-04：造句沒有標準答案，拿掉；每課改為 2 題翻譯（schema 保留 makeSentence 供 App 相容）。
export const COMPOSITION = {
  listenType: 1,
  listenChoice: 1,
  shadowing: 2,
  mcq: 2,
  reading: 1,
  translate: 2,
  makeSentence: 0,
};

// 過渡：題庫尚未把造句換成翻譯的級別，照舊題量（1 翻譯＋1 造句）。某級轉換完就從這裡移除。
export const MS2TR_PENDING_LEVELS = new Set(['B1']);

export function compositionFor(level) {
  return MS2TR_PENDING_LEVELS.has(level) ? { ...COMPOSITION, translate: 1, makeSentence: 1 } : COMPOSITION;
}

// 英文句字數範圍（例句、聽打、跟讀、聽選音檔、選擇題題幹、參考答案）。
export const SENTENCE_WORDS = {
  A1: [3, 12],
  A2: [4, 14],
  B1: [5, 18],
  B2: [6, 22],
  C1: [6, 26],
};

// 閱讀短文字數範圍。
export const PASSAGE_WORDS = {
  A1: [25, 70],
  A2: [35, 90],
  B1: [50, 130],
  B2: [70, 160],
  C1: [90, 200],
};

// 繁中欄位字元上限（短文另計）。
export const ZH_MAX_CHARS = 80;
// 單字卡四選一的釋義（glossZh、distractorsZh、optionGlossZh）字元上限：「簡短」。
export const GLOSS_MAX_CHARS = 20;
// 這兩版 prompt 產生的題目沒有 TASK-12 欄位：缺欄只列提示（notice），不阻擋。
export const LEGACY_PROMPTS = new Set(['gen-lesson.v1', 'gen-lesson.v2']);
export const PASSAGE_ZH_MAX_CHARS = 400;

// 英文字數：連字號、縮寫視為一字。
export function countWords(text) {
  return (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []).length;
}
