// 讀 TASK-6 lexicon 的唯一入口：lexicon 欄位若變更，只改本檔。
// lexicon＝陣列，一筆＝一個 headword＋詞性；本檔只依賴 headword、cefr 兩欄。

export const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function normalizeHeadword(headword) {
  return headword.trim().toLowerCase();
}

// 排課用的每字資訊：級距（同 headwordLevels）、多益常考（任一詞性有 toeic 旗標即是）、
// 詞頻名次（各詞性中最小者；全無則 null）。只收有級距的字。
export function headwordInfo(entries) {
  const levels = headwordLevels(entries);
  const info = new Map([...levels].map(([word, level]) => [word, { level, toeic: false, freqRank: null }]));
  for (const entry of entries) {
    const item = info.get(normalizeHeadword(entry.headword));
    if (!item) continue;
    if (entry.toeic) item.toeic = true;
    if (entry.freqRank != null && (item.freqRank === null || entry.freqRank < item.freqRank)) {
      item.freqRank = entry.freqRank;
    }
  }
  return info;
}

// 一個字（小寫 headword）的級距＝它所有詞性中最低的 CEFR 級；全部詞性都無級距者不收。
export function headwordLevels(entries) {
  const levels = new Map();
  for (const entry of entries) {
    const rank = CEFR_ORDER.indexOf(entry.cefr);
    if (rank === -1) continue;
    const word = normalizeHeadword(entry.headword);
    const current = levels.get(word);
    if (current === undefined || rank < CEFR_ORDER.indexOf(current)) {
      levels.set(word, entry.cefr);
    }
  }
  return levels;
}
