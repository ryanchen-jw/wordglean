// allocate()、validateWordTopics()、curriculumStats() 測試。
// 期望值依 allocate.mjs 檔頭規則與 proposal 手推；fixture 在測試內手造，字名即排序線索。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocate } from '../scripts/lib/allocate.mjs';
import { CURRICULUM_EXCLUDED_WORDS } from '../scripts/lib/offensive.mjs';
import { curriculumStats } from '../scripts/lib/stats.mjs';
import { validateCurriculum, validateWordTopics } from '../scripts/lib/validate.mjs';

const entry = (headword, cefr, extra = {}) => ({
  id: `${headword}#n`,
  headword,
  pos: 'n',
  cefr,
  cefrSource: cefr ? 'cefrj' : null,
  toeic: false,
  ngsl: false,
  freqRank: null,
  glossZh: null,
  ...extra,
});

const topicsFor = (levels) => ({
  schemaVersion: 1,
  topics: [
    { id: 'alpha', titleZh: '甲', titleEn: 'Alpha', domain: 'life', scope: '-', sources: ['fixture'] },
    { id: 'beta', titleZh: '乙', titleEn: 'Beta', domain: 'toeic', scope: '-', sources: ['fixture'] },
  ],
  levels: { A1: ['alpha', 'beta'], A2: ['alpha'], B1: ['alpha'], B2: ['alpha'], C1: ['alpha'], ...levels },
});

// n 個 A1 字：a01、a02…，freqRank 依序 1、2…（數字越小越常用）
const words = (prefix, n, level = 'A1') =>
  Array.from({ length: n }, (_, i) => entry(`${prefix}${String(i + 1).padStart(2, '0')}`, level, { freqRank: i + 1 }));

const run = (lexicon, byTopic, topics = topicsFor()) =>
  allocate({ schemaVersion: 1, levels: { A1: byTopic } }, lexicon, topics)[0];
const lessonSizes = (doc) => doc.units.map((u) => u.lessons.map((l) => l.words.length));

test('排序：多益常考優先 → 詞頻名次小者優先 → 無名次排最後 → 字母序', () => {
  const lexicon = [
    entry('pear', 'A1', { freqRank: 50 }),
    entry('apple', 'A1', { freqRank: 900 }),
    entry('zebra', 'A1'),
    entry('yak', 'A1'),
    entry('invoice', 'A1', { freqRank: 5000, toeic: true }),
    entry('book', 'A1', { freqRank: 10 }),
  ];
  const doc = run(lexicon, { alpha: ['apple', 'book', 'invoice', 'pear', 'yak', 'zebra'] });
  assert.deepEqual(doc.units[0].lessons[0].words, ['invoice', 'book', 'pear', 'apple', 'yak', 'zebra']);
});

test('D2：多益旗標與詞頻跨詞性合併（book 名詞 A1、動詞 A2 多益 → 屬 A1 且算多益常考）', () => {
  const lexicon = [
    entry('book', 'A1', { freqRank: 400 }),
    { ...entry('book', 'A2', { freqRank: 300, toeic: true }), id: 'book#v', pos: 'v' },
    ...words('a', 5),
  ];
  const doc = run(lexicon, { alpha: ['a01', 'a02', 'a03', 'a04', 'a05', 'book'] });
  assert.deepEqual(doc.units[0].lessons[0].words, ['book', 'a01', 'a02', 'a03', 'a04', 'a05']);
});

test('切課：最接近每課 8 字、平均分配、前幾課多 1 字', () => {
  const cases = [
    [6, [[6]]],
    [10, [[10]]],
    [12, [[6, 6]]],
    [13, [[7, 6]]],
    [17, [[9, 8]]],
    [21, [[7, 7, 7]]],
    [30, [[8, 8, 7, 7]]],
  ];
  for (const [n, expected] of cases) {
    const lexicon = words('a', n);
    assert.deepEqual(lessonSizes(run(lexicon, { alpha: lexicon.map((e) => e.headword) })), expected, `n=${n}`);
  }
});

