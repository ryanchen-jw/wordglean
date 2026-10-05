// 片語單元（TASK-24）：讀 data/phrases/phrases.json 的唯一入口，與把 phrase-units.json 的片語單元插進級距檔。
// allocate() 的主題單元完全不動；本檔只在其產出之後插入，主題單元與小課的 ID、字一律不變。
//
// 規則：
// 1. 片語單元插在 after 指定的主題單元之後；同一個 after 有多個片語單元時依陣列順序。
// 2. ID 依該級片語單元的陣列順序編號：b1-p01、小課 b1-p01-l01。
// 3. 標題：常用片語（一）（二）⋯；該級只有一個片語單元時不加編號。

const NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const pad = (n) => String(n).padStart(2, '0');

export const PHRASE_UNIT_TITLE = '常用片語';

// phrases.json → Map(片語 → 條目)
export function phraseTable(doc) {
  return new Map(doc.phrases.map((p) => [p.phrase, p]));
}

export function isPhraseUnit(unit) {
  return unit.kind === 'phrase';
}

export function insertPhraseUnits(levels, phraseUnits) {
  return levels.map((doc) => {
    const specs = phraseUnits.levels[doc.level] ?? [];
    if (!specs.length) return doc;
    if (specs.length > NUMERALS.length) throw new Error(`${doc.level}: ${specs.length} 個片語單元超過標題編號上限`);
    const prefix = doc.level.toLowerCase();
    const after = new Map();
    specs.forEach((spec, i) => {
      if (!doc.units.some((u) => u.id === spec.after)) throw new Error(`${doc.level}: 找不到插入點 ${spec.after}`);
      const unitId = `${prefix}-p${pad(i + 1)}`;
      const unit = {
        id: unitId,
        kind: 'phrase',
        titleZh: specs.length > 1 ? `${PHRASE_UNIT_TITLE}（${NUMERALS[i]}）` : PHRASE_UNIT_TITLE,
        lessons: spec.lessons.map((words, li) => ({ id: `${unitId}-l${pad(li + 1)}`, words: [...words] })),
      };
      after.set(spec.after, [...(after.get(spec.after) ?? []), unit]);
    });
    return { ...doc, units: doc.units.flatMap((u) => [u, ...(after.get(u.id) ?? [])]) };
  });
}
