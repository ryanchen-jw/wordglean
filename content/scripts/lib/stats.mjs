// 課綱統計：每級單元／小課／字數、多益常考字覆蓋率、未排課字數；片語單元（TASK-24）另計，不混入主題單元的數字。

import { headwordLevels, normalizeHeadword } from './lexicon.mjs';
import { isPhraseUnit } from './phrases.mjs';

export function curriculumStats(levels, lexicon, topics) {
  const domainOf = new Map(topics.topics.map((t) => [t.id, t.domain]));
  const placedAt = new Map();
  const perLevel = levels.map((doc) => {
    const units = doc.units.filter((u) => !isPhraseUnit(u));
    const sizes = units.flatMap((u) => u.lessons.map((l) => l.words.length));
    for (const u of units) for (const l of u.lessons) for (const w of l.words) placedAt.set(w, doc.level);
    return {
      level: doc.level,
      units: units.length,
      toeicUnits: units.filter((u) => domainOf.get(u.topic) === 'toeic').length,
      lessons: sizes.length,
      words: sizes.reduce((a, b) => a + b, 0),
      minLessonWords: Math.min(...sizes),
      maxLessonWords: Math.max(...sizes),
    };
  });

  const wordLevel = headwordLevels(lexicon);
  const toeicWords = new Set(lexicon.filter((e) => e.toeic).map((e) => normalizeHeadword(e.headword)));
  const toeicByLevel = Object.fromEntries(levels.map((d) => [d.level, 0]));
  let toeicC2Only = 0;
  let toeicNoLevel = 0;
  for (const w of toeicWords) {
    const placed = placedAt.get(w);
    if (placed) toeicByLevel[placed]++;
    else if (wordLevel.get(w) === 'C2') toeicC2Only++;
    else if (!wordLevel.has(w)) toeicNoLevel++;
  }
  const toeicB1C1 = ['B1', 'B2', 'C1'].reduce((sum, l) => sum + (toeicByLevel[l] ?? 0), 0);

  const casings = new Map();
  for (const e of lexicon) {
    const w = normalizeHeadword(e.headword);
    if (!placedAt.has(w)) continue;
    if (!casings.has(w)) casings.set(w, new Set());
    casings.get(w).add(e.headword);
  }
  const caseMerges = [...casings.values()].filter((s) => s.size > 1).map((s) => [...s].sort().join('／')).sort();

  const phrases = levels.map((doc) => {
    const units = doc.units.filter(isPhraseUnit);
    const sizes = units.flatMap((u) => u.lessons.map((l) => l.words.length));
    return {
      level: doc.level,
      units: units.length,
      lessons: sizes.length,
      phrases: sizes.reduce((a, b) => a + b, 0),
      after: units.map((u) => doc.units[doc.units.indexOf(u) - 1].id),
    };
  });

  return {
    perLevel,
    phrases,
    total: {
      units: perLevel.reduce((a, l) => a + l.units, 0),
      lessons: perLevel.reduce((a, l) => a + l.lessons, 0),
      words: perLevel.reduce((a, l) => a + l.words, 0),
    },
    toeic: {
      total: toeicWords.size,
      byLevel: toeicByLevel,
      b1ToC1: toeicB1C1,
      placed: Object.values(toeicByLevel).reduce((a, b) => a + b, 0),
      c2Only: toeicC2Only,
      noLevel: toeicNoLevel,
    },
    c2: (() => {
      const withC2 = new Set(lexicon.filter((e) => e.cefr === 'C2').map((e) => normalizeHeadword(e.headword)));
      const excluded = [...withC2].filter((w) => wordLevel.get(w) === 'C2').length;
      return {
        entries: lexicon.filter((e) => e.cefr === 'C2').length,
        headwords: withC2.size,
        headwordsExcluded: excluded,
        headwordsPlacedLower: withC2.size - excluded,
      };
    })(),
    caseMerges,
  };
}

const pct = (n, d) => `${((n / d) * 100).toFixed(1)}%`;

export function renderStats(stats, source) {
  const { perLevel, phrases, total, toeic, c2, caseMerges } = stats;
  const phraseTotal = (key) => phrases.reduce((a, l) => a + l[key], 0);
  const lines = [
    '# 課綱統計',
    '',
    '> 由 `node scripts/build-curriculum.mjs` 產生，請勿手改。',
    `> lexicon：\`${source.lexiconPath}\`（${source.entries} 筆，sha256 \`${source.sha256}\`）`,
    '',
    '## 各級規模',
    '',
    '| 級距 | 單元數 | 其中多益主題單元 | 小課數 | 新字數 | 每課字數 |',
    '|---|---|---|---|---|---|',
    ...perLevel.map(
      (l) => `| ${l.level} | ${l.units} | ${l.toeicUnits} | ${l.lessons} | ${l.words} | ${l.minLessonWords}–${l.maxLessonWords} |`,
    ),
    `| 合計 | ${total.units} | ${perLevel.reduce((a, l) => a + l.toeicUnits, 0)} | ${total.lessons} | ${total.words} | |`,
    '',
    '「字」＝小寫 headword；同一拼字的多個詞性只算一次，放在其最低級距。上表只算主題單元，片語單元見下節。',
    '',
    '## 片語單元',
    '',
    '片語表 `data/phrases/phrases.json`，插入點與分課 `curriculum/phrase-units.json`。',
    '',
    '| 級距 | 片語單元數 | 小課數 | 片語數 | 插在哪些主題單元之後 |',
    '|---|---|---|---|---|',
    ...phrases.map((l) => `| ${l.level} | ${l.units} | ${l.lessons} | ${l.phrases} | ${l.after.join('、') || '—'} |`),
    `| 合計 | ${phraseTotal('units')} | ${phraseTotal('lessons')} | ${phraseTotal('phrases')} | |`,
    '',
    '## 多益常考字（TSL）覆蓋',
    '',
    `TSL 字共 ${toeic.total} 個（小寫 headword）。`,
    '',
    '| 排在 | 字數 | 占 TSL |',
    '|---|---|---|',
    ...Object.entries(toeic.byLevel).map(([l, n]) => `| ${l} | ${n} | ${pct(n, toeic.total)} |`),
    `| **B1–C1 合計** | **${toeic.b1ToC1}** | **${pct(toeic.b1ToC1, toeic.total)}** |`,
    `| A1–C1 合計 | ${toeic.placed} | ${pct(toeic.placed, toeic.total)} |`,
    `| 未排課：僅有 C2 級 | ${toeic.c2Only} | ${pct(toeic.c2Only, toeic.total)} |`,
    `| 未排課：lexicon 無級距 | ${toeic.noLevel} | ${pct(toeic.noLevel, toeic.total)} |`,
    '',
    '## 未排課與合併',
    '',
    `- C2：lexicon 有 ${c2.entries} 筆 C2 詞條、涉及 ${c2.headwords} 個字。其中 ${c2.headwordsExcluded} 個字所有有級距的詞性都是 C2，不排進課綱（規格分級軸只到 C1）；${c2.headwordsPlacedLower} 個字在 C1 以下另有詞性，隨較低級排入。`,
    `- 大小寫合併：${caseMerges.length} 組不同大小寫的同拼字依「小寫 headword」併為一字：${caseMerges.slice(0, 5).join('、')}${caseMerges.length > 5 ? '⋯' : ''}。`,
    '',
  ];
  return lines.join('\n');
}