test('切課：5 字、11 字切不出 6–10 字的小課 → allocate 拋錯、validateWordTopics 報 TOPIC_SIZE', () => {
  for (const n of [5, 11]) {
    const lexicon = words('a', n);
    const byTopic = { alpha: lexicon.map((e) => e.headword) };
    assert.throws(() => run(lexicon, byTopic), /切不出合法小課/);
    const errors = validateWordTopics({ schemaVersion: 1, levels: { A1: byTopic } }, lexicon, topicsFor());
    assert.deepEqual(errors.map((e) => `${e.code} ${e.path}`), ['TOPIC_SIZE wordTopics/levels/A1/alpha']);
  }
});

test('拆單元：88 字＝11 課 → 拆兩單元 6＋5 課；單元依「各主題第一單元先、第二單元後」排序；ID 與標題', () => {
  const alpha = words('a', 88);
  const beta = words('b', 8);
  const doc = run([...alpha, ...beta], {
    alpha: alpha.map((e) => e.headword),
    beta: beta.map((e) => e.headword),
  });
  assert.deepEqual(
    doc.units.map((u) => [u.id, u.topic, u.titleZh, u.lessons.length]),
    [
      ['a1-u01', 'alpha', '甲（一）', 6],
      ['a1-u02', 'beta', '乙', 1],
      ['a1-u03', 'alpha', '甲（二）', 5],
    ],
  );
  assert.deepEqual(doc.units[2].lessons.map((l) => l.id), ['a1-u03-l01', 'a1-u03-l02', 'a1-u03-l03', 'a1-u03-l04', 'a1-u03-l05']);
  // 11 課共 88 字＝每課 8 字；第二單元第一課接續第一單元最後一課（a49 起）
  assert.deepEqual(doc.units[2].lessons[0].words, ['a49', 'a50', 'a51', 'a52', 'a53', 'a54', 'a55', 'a56']);
});

test('輸出與輸入陣列順序無關、可重現', () => {
  const lexicon = words('a', 30);
  const forward = lexicon.map((e) => e.headword);
  const a = run(lexicon, { alpha: forward });
  const b = run([...lexicon].reverse(), { alpha: [...forward].reverse() });
  assert.deepEqual(a, b);
});

test('allocate 的產出通過 validateCurriculum', () => {
  const alpha = words('a', 88);
  const beta = words('b', 8);
  const lexicon = [...alpha, ...beta];
  const topics = topicsFor();
  const levels = allocate(
    { schemaVersion: 1, levels: { A1: { alpha: alpha.map((e) => e.headword), beta: beta.map((e) => e.headword) } } },
    lexicon,
    topics,
  );
  assert.deepEqual(validateCurriculum(levels, lexicon, topics), []);
});

test('validateWordTopics：越級、未知字、重複、漏分類、主題不在該級', () => {
  const lexicon = [...words('a', 6), entry('mid', 'B1'), entry('a07', 'A1')];
  const byTopic = { alpha: ['a01', 'a02', 'a03', 'a04', 'a05', 'mid', 'ghost'], beta: ['a01', 'a06', 'a02', 'a03', 'a04', 'a05'] };
  const topics = topicsFor({ A1: ['alpha'] });
  const errors = validateWordTopics({ schemaVersion: 1, levels: { A1: byTopic } }, lexicon, topics);
  assert.deepEqual(errors.map((e) => `${e.code} ${e.path}`).sort(), [
    'DUPLICATE_INTRO wordTopics/levels/A1/beta/0',
    'DUPLICATE_INTRO wordTopics/levels/A1/beta/2',
    'DUPLICATE_INTRO wordTopics/levels/A1/beta/3',
    'DUPLICATE_INTRO wordTopics/levels/A1/beta/4',
    'DUPLICATE_INTRO wordTopics/levels/A1/beta/5',
    'LEVEL_MISMATCH wordTopics/levels/A1/alpha/5',
    'MISSING_WORD A1',
    'UNKNOWN_TOPIC wordTopics/levels/A1/beta',
    'UNKNOWN_WORD wordTopics/levels/A1/alpha/6',
  ]);
  assert.match(errors.find((e) => e.code === 'MISSING_WORD').message, /a07/);
});

