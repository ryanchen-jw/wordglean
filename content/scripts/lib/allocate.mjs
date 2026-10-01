// 排課器：字→主題分類 ＋ lexicon → 各級距檔。輸出只取決於輸入內容（與輸入陣列順序無關）。
//
// 規則：
// 1. 同一主題內，字依「多益常考優先 → 詞頻名次小者優先（無名次排最後）→ 字母序」排序。
// 2. 主題的字切成 lessonCount(n) 課，字數平均分配（前幾課多 1 字）。
// 3. 主題超過 10 課時拆成多個單元，標題加（一）（二）⋯，課數平均分配。
// 4. 單元順序：先排每個主題的第一個單元（依 topics.json 該級主題順序），再排各主題的第二個單元，依此類推；
//    高頻、多益常考字因此集中在每級前段。
// 5. ID 依最終順序編號：單元 a1-u01、小課 a1-u01-l01。

import { headwordInfo } from './lexicon.mjs';
import { LEVELS, UNIT_MAX_LESSONS, lessonCount } from './rules.mjs';

const PART_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const pad = (n) => String(n).padStart(2, '0');

function splitEvenly(items, parts) {
  const base = Math.floor(items.length / parts);
  const extra = items.length % parts;
  const chunks = [];
  let start = 0;
  for (let i = 0; i < parts; i++) {
    const size = base + (i < extra ? 1 : 0);
    chunks.push(items.slice(start, start + size));
    start += size;
  }
  return chunks;
}

function compareWords(info) {
  return (a, b) => {
    const x = info.get(a);
    const y = info.get(b);
    if (x.toeic !== y.toeic) return x.toeic ? -1 : 1;
    const rx = x.freqRank ?? Infinity;
    const ry = y.freqRank ?? Infinity;
    if (rx !== ry) return rx < ry ? -1 : 1;
    return a < b ? -1 : a > b ? 1 : 0;
  };
}

export function allocate(wordTopics, lexicon, topics) {
  const info = headwordInfo(lexicon);
  const titles = new Map(topics.topics.map((t) => [t.id, t.titleZh]));
  const byOrder = compareWords(info);

  return LEVELS.filter((level) => wordTopics.levels[level]).map((level) => {
    const parts = [];
    for (const topic of topics.levels[level]) {
      const words = wordTopics.levels[level][topic];
      if (!words) continue;
      for (const word of words) {
        if (info.get(word)?.level !== level) throw new Error(`${level}/${topic}: 「${word}」不屬此級`);
      }
      const k = lessonCount(words.length);
      if (k === null) throw new Error(`${level}/${topic}: ${words.length} 字切不出合法小課`);
      const lessons = splitEvenly([...words].sort(byOrder), k);
      const unitCount = Math.ceil(k / UNIT_MAX_LESSONS);
      if (unitCount > PART_NUMERALS.length) throw new Error(`${level}/${topic}: 拆成 ${unitCount} 個單元，超過標題編號上限`);
      const unitLessons = splitEvenly(lessons, unitCount);
      unitLessons.forEach((ls, i) => parts.push({ topic, part: i, total: unitLessons.length, lessons: ls }));
    }

    const ordered = parts
      .map((p, i) => ({ ...p, seq: i }))
      .sort((a, b) => a.part - b.part || a.seq - b.seq);
    if (ordered.length > 99) throw new Error(`${level}: ${ordered.length} 個單元超過 ID 兩位數上限`);

    const prefix = level.toLowerCase();
    const units = ordered.map((p, ui) => {
      const unitId = `${prefix}-u${pad(ui + 1)}`;
      return {
        id: unitId,
        topic: p.topic,
        titleZh: p.total > 1 ? `${titles.get(p.topic)}（${PART_NUMERALS[p.part]}）` : titles.get(p.topic),
        lessons: p.lessons.map((words, li) => ({ id: `${unitId}-l${pad(li + 1)}`, words })),
      };
    });
    return { schemaVersion: 1, level, units };
  });
}
