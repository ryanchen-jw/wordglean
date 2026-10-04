// 題庫檢查器單元測試。fixture＝手寫兩課（test/fixtures/items/），用真 lexicon 與 dict；
// 期望級距為 data/lexicon/lexicon.json 的字面值（2026-10-01 查：postpone B2、conference B2、lamp A2、
// whether B1、according to B1、according 無級距），不重用實作邏輯推算。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { blockingErrors, checkAnswerLongest, checkAnswerPositionPatterns, checkLessonItems, checkLevelAnswerPositions, checkUnitAnswerPositions } from '../scripts/lib/check-items.mjs';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';
import { COMPOSITION, MS2TR_PENDING_LEVELS, compositionFor } from '../scripts/lib/item-rules.mjs';

const base = loadCheckContext({ allowlist: 'no-such-file.json' });
const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/items/${name}.json`, import.meta.url), 'utf8'));

// 課綱字面值（content/curriculum/a1.json、b1.json）。
const A1_L01 = { id: 'a1-u01-l01', level: 'A1', words: ['the', 'be', 'and', 'of', 'a', 'in', 'to', 'have'] };
const B1_L01 = {
  id: 'b1-u01-l01',
  level: 'B1',
  words: ['afterward', 'whoever', 'aboard', 'anyhow', 'whether', 'including', 'per', 'despite', 'thus'],
};

const checkA1 = (doc, extra = {}) => checkLessonItems(doc, { ...base, lesson: A1_L01, ...extra });
const checkB1 = (doc, extra = {}) => checkLessonItems(doc, { ...base, lesson: B1_L01, ...extra });
const codes = (errors) => errors.map((e) => `${e.code} ${e.path}`).sort();
const card = (doc, k) => doc.items[k]; // 前 8／9 題為單字卡

test('兩份手寫樣本課：全綠', () => {
  assert.deepEqual(checkA1(fixture('a1-u01-l01')), []);
  assert.deepEqual(checkB1(fixture('b1-u01-l01')), []);
});

// ---- AC#1 三種注入案例 ----

test('AC#1 越級字：A1 課出現 B2 的 postpone（含變化形 postponed）→ OVER_LEVEL', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'The teacher will postpone the test.';
  card(doc, 1).exampleEn = 'They postponed the party to Sunday.';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['OVER_LEVEL items/0/exampleEn', 'OVER_LEVEL items/1/exampleEn']);
  assert.match(errors[0].message, /postpone\(B2\)/);
  assert.match(errors[1].message, /postponed\(B2\)/);
});

test('AC#1 雙答案：判題模型認為兩個選項都對 → MCQ_AMBIGUOUS', () => {
  const doc = fixture('a1-u01-l01');
  doc.judge = {
    model: 'test/judge',
    promptVersion: 'judge-mcq.v1',
    verdicts: { 'a1-u01-l01-q10': [0], 'a1-u01-l01-q13': [0, 1], 'a1-u01-l01-q14': [1], 'a1-u01-l01-q15#0': [1], 'a1-u01-l01-q15#1': [2] },
  };
  const errors = checkA1(doc, { requireJudge: true });
  assert.deepEqual(codes(errors), ['MCQ_AMBIGUOUS items/12']);
});

test('AC#1 雙答案（結構面）：兩個選項文字相同 → MCQ_OPTIONS', () => {
  const doc = fixture('a1-u01-l01');
  doc.items[12].options = ['of', 'in', 'Of', 'and'];
  assert.deepEqual(codes(checkA1(doc)), ['MCQ_OPTIONS items/12']);
});

test('AC#1 簡體字：繁中欄混入簡體 → SIMPLIFIED（opencc 層同時報 ZH_NOT_TW）', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '这是我的书。';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['SIMPLIFIED items/0/exampleZh', 'ZH_NOT_TW items/0/exampleZh']);
  assert.match(errors.find((e) => e.code === 'SIMPLIFIED').message, /这.*书|书.*这/);
});

test('簡體字不在手選字表時由 opencc 層擋下（猫）', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '那隻猫在床上。';
  assert.deepEqual(codes(checkA1(doc)), ['ZH_NOT_TW items/0/exampleZh']);
});

// ---- 其他代碼 ----

test('MAINLAND_TERM：視頻', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '我在看視頻。';
  assert.deepEqual(codes(checkA1(doc)), ['MAINLAND_TERM items/0/exampleZh', 'ZH_NOT_TW items/0/exampleZh']);
});

test('台灣通行寫法不誤擋：台灣、連接、支持、菜單', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '我住在台灣，我們支持把兩條線連接起來。';
  card(doc, 1).exampleZh = '服務員送來菜單。';
  card(doc, 2).exampleZh = '她沒有回我的消息。';
  card(doc, 3).exampleZh = '這裡不准停車，那只不過是小事。';
  assert.deepEqual(checkA1(doc), []);
});

test('開發端撰寫與 A2 回報撞到的 opencc 誤擋：傢伙、打開、類型、代碼、夾克扣、圖像、查看、了解、通信、設備、高級、觸摸', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = 'Ben 是個不錯的傢伙，請打開窗戶。';
  card(doc, 1).exampleZh = '這是一種新類型的手機，門的代碼是多少？';
  card(doc, 2).exampleZh = '我的夾克扣不起來，請查看這張圖像。';
  card(doc, 3).exampleZh = '我了解這台通信設備，它很高級，請不要觸摸。';
  assert.deepEqual(checkA1(doc), []);
});

test('A2 第 2 批回報的 opencc 誤擋：家具、攀岩、你家什麼（家什）、祕書', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '我們替客廳買了一些新家具。';
  card(doc, 1).exampleZh = '攀岩很難，但很刺激。';
  card(doc, 2).exampleZh = '說說你家什麼時候會烤肉。';
  card(doc, 3).exampleZh = '請留言給我的祕書。';
  assert.deepEqual(checkA1(doc), []);
});

test('B1 撰寫撞到的教育部標準字形被 opencc 改成異體：布置、占、家具', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '他們用新家具布置辦公室。';
  card(doc, 1).exampleZh = '女性占員工的一半。';
  assert.deepEqual(checkA1(doc), []);
});

// B2 回報的 opencc 誤擋（片語錯轉：了→瞭、只→隻、導入→匯入；標準字形：公布、宣布、雇用）
for (const [phrase, zh] of [
  ['說明了', '他說明了遲到的原因。'],
  ['證明了', '結果證明了他是對的。'],
  ['唯一只', '這是唯一只要十分鐘的路線。'],
  ['導入', '公司下個月導入新系統。'],
  ['公布', '考試成績明天公布。'],
  ['宣布', '經理宣布會議延期。'],
  ['雇用', '這家店打算雇用兩個人。'],
]) {
  test(`B2 回報的 opencc 誤擋：${phrase}`, () => {
    const doc = fixture('a1-u01-l01');
    card(doc, 0).exampleZh = zh;
    assert.deepEqual(checkA1(doc), []);
  });
}

// B1 撰寫回報的 opencc 誤擋（片語錯轉與兩種寫法並存的字形）
for (const [phrase, zh] of [
  ['示範了', '老師示範了如何使用新機器。'],
  ['老闆娘', '她是老闆娘的朋友。'],
  ['擴展', '公司明年要把業務擴展到日本。'],
  ['社區', '我們社區有一座小公園。'],
  ['程序', '申請簽證的程序很長。'],
  ['最多只有', '店裡最多只有二十個座位。'],
  ['解雇', '他上個月被公司解雇了。'],
  ['污染', '這條河的污染很嚴重。'],
  ['聯繫', '有問題請和我們聯繫。'],
  ['划槳', '我們得用力划槳才能到岸邊。'],
]) {
  test(`B1 回報的 opencc 誤擋：${phrase}`, () => {
    const doc = fixture('a1-u01-l01');
    card(doc, 0).exampleZh = zh;
    assert.deepEqual(checkA1(doc), []);
  });
}

test('B2 b2d 回報的 opencc 誤擋：游擊、游標、管弦', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '那本歷史書描述游擊隊如何在夜裡穿越山區。';
  card(doc, 1).exampleZh = '把游標移到這個按鈕上。';
  card(doc, 2).exampleZh = '我們去聽了一場管弦樂團的演出。';
  assert.deepEqual(checkA1(doc), []);
});

test('pilot 實際產出撞到的誤擋：found（find 的過去式，A1）、café（cafe A1）、對象', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'I found the bag in the café.';
  card(doc, 1).exampleZh = '他是我交往的對象。';
  assert.deepEqual(checkA1(doc), []);
});

test('美式拼法變化形（ECDICT 詞形表未收）：traveled→travel A1 通過；canceled→cancel B1 在 A1 課報 OVER_LEVEL', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'We traveled to the park and are traveling home.';
  assert.deepEqual(checkA1(doc), []);
  card(doc, 1).exampleEn = 'They canceled the trip to the park.';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['OVER_LEVEL items/1/exampleEn']);
  assert.match(errors[0].message, /canceled\(B1\)/);
});

test('真的不在單字表的字仍報 UNLEVELED（規則還原不可亂配：blorfed）', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'Tom blorfed the bag.';
  assert.deepEqual(codes(checkA1(doc)), ['UNLEVELED items/0/exampleEn']);
});

test('越級分析假陽性：片語 out of（A2）由兩個 A1 字組成 → A1 通過；序數 tenth（ten A1）→ 通過', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'The cat is out of the box.';
  card(doc, 1).exampleEn = 'It is the tenth day of the month.';
  assert.deepEqual(checkA1(doc), []);
});

test('片語本身級距高於組成字時仍照片語判：according to（B1，according 無級距）在 A1 報 OVER_LEVEL', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'According to Tom, the cat is in the bag.';
  assert.deepEqual(codes(checkA1(doc)), ['OVER_LEVEL items/0/exampleEn']);
});

test('英文欄位寫成中文 → NOT_ENGLISH（不是 UNLEVELED）', () => {
  const doc = fixture('a1-u01-l01');
  doc.items[9].options = ['他有一隻狗', 'Two dogs', 'A cat and a bird'];
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['NOT_ENGLISH items/9/options/0']);
});

test('attempt：第 3 次產生（重產上限 3）合法；4 不合法', () => {
  const doc = fixture('a1-u01-l01');
  doc.attempt = 3;
  assert.deepEqual(checkA1(doc), []);
  doc.attempt = 4;
  const errors = checkA1(doc);
  assert.ok(errors.length > 0 && errors.every((e) => e.code === 'SCHEMA'));
  assert.ok(errors.some((e) => e.path === '/attempt'));
});

// ---- 開發端撰寫（author: claude-dev）＋ Claude 審題員判題（judgedBy: claude-reviewer），創辦人 G5 裁示 2026-10-02 ----

const reviewerJudge = (extra = {}) => ({
  judgedBy: 'claude-reviewer',
  reviewedAt: '2026-10-02T10:00:00Z',
  verdicts: { 'a1-u01-l01-q10': [0], 'a1-u01-l01-q13': [0], 'a1-u01-l01-q14': [1], 'a1-u01-l01-q15#0': [1], 'a1-u01-l01-q15#1': [2] },
  ...extra,
});

test('審題員判題：requireJudge 接受 judgedBy=claude-reviewer；author／authoredAt 合法', () => {
  const doc = fixture('a1-u01-l01');
  doc.author = 'claude-dev';
  doc.authoredAt = '2026-10-02T09:58:00Z';
  doc.judge = reviewerJudge();
  assert.deepEqual(checkA1(doc, { requireJudge: true }), []);
});

test('審題員判題：雙答案照樣報 MCQ_AMBIGUOUS', () => {
  const doc = fixture('a1-u01-l01');
  doc.judge = reviewerJudge();
  doc.judge.verdicts['a1-u01-l01-q13'] = [0, 1];
  assert.deepEqual(codes(checkA1(doc, { requireJudge: true })), ['MCQ_AMBIGUOUS items/12']);
});

test('審題員判題：干擾項與正解同義 → GLOSS_SYNONYM；審題問題 → REVIEW_ISSUE', () => {
  const doc = fixture('a1-u01-l01');
  doc.judge = reviewerJudge({
    glossVerdicts: { the: [], be: [2] },
    issues: [{ path: 'items/0/exampleZh', message: '中譯不自然' }],
  });
  const errors = checkA1(doc, { requireJudge: true });
  assert.deepEqual(codes(errors), ['GLOSS_SYNONYM items/1/distractorsZh', 'REVIEW_ISSUE items/0/exampleZh']);
  assert.match(errors.find((e) => e.code === 'REVIEW_ISSUE').message, /中譯不自然/);
});

test('最終審後修正（resolvedAfterFinalReview）：已移出 issues 的條目不阻擋；欄位缺 resolution 或時間 → SCHEMA', () => {
  const doc = fixture('a1-u01-l01');
  doc.judge = reviewerJudge({
    resolvedAfterFinalReview: [
      { path: 'items/16/rubricZh/2', message: '要點過嚴', resolution: '放寬為…', resolvedAt: '2026-10-02T12:00:00Z' },
    ],
  });
  assert.deepEqual(checkA1(doc, { requireJudge: true }), []);
  doc.judge.resolvedAfterFinalReview = [{ path: 'items/16/rubricZh/2', message: '要點過嚴' }];
  const errors = checkA1(doc);
  assert.ok(errors.length > 0 && errors.every((e) => e.code === 'SCHEMA'));
});

test('authoredAt／reviewedAt 不是 ISO 8601 UTC → SCHEMA', () => {
  const doc = fixture('a1-u01-l01');
  doc.authoredAt = 'yesterday';
  doc.judge = reviewerJudge({ reviewedAt: '2026/10/02' });
  assert.deepEqual(codes(checkA1(doc)).sort(), ['SCHEMA /authoredAt', 'SCHEMA /judge/reviewedAt']);
});

test('判題欄來源不明（既無 model 也無 judgedBy）或 judgedBy 非 claude-reviewer → SCHEMA', () => {
  for (const judge of [{ verdicts: {} }, { judgedBy: 'someone', reviewedAt: '2026-10-02T10:00:00Z', verdicts: {} }]) {
    const doc = fixture('a1-u01-l01');
    doc.judge = judge;
    const errors = checkA1(doc);
    assert.ok(errors.length > 0 && errors.every((e) => e.code === 'SCHEMA'));
  }
});

// ---- TASK-12 單字卡四選一欄位（glossZh、distractorsZh；mcq optionGlossZh） ----

test('TASK-12：v3 起（含手寫樣本）單字卡缺 glossZh／distractorsZh → MISSING_FIELD（阻擋）', () => {
  const doc = fixture('a1-u01-l01');
  delete card(doc, 0).glossZh;
  delete card(doc, 1).distractorsZh;
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['MISSING_FIELD items/0/glossZh', 'MISSING_FIELD items/1/distractorsZh']);
  assert.ok(errors.every((e) => !e.notice));
});

test('TASK-12：v1／v2 舊檔缺欄 → MISSING_FIELD 提示（notice，不阻擋）', () => {
  const doc = fixture('a1-u01-l01');
  doc.promptVersion = 'gen-lesson.v2';
  for (const it of doc.items) {
    delete it.glossZh;
    delete it.distractorsZh;
    delete it.optionGlossZh;
  }
  const errors = checkA1(doc);
  assert.equal(errors.length, 8 * 2);
  assert.ok(errors.every((e) => e.code === 'MISSING_FIELD' && e.notice === true));
  assert.deepEqual(blockingErrors(errors), []);
});

test('TASK-12：干擾釋義須恰 3 個（SCHEMA）、彼此不同且不得與 glossZh 相同（DISTRACTOR_DUP）', () => {
  for (const distractors of [['一個', '和'], ['一個', '和', '在⋯裡面', '到']]) {
    const doc = fixture('a1-u01-l01');
    card(doc, 0).distractorsZh = distractors;
    const errors = checkA1(doc);
    assert.ok(errors.length > 0, `${distractors.length} 個干擾項必須被擋`);
    assert.ok(errors.every((e) => e.code === 'SCHEMA'));
    assert.ok(errors.some((e) => e.path === '/items/0/distractorsZh'));
  }
  const dup = fixture('a1-u01-l01');
  card(dup, 0).distractorsZh = ['這個；那個（特指）', '和', '和 '];
  const errors = checkA1(dup);
  assert.deepEqual(codes(errors), ['DISTRACTOR_DUP items/0/distractorsZh']);
  assert.match(errors[0].message, /與正解相同.*重複/s);
});

test('TASK-12：新欄位也受繁中守衛與長度限制', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).glossZh = '这个';
  card(doc, 1).distractorsZh = ['有', '看視頻', '做'];
  card(doc, 2).glossZh = '和；而且；以及；還有；與；跟；同；並且；連同；加上；外加；兼；且';
  assert.deepEqual(codes(checkA1(doc)), [
    'LENGTH items/2/glossZh',
    'MAINLAND_TERM items/1/distractorsZh/1',
    'SIMPLIFIED items/0/glossZh',
    'ZH_NOT_TW items/0/glossZh',
    'ZH_NOT_TW items/1/distractorsZh/1',
  ]);
});

test('TASK-12：mcq optionGlossZh 選填；有就必須與 options 等長、且是繁中', () => {
  const doc = fixture('a1-u01-l01');
  delete doc.items[12].optionGlossZh;
  assert.deepEqual(checkA1(doc), []);
  doc.items[13].optionGlossZh = ['⋯的', '在⋯裡'];
  assert.deepEqual(codes(checkA1(doc)), ['OPTION_GLOSS items/13/optionGlossZh']);
});

test('pilot 實際產出的簡體字：城里、几 → ZH_NOT_TW', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = '公園在城里。';
  card(doc, 1).exampleZh = '我們喝了几杯。';
  assert.deepEqual(codes(checkA1(doc)), ['ZH_NOT_TW items/0/exampleZh', 'ZH_NOT_TW items/1/exampleZh']);
});

test('ZH_MISSING：繁中欄是英文', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleZh = 'The cat is on the bed.';
  assert.deepEqual(codes(checkA1(doc)), ['ZH_MISSING items/0/exampleZh']);
});

test('UNLEVELED：未宣告的人名；宣告後通過；白名單通過', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'Bob has a blorf in the bag.';
  assert.deepEqual(codes(checkA1(doc)), ['UNLEVELED items/0/exampleEn']);
  doc.properNouns.push('Bob');
  assert.match(checkA1(doc)[0].message, /blorf/);
  assert.deepEqual(checkA1(doc, { allowlist: new Set(['blorf']) }), []);
});

test('專有名詞不能繞過 lexicon 有級距的字：宣告 Conference 仍報 OVER_LEVEL', () => {
  const doc = fixture('a1-u01-l01');
  doc.properNouns.push('Conference');
  card(doc, 0).exampleEn = 'The Conference is in the park.';
  assert.deepEqual(codes(checkA1(doc)), ['OVER_LEVEL items/0/exampleEn']);
});

test('縮寫：don\'t／can\'t／Tom\'s 不誤擋', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = "I don't have Tom's pen and I can't go.";
  assert.deepEqual(checkA1(doc), []);
});

test('多字詞：according to 在 B1 通過、在 A1 報 OVER_LEVEL', () => {
  const b1 = fixture('b1-u01-l01');
  card(b1, 0).exampleEn = 'According to the news, we had rain afterward.';
  assert.deepEqual(checkB1(b1), []);
  const a1 = fixture('a1-u01-l01');
  card(a1, 0).exampleEn = 'According to Tom, the cat is in the bag.';
  const errors = checkA1(a1);
  assert.deepEqual(codes(errors), ['OVER_LEVEL items/0/exampleEn']);
  assert.match(errors[0].message, /according to\(B1\)/);
});

test('含「.」「-」的 headword 整段比對（同多字詞）：Mr.／Mrs.／T-shirt／a.m.／p.m. 不宣告專有名詞也通過', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'Mr. Smith and Mrs. Smith have a T-shirt.';
  card(doc, 1).exampleEn = 'The bus comes at 7 a.m. and at 9 P.M.';
  assert.deepEqual(checkA1(doc), []);
});

test('含「-」的 headword 加複數 s 也整段比對：T-shirts 不宣告專有名詞也通過', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'I have two T-shirts in the bag.';
  assert.deepEqual(checkA1(doc), []);
});

test('含「.」的 headword 照自己的級距判：Ms.（A2）在 A1 報 OVER_LEVEL，不是 UNLEVELED', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'Ms. Smith is in the park.';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['OVER_LEVEL items/0/exampleEn']);
  assert.match(errors[0].message, /ms\.\(A2\)/);
});

test('複合字的不規則複數用詞形還原回到 headword：grandchildren（grandchild A2）在 A1 報 OVER_LEVEL、不是 UNLEVELED', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 0).exampleEn = 'The grandchildren are in the park.';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['OVER_LEVEL items/0/exampleEn']);
  assert.match(errors[0].message, /grandchildren\(A2\)/);
});

test('LENGTH：A1 句子 2 字、短文過短', () => {
  const doc = fixture('a1-u01-l01');
  card(doc, 1).exampleEn = 'Be quiet.';
  doc.items[14].passageEn = 'Amy is ten. She has a brother.';
  assert.deepEqual(codes(checkA1(doc)), ['LENGTH items/1/exampleEn', 'LENGTH items/14/passageEn']);
});

test('COMPOSITION：少一題跟讀、單字卡換成別課的字', () => {
  const doc = fixture('a1-u01-l01');
  doc.items.splice(11, 1); // 第二題跟讀
  card(doc, 7).word = 'cat';
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['COMPOSITION items', 'COMPOSITION items']);
  assert.ok(errors.some((e) => /shadowing 應為 2 題，實際 1/.test(e.message)));
  assert.ok(errors.some((e) => /缺：have.*多餘或重複：cat/.test(e.message)));
});

// ---- 創辦人裁示 2026-10-04：造句改翻譯（每課 2 題翻譯、0 題造句）；未轉換級別（MS2TR_PENDING_LEVELS）照舊題量 ----

test('compositionFor：已轉換級別 translate 2、makeSentence 0；未轉換級別（MS2TR_PENDING_LEVELS）照舊 1／1', () => {
  assert.equal(COMPOSITION.translate, 2);
  assert.equal(COMPOSITION.makeSentence, 0);
  assert.ok(!MS2TR_PENDING_LEVELS.has('A1'));
  for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
    const expected = MS2TR_PENDING_LEVELS.has(level) ? { ...COMPOSITION, translate: 1, makeSentence: 1 } : COMPOSITION;
    assert.deepEqual(compositionFor(level), expected, level);
  }
});

test('造句改翻譯：A1 課出現 makeSentence → COMPOSITION（makeSentence 應為 0、translate 應為 2）', () => {
  const doc = fixture('a1-u01-l01');
  doc.items[16] = { id: 'a1-u01-l01-q17', type: 'makeSentence', targetWord: 'the', instructionZh: '用 the 造一個句子，說說房間裡的一樣東西在哪裡。', referenceEn: ['The pen is on the desk.'], rubricZh: ['句子有主詞和動詞'] };
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['COMPOSITION items', 'COMPOSITION items']);
  assert.ok(errors.some((e) => /makeSentence 應為 0 題，實際 1/.test(e.message)));
  assert.ok(errors.some((e) => /translate 應為 2 題，實際 1/.test(e.message)));
});

test('過渡：未轉換級別（B1）一課 1 翻譯＋1 造句仍全綠、改成 2 翻譯反而報 COMPOSITION', () => {
  const doc = fixture('b1-u01-l01');
  assert.deepEqual(checkB1(doc), []);
  const ms = doc.items.findIndex((it) => it.type === 'makeSentence');
  doc.items[ms] = { id: doc.items[ms].id, type: 'translate', promptZh: '不管天氣如何，我們都會去。', hintWords: ['whether'], referenceEn: ['We will go whether it rains or not.'], rubricZh: ['用 whether 表示「不管」'] };
  assert.deepEqual(codes(checkB1(doc)), ['COMPOSITION items', 'COMPOSITION items']);
});

test('TRANSLATE_HINT_DUP：同課兩題翻譯的 hintWords 有相同的本課目標字；非目標字相同不報', () => {
  const doc = fixture('a1-u01-l01');
  doc.items[16].hintWords = [...doc.items[16].hintWords, 'have'];
  const errors = checkA1(doc);
  assert.deepEqual(codes(errors), ['TRANSLATE_HINT_DUP items/16/hintWords']);
  assert.match(errors[0].message, /have/);
  const ok = fixture('a1-u01-l01');
  ok.items[15].hintWords = [...ok.items[15].hintWords, 'desk'];
  ok.items[16].hintWords = [...ok.items[16].hintWords, 'desk'];
  assert.deepEqual(checkA1(ok), []);
});

test('LESSON_MISMATCH：檔內 lessonId 與課綱不符', () => {
  const doc = fixture('a1-u01-l01');
  doc.lessonId = 'a1-u01-l02';
  assert.deepEqual(codes(checkA1(doc)), ['LESSON_MISMATCH lessonId']);
});

test('MCQ_WRONG_KEY、MCQ_UNJUDGED、題幹缺空格、答案越界', () => {
  const doc = fixture('a1-u01-l01');
  doc.items[13].stemEn = 'My mother is in the kitchen.';
  doc.items[9].answer = 5;
  doc.judge = { model: 'test/judge', promptVersion: 'judge-mcq.v1', verdicts: { 'a1-u01-l01-q13': [2] } };
  assert.deepEqual(codes(checkA1(doc, { requireJudge: true })), [
    'MCQ_OPTIONS items/13/stemEn',
    'MCQ_OPTIONS items/9/answer',
    'MCQ_UNJUDGED items/13',
    'MCQ_UNJUDGED items/14/questions/0',
    'MCQ_UNJUDGED items/14/questions/1',
    'MCQ_UNJUDGED items/9',
    'MCQ_WRONG_KEY items/12',
  ]);
});

test('SCHEMA：缺 answer、未知題型', () => {
  const doc = fixture('a1-u01-l01');
  delete doc.items[12].answer;
  doc.items[0].type = 'essay';
  const errors = checkA1(doc);
  assert.ok(errors.length > 0 && errors.every((e) => e.code === 'SCHEMA'));
  assert.ok(errors.some((e) => e.path === '/items/0/type'));
  assert.ok(errors.some((e) => e.path === '/items/12' && /answer/.test(e.message)));
});

// ---- 正解位置分布（第③關 G1） ----

const positionErrors = (errors) => errors.filter((e) => e.code.startsWith('ANSWER_POSITION'));

test('正解位置①：單課跨題型合計，≥4 個正解在同一位置 → ANSWER_POSITION；3 個則不報', () => {
  const doc = fixture('a1-u01-l01'); // 聽選 0、mcq 0／1、閱讀 1／2
  doc.items[13].answer = 0; // 聽選 0、mcq 0、0 → 位置 0 有 3 個
  assert.deepEqual(positionErrors(checkA1(doc)), []);
  doc.items[14].questions[0].answer = 0; // 再一個 → 位置 0 有 4 個（共 5 個題位）
  const errors = positionErrors(checkA1(doc));
  assert.deepEqual(codes(errors), ['ANSWER_POSITION items']);
  assert.match(errors[0].message, /位置 0.*4\/5/);
});

test('正解位置③：同一單元同題型 ≥6 題、同一位置超過 50% → ANSWER_POSITION_UNIT；不同單元分開算', () => {
  const lesson = (unit, n, answers) => ({
    lessonId: `a1-${unit}-l0${n}`,
    level: 'A1',
    items: answers.map((answer, k) => ({ id: `q${k}`, type: 'mcq', options: ['a', 'b', 'c', 'd'], answer })),
  });
  // u01：6 題 mcq，位置 2 有 4 題 → 報；u02：6 題，位置 2 有 3 題（50%）→ 不報
  const docs = [lesson('u01', 1, [2, 2, 0]), lesson('u01', 2, [2, 2, 1]), lesson('u02', 1, [2, 2, 0]), lesson('u02', 2, [2, 1, 3])];
  const errors = checkUnitAnswerPositions(docs);
  assert.deepEqual(codes(errors), ['ANSWER_POSITION_UNIT a1-u01']);
  assert.match(errors[0].message, /mcq.*位置 2.*4\/6/);
  assert.deepEqual(checkUnitAnswerPositions([lesson('u01', 1, [2, 2, 2, 2, 2])]), []); // 不足 6 題不判
});

test('正解位置②：同一級跨課同題型 ≥6 題、同一位置超過 50% → ANSWER_POSITION_LEVEL；不同級分開算', () => {
  const lesson = (level, n, answers) => ({
    lessonId: `${level.toLowerCase()}-u01-l0${n}`,
    level,
    items: answers.map((answer, k) => ({ id: `q${k}`, type: 'listenChoice', options: ['a', 'b', 'c'], answer })),
  });
  // A1：6 題聽選，位置 0 有 4 題（67%）→ 報；B1：6 題，位置 0 有 3 題（50%，未超過）→ 不報
  const docs = [lesson('A1', 1, [0, 0, 1]), lesson('A1', 2, [0, 0, 2]), lesson('B1', 1, [0, 0, 1]), lesson('B1', 2, [0, 1, 2])];
  const errors = checkLevelAnswerPositions(docs);
  assert.deepEqual(codes(errors), ['ANSWER_POSITION_LEVEL A1']);
  assert.match(errors[0].message, /listenChoice.*位置 0.*4\/6/);
  // 不足 6 題不判
  assert.deepEqual(checkLevelAnswerPositions([lesson('A1', 1, [0, 0, 0, 0, 0])]), []);
});

test('正解位置②：閱讀小題逐題計入（每篇 2 小題）', () => {
  const docs = [1, 2, 3].map((n) => ({
    lessonId: `a1-u01-l0${n}`,
    level: 'A1',
    items: [{ id: 'r', type: 'reading', questions: [{ options: ['a', 'b'], answer: 1 }, { options: ['a', 'b'], answer: 1 }] }],
  }));
  assert.deepEqual(codes(checkLevelAnswerPositions(docs)), ['ANSWER_POSITION_LEVEL A1']);
});

test('正解長度：選項依字元長度排名次，正解落在每個名次的比例（並列依區間攤分）同級同題型都要在隨機 ±12pp 內——三選一 21–45%、四選一 13–37%（≥20 題）→ ANSWER_LONGEST', () => {
  // 三選一：r1＝正解最長、r2＝第二長、r3＝最短、tie＝正解與一個干擾項並列第 1–2 名（各記 0.5）
  const q = (kind) => ({
    r1: { options: ['六個字的正解', '五個字選項', '四個字的'], answer: 0 },
    r2: { options: ['五個字正解', '六個字的選項', '四個字的'], answer: 0 },
    r3: { options: ['四個字的', '五個字選項', '六個字的選項'], answer: 0 },
    tie: { options: ['一樣長的', '一樣長的', '三個字'], answer: 0 },
  })[kind];
  const docs = (level, kinds) => kinds.map((kind, n) => ({
    lessonId: `${level.toLowerCase()}-u01-l${String(n + 1).padStart(2, '0')}`,
    level,
    items: [{ id: 'r', type: 'reading', questions: [q(kind)] }],
  }));
  const spread = (a, b, c) => [...Array(a).fill('r1'), ...Array(b).fill('r2'), ...Array(c).fill('r3')];
  const messages = (errors) => errors.map((e) => e.message).join('\n');
  // 反例：正解永遠最長、永遠第二長、永遠最短 → 都要擋下
  const always1 = checkAnswerLongest(docs('A1', spread(21, 0, 0)));
  assert.match(messages(always1), /reading（3 選 1）正解是第 1 長（最長）的比例 100\.0%（21 題，應在 21%–45%）/);
  assert.match(messages(always1), /第 3 長（最短）的比例 0\.0%/);
  assert.match(messages(checkAnswerLongest(docs('A1', spread(0, 21, 0)))), /第 2 長的比例 100\.0%/);
  assert.match(messages(checkAnswerLongest(docs('A1', spread(0, 0, 21)))), /第 3 長（最短）的比例 100\.0%/);
  // 反例：正解永遠不是最長（第二長、最短各半）→ 最長 0% 低於下限
  assert.match(messages(checkAnswerLongest(docs('A1', spread(0, 11, 10)))), /第 1 長（最長）的比例 0\.0%/);
  // 反例：正解總在並列第 1–2 名 → 第 1、2 名各 50%、最短 0%
  assert.deepEqual(codes(checkAnswerLongest(docs('A1', Array(20).fill('tie')))), ['ANSWER_LONGEST A1', 'ANSWER_LONGEST A1', 'ANSWER_LONGEST A1']);
  // 均勻（7／7／7）、邊界內（9／7／5＝42.9%／33.3%／23.8%）→ 不報
  assert.deepEqual(checkAnswerLongest(docs('B1', spread(7, 7, 7))), []);
  assert.deepEqual(checkAnswerLongest(docs('B1', spread(9, 7, 5))), []);
  // 不足 20 題不判（19 題全最長）
  assert.deepEqual(checkAnswerLongest(docs('A1', spread(19, 0, 0))), []);
  // 四選一 13–37%：counts[r]＝正解是第 r+1 長的題數（選項由長到短排，answer 即名次）
  const mcq = (counts) => counts.flatMap((c, rank) => Array(c).fill(rank)).map((rank, n) => ({
    lessonId: `a2-u01-l${String(n + 1).padStart(2, '0')}`,
    level: 'A2',
    items: [{ id: 'm', type: 'mcq', options: ['aaaa', 'bbb', 'cc', 'd'], answer: rank }],
  }));
  assert.deepEqual(checkAnswerLongest(mcq([5, 5, 5, 5])), []);
  assert.deepEqual(checkAnswerLongest(mcq([7, 5, 5, 3])), []);
  const second = checkAnswerLongest(mcq([4, 8, 4, 4]));
  assert.deepEqual(codes(second), ['ANSWER_LONGEST A2']);
  assert.match(second[0].message, /mcq（4 選 1）正解是第 2 長的比例 40\.0%（20 題，應在 13%–37%）/);
  const low = messages(checkAnswerLongest(mcq([5, 5, 8, 2])));
  assert.match(low, /第 3 長的比例 40\.0%/);
  assert.match(low, /第 4 長（最短）的比例 10\.0%/);
});

test('正解長度：reading、listenChoice 單題任一選項長度 >其餘平均 2 倍或 <一半 → ANSWER_LONGEST（逐題、不論題數）；mcq 單字選項不套用', () => {
  const lesson = (items) => [{ lessonId: 'a2-u01-l01', level: 'A2', items }];
  const reading = (options) => ({ id: 'a2-u01-l01-q15', type: 'reading', questions: [{ options, answer: 1 }] });
  // 反例：一個干擾項特別長（10 字 vs 其餘平均 4 字 → 2.5 倍）
  const long = checkAnswerLongest(lesson([reading(['一張很舊的藏寶地圖呢', '四個字的', '四個字的'])]));
  assert.deepEqual(codes(long), ['ANSWER_LONGEST a2-u01-l01']);
  assert.match(long[0].message, /a2-u01-l01-q15#0（items\/0\/questions\/0）選項 1 長 10 字，其餘平均 4\.0 字（超過 2 倍）/);
  // 反例：聽選一個選項特別短（3 字元 vs 其餘平均 17.5 → 不到一半）
  const short = checkAnswerLongest(lesson([{ id: 'a2-u01-l01-q10', type: 'listenChoice', options: ['Wait at the corner', 'Cab', 'Go home right now'], answer: 0 }]));
  assert.deepEqual(codes(short), ['ANSWER_LONGEST a2-u01-l01']);
  assert.match(short[0].message, /q10（items\/0）選項 2 長 3 字，其餘平均 17\.5 字（不到一半）/);
  // 剛好 2 倍、剛好一半不報
  assert.deepEqual(checkAnswerLongest(lesson([reading(['八個字的選項呢呢', '四個字的', '四個字的'])])), []);
  assert.deepEqual(checkAnswerLongest(lesson([reading(['兩字', '四個字的', '四個字的'])])), []);
  // mcq 單字選項不套用（spy 3 字元 vs 其餘平均 9.3）
  assert.deepEqual(checkAnswerLongest(lesson([{ id: 'a2-u01-l01-q13', type: 'mcq', options: ['hometown', 'nationality', 'foreigner', 'spy'], answer: 0 }])), []);
});

test('正解位置④：同一級 mcq 第 2 題對第 1 題的位置差固定（相鄰 ±1）→ ANSWER_POSITION_PATTERN；各差值平均則不報', () => {
  const lesson = (n, answers, level = 'A1') => ({
    lessonId: `${level.toLowerCase()}-u01-l${String(n).padStart(2, '0')}`,
    level,
    items: answers.map((answer, k) => ({ id: `q${k}`, type: 'mcq', options: ['a', 'b', 'c', 'd'], answer })),
  });
  // 反例：TASK-9 第 1 批重排後的規律——每課第 2 題＝第 1 題 ±1（mod 4），12 課全部相鄰
  const adjacent = [[2, 3], [0, 1], [3, 2], [3, 0], [1, 2], [0, 3], [2, 1], [1, 0], [3, 0], [0, 1], [2, 3], [1, 2]];
  const errors = checkAnswerPositionPatterns(adjacent.map((a, n) => lesson(n + 1, a)));
  assert.deepEqual(codes(errors), ['ANSWER_POSITION_PATTERN A1']);
  assert.match(errors[0].message, /mcq 第 2 題對第 1 題.*集中在 1：8\/12/);
  // 差值 0／1／2／3 各 3 課 → 不報
  const even = [[0, 0], [1, 1], [2, 2], [0, 1], [1, 2], [2, 3], [0, 2], [1, 3], [2, 0], [0, 3], [1, 0], [2, 1]];
  assert.deepEqual(checkAnswerPositionPatterns(even.map((a, n) => lesson(n + 1, a))), []);
  // 反例：實際的相鄰規律——差值只有 1 與 3（各半），0、2 從未出現；24 課時均勻應各約 6 次 → 報
  const plusMinus = Array.from({ length: 24 }, (_, n) => [n % 4, (n % 4 + (n % 2 ? 3 : 1)) % 4]);
  const pm = checkAnswerPositionPatterns(plusMinus.map((a, n) => lesson(n + 1, a)));
  assert.deepEqual(codes(pm), ['ANSWER_POSITION_PATTERN A1']);
  assert.match(pm[0].message, /從未出現 0、2/);
  // 樣本少（12 課、每個差值期望 3 次）時，差值沒出現不算規律
  assert.deepEqual(checkAnswerPositionPatterns(plusMinus.slice(0, 12).map((a, n) => lesson(n + 1, a))), []);
  // 不足 8 課不判；不同級分開算
  assert.deepEqual(checkAnswerPositionPatterns(adjacent.slice(0, 7).map((a, n) => lesson(n + 1, a))), []);
  const mixed = [...adjacent.slice(0, 7).map((a, n) => lesson(n + 1, a)), ...adjacent.slice(7).map((a, n) => lesson(n + 1, a, 'B1'))];
  assert.deepEqual(checkAnswerPositionPatterns(mixed), []);
});

test('正解位置④：閱讀第 2 小題對第 1 小題的位置差固定 → ANSWER_POSITION_PATTERN', () => {
  const docs = Array.from({ length: 9 }, (_, n) => ({
    lessonId: `a1-u01-l${String(n + 1).padStart(2, '0')}`,
    level: 'A1',
    items: [{ id: 'r', type: 'reading', questions: [{ options: ['a', 'b', 'c'], answer: n % 3 }, { options: ['a', 'b', 'c'], answer: (n + 1) % 3 }] }],
  }));
  const errors = checkAnswerPositionPatterns(docs);
  assert.deepEqual(codes(errors), ['ANSWER_POSITION_PATTERN A1']);
  assert.match(errors[0].message, /閱讀第 2 小題對第 1 小題.*集中在 1：9\/9/);
});

test('最終審後修正條目可標記已複審（rechecked：by＋at）；rechecked 缺 at → SCHEMA', () => {
  const doc = fixture('a1-u01-l01');
  const entry = { path: 'items/16/rubricZh/2', message: '要點過嚴', resolution: '放寬為…', resolvedAt: '2026-10-02T12:00:00Z' };
  doc.judge = reviewerJudge({ resolvedAfterFinalReview: [{ ...entry, rechecked: { by: '執行長第③關', at: '2026-10-02' } }] });
  assert.deepEqual(checkA1(doc, { requireJudge: true }), []);
  doc.judge.resolvedAfterFinalReview[0].rechecked = { by: '執行長第③關' };
  const errors = checkA1(doc);
  assert.ok(errors.length > 0 && errors.every((e) => e.code === 'SCHEMA'));
});