test('validateWordTopics：分類檔少了一整個級距也要報 MISSING_WORD', () => {
  const lexicon = [...words('a', 6), ...words('b', 6, 'A2')];
  const errors = validateWordTopics(
    { schemaVersion: 1, levels: { A1: { alpha: ['a01', 'a02', 'a03', 'a04', 'a05', 'a06'] } } },
    lexicon,
    topicsFor(),
  );
  assert.deepEqual(errors.map((e) => `${e.code} ${e.path}`), Array(6).fill('MISSING_WORD A2'));
});

test('統計：每級規模、多益常考字覆蓋（排在 A1／B1、僅 C2、無級距）、C2 排除、大小寫合併', () => {
  const lexicon = [
    ...words('a', 6),
    { ...entry('a01', 'A1', { toeic: true }), id: 'a01#v', pos: 'v' },
    entry('May', 'A1', { freqRank: 7 }),
    ...words('b', 7, 'B1').map((e, i) => (i < 2 ? { ...e, toeic: true } : e)),
    entry('rare', 'C2', { toeic: true }),
    entry('lofty', 'C2'),
    { ...entry('b07', 'C2'), id: 'b07#adj', pos: 'adj' },
    entry('invoice', null, { toeic: true }),
  ];
  lexicon.push(entry('may', 'A1', { freqRank: 9 }));
  const topics = topicsFor();
  const wordTopics = {
    schemaVersion: 1,
    levels: { A1: { alpha: ['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'may'] }, B1: { alpha: ['b01', 'b02', 'b03', 'b04', 'b05', 'b06', 'b07'] } },
  };
  const levels = allocate(wordTopics, lexicon, topics);
  const stats = curriculumStats(levels, lexicon, topics);
  assert.deepEqual(stats.perLevel.map((l) => [l.level, l.units, l.lessons, l.words]), [
    ['A1', 1, 1, 7],
    ['B1', 1, 1, 7],
  ]);
  // 多益常考：a01（A1）、b01、b02（B1）、rare（僅 C2）、invoice（無級距）＝ 5 字
  assert.deepEqual(stats.toeic, { total: 5, byLevel: { A1: 1, B1: 2 }, b1ToC1: 2, placed: 3, c2Only: 1, noLevel: 1 });
  // C2 詞條 3 筆（rare、lofty、b07#adj）涉及 3 字；rare、lofty 全為 C2 → 排除 2；b07 有 B1 詞性 → 隨 B1 排入
  assert.deepEqual(stats.c2, { entries: 3, headwords: 3, headwordsExcluded: 2, headwordsPlacedLower: 1 });
  assert.deepEqual(stats.caseMerges, ['May／may']);
});

test('課綱排除字（創辦人裁示 2026-10-03）：排課照常佔位、產出時剔除——只有含排除字的課少一字，其他課不位移', () => {
  const lexicon = words('a', 16);
  const byTopic = { alpha: lexicon.map((e) => e.headword) };
  const doc = allocate({ schemaVersion: 1, levels: { A1: byTopic } }, lexicon, topicsFor(), { exclude: ['a03'] })[0];
  assert.deepEqual(doc.units[0].lessons.map((l) => l.words), [
    ['a01', 'a02', 'a04', 'a05', 'a06', 'a07', 'a08'],
    ['a09', 'a10', 'a11', 'a12', 'a13', 'a14', 'a15', 'a16'],
  ]);
});

test('課綱排除字：預設清單＝gook、retard', () => {
  assert.deepEqual(CURRICULUM_EXCLUDED_WORDS, ['gook', 'retard']);
});
