// 題庫自動檢查器：一課一檔。錯誤代碼表見 docs/pending/2026-10-01-item-bank-pilot/proposal.md。

import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { CEFR_ORDER } from './lexicon.mjs';
import { extractMultiwords, tokenize, wordLevel } from './english.mjs';
import { checkZh } from './zh-guard.mjs';
import {
  COMPOSITION,
  GLOSS_MAX_CHARS,
  LEGACY_PROMPTS,
  PASSAGE_WORDS,
  PASSAGE_ZH_MAX_CHARS,
  SENTENCE_WORDS,
  ZH_MAX_CHARS,
  countWords,
} from './item-rules.mjs';

const schema = JSON.parse(readFileSync(new URL('../../schema/lesson-items.schema.json', import.meta.url), 'utf8'));
const checkSchema = new Ajv2020({ allErrors: true }).compile(schema);

// 各題型的文字欄位：en＝要查級距的英文，sentence＝另查句長，zh＝繁中守衛。
const FIELDS = {
  wordCard: { sentence: ['exampleEn'], zh: ['exampleZh'] },
  listenType: { sentence: ['sentenceEn'], zh: ['sentenceZh'] },
  listenChoice: { sentence: ['audioEn'], en: ['options'], zh: ['audioZh', 'questionZh'] },
  shadowing: { sentence: ['sentenceEn'], zh: ['sentenceZh'] },
  mcq: { sentence: ['stemEn'], en: ['options'], zh: ['stemZh'] },
  reading: { passage: ['passageEn'], zh: ['passageZh'] },
  translate: { sentence: ['referenceEn'], en: ['hintWords'], zh: ['promptZh', 'rubricZh'] },
  makeSentence: { sentence: ['referenceEn'], en: ['targetWord'], zh: ['instructionZh', 'rubricZh'] },
};

// 選擇題類：回傳 [判題鍵, 選項, 答案, 路徑]。
function choiceQuestions(item, i) {
  if (item.type === 'listenChoice' || item.type === 'mcq') {
    return [[item.id, item.options, item.answer, `items/${i}`]];
  }
  if (item.type === 'reading') {
    return item.questions.map((q, k) => [`${item.id}#${k}`, q.options, q.answer, `items/${i}/questions/${k}`]);
  }
  return [];
}

const asList = (value) => (Array.isArray(value) ? value : [value]);

// ctx：{ lesson: {id, level, words}, levels: Map<小寫headword, CEFR>, lemmas(word)→原形[], allowlist: Set, requireJudge }
export function checkLessonItems(doc, ctx) {
  if (!checkSchema(doc)) {
    return checkSchema.errors.map((e) => ({ code: 'SCHEMA', path: e.instancePath || '/', message: e.message }));
  }
  const errors = [];
  const push = (code, path, message, extra = {}) => errors.push({ code, path, message, ...extra });
  const { lesson, levels, lemmas, allowlist = new Set(), requireJudge = false } = ctx;
  const lessonRank = CEFR_ORDER.indexOf(lesson.level);

  if (doc.lessonId !== lesson.id) push('LESSON_MISMATCH', 'lessonId', `檔內 ${doc.lessonId}≠課綱 ${lesson.id}`);
  if (doc.level !== lesson.level) push('LESSON_MISMATCH', 'level', `檔內 ${doc.level}≠課綱 ${lesson.level}`);
  const seenIds = new Set();
  doc.items.forEach((item, i) => {
    if (!item.id.startsWith(`${lesson.id}-q`)) push('LESSON_MISMATCH', `items/${i}/id`, `題號 ${item.id} 不屬於 ${lesson.id}`);
    if (seenIds.has(item.id)) push('LESSON_MISMATCH', `items/${i}/id`, `題號重複：${item.id}`);
    seenIds.add(item.id);
  });

  // 題量
  const counts = {};
  for (const item of doc.items) counts[item.type] = (counts[item.type] ?? 0) + 1;
  for (const [type, want] of Object.entries(COMPOSITION)) {
    if ((counts[type] ?? 0) !== want) push('COMPOSITION', 'items', `${type} 應為 ${want} 題，實際 ${counts[type] ?? 0}`);
  }
  const cardWords = doc.items.filter((it) => it.type === 'wordCard').map((it) => it.word);
  const missing = lesson.words.filter((w) => !cardWords.includes(w));
  const extra = cardWords.filter((w, k) => !lesson.words.includes(w) || cardWords.indexOf(w) !== k);
  if (missing.length || extra.length) {
    push('COMPOSITION', 'items', `單字卡應為該課新字各一張；缺：${missing.join(', ') || '無'}；多餘或重複：${extra.join(', ') || '無'}`);
  }

  // 用字級距
  const properNouns = new Set(doc.properNouns);
  const checkEnglish = (text, path) => {
    const { phrases, rest } = extractMultiwords(text, levels);
    const over = new Set();
    const unleveled = new Set();
    // 片語：取「片語級距」與「組成字最高級」的較低者——out of（A2）由 out、of（A1）組成，A1 課可用；
    // 組成字有任一無級距（according to 的 according）就照片語級距。
    for (const phrase of phrases) {
      const parts = phrase.split(' ').map((w) => wordLevel(w, levels, lemmas));
      const partsRank = parts.includes(null) ? Infinity : Math.max(...parts.map((l) => CEFR_ORDER.indexOf(l)));
      const rank = Math.min(CEFR_ORDER.indexOf(levels.get(phrase)), partsRank);
      if (rank > lessonRank) over.add(`${phrase}(${CEFR_ORDER[rank]})`);
    }
    const notEnglish = new Set();
    for (const word of tokenize(rest)) {
      if (/\p{Script=Han}/u.test(word)) {
        notEnglish.add(word);
        continue;
      }
      const level = wordLevel(word, levels, lemmas);
      if (level === null) {
        const isProper = properNouns.has(word) && /^[A-Z]/.test(word);
        if (!isProper && !allowlist.has(word.toLowerCase())) unleveled.add(word);
      } else if (CEFR_ORDER.indexOf(level) > lessonRank) {
        over.add(`${word}(${level})`);
      }
    }
    if (over.size) push('OVER_LEVEL', path, `超過 ${lesson.level}：${[...over].join(', ')}`);
    if (unleveled.size) push('UNLEVELED', path, `lexicon 無級距：${[...unleveled].join(', ')}`);
    if (notEnglish.size) push('NOT_ENGLISH', path, `英文欄位含中文：${[...notEnglish].join('、')}`);
  };
  const checkLength = (text, path, [min, max], label) => {
    const n = countWords(text);
    if (n < min || n > max) push('LENGTH', path, `${label} ${n} 字，${lesson.level} 應為 ${min}–${max}`);
  };
  const checkZhField = (text, path, max) => {
    for (const e of checkZh(text)) push(e.code, path, e.message);
    if ([...text].length > max) push('LENGTH', path, `繁中 ${[...text].length} 字元，上限 ${max}`);
  };

  doc.items.forEach((item, i) => {
    const fields = FIELDS[item.type];
    for (const key of fields.sentence ?? []) {
      asList(item[key]).forEach((text, k) => {
        const path = Array.isArray(item[key]) ? `items/${i}/${key}/${k}` : `items/${i}/${key}`;
        checkEnglish(text, path);
        checkLength(text, path, SENTENCE_WORDS[lesson.level], '句長');
      });
    }
    for (const key of fields.passage ?? []) {
      checkEnglish(item[key], `items/${i}/${key}`);
      checkLength(item[key], `items/${i}/${key}`, PASSAGE_WORDS[lesson.level], '短文');
    }
    for (const key of fields.en ?? []) {
      asList(item[key]).forEach((text, k) => checkEnglish(text, `items/${i}/${key}${Array.isArray(item[key]) ? `/${k}` : ''}`));
    }
    for (const key of fields.zh ?? []) {
      const max = key === 'passageZh' ? PASSAGE_ZH_MAX_CHARS : ZH_MAX_CHARS;
      asList(item[key]).forEach((text, k) => checkZhField(text, `items/${i}/${key}${Array.isArray(item[key]) ? `/${k}` : ''}`, max));
    }
    if (item.type === 'reading') {
      item.questions.forEach((q, k) => {
        checkZhField(q.questionZh, `items/${i}/questions/${k}/questionZh`, ZH_MAX_CHARS);
        q.options.forEach((o, m) => checkZhField(o, `items/${i}/questions/${k}/options/${m}`, ZH_MAX_CHARS));
      });
    }
    if (item.type === 'mcq' && (item.stemEn.match(/_{4}/g) ?? []).length !== 1) {
      push('MCQ_OPTIONS', `items/${i}/stemEn`, '題幹須恰有一個 ____');
    }
  });

  // TASK-12 單字卡四選一欄位：v3 起必填；v1／v2 舊檔缺欄只列提示（notice）。
  const legacy = LEGACY_PROMPTS.has(doc.promptVersion);
  const normalizeGloss = (s) => s.replace(/[\s，,。、；;]/g, '');
  doc.items.forEach((item, i) => {
    if (item.type === 'wordCard') {
      for (const key of ['glossZh', 'distractorsZh']) {
        if (item[key] === undefined) {
          push('MISSING_FIELD', `items/${i}/${key}`, `單字卡缺 ${key}${legacy ? `（${doc.promptVersion} 格式，不阻擋）` : ''}`, legacy ? { notice: true } : {});
        }
      }
      if (item.glossZh !== undefined) checkZhField(item.glossZh, `items/${i}/glossZh`, GLOSS_MAX_CHARS);
      if (item.distractorsZh !== undefined) {
        item.distractorsZh.forEach((d, k) => checkZhField(d, `items/${i}/distractorsZh/${k}`, GLOSS_MAX_CHARS));
        const seen = new Set();
        const sameAsGloss = [];
        const repeated = [];
        for (const d of item.distractorsZh) {
          const n = normalizeGloss(d);
          if (item.glossZh !== undefined && n === normalizeGloss(item.glossZh)) sameAsGloss.push(d);
          else if (seen.has(n)) repeated.push(d);
          seen.add(n);
        }
        if (sameAsGloss.length || repeated.length) {
          push('DISTRACTOR_DUP', `items/${i}/distractorsZh`, `與正解相同：${sameAsGloss.join('、') || '無'}；重複：${repeated.join('、') || '無'}`);
        }
      }
    }
    if (item.type === 'mcq' && item.optionGlossZh !== undefined) {
      if (item.optionGlossZh.length !== item.options.length) {
        push('OPTION_GLOSS', `items/${i}/optionGlossZh`, `optionGlossZh ${item.optionGlossZh.length} 個，options ${item.options.length} 個`);
      } else {
        item.optionGlossZh.forEach((g, k) => checkZhField(g, `items/${i}/optionGlossZh/${k}`, GLOSS_MAX_CHARS));
      }
    }
  });

  // Claude 審題員的額外結果：干擾項與正解同義、其他審題問題（中譯不自然等）皆阻擋。
  if (doc.judge?.glossVerdicts) {
    doc.items.forEach((item, i) => {
      const picked = item.type === 'wordCard' ? doc.judge.glossVerdicts[item.word] : undefined;
      if (picked?.length) {
        push('GLOSS_SYNONYM', `items/${i}/distractorsZh`, `審題員認為干擾項 ${picked.join(', ')} 與正解「${item.glossZh}」同義`);
      }
    });
  }
  for (const issue of doc.judge?.issues ?? []) push('REVIEW_ISSUE', issue.path, `審題員：${issue.message}`);

  // 選擇題：結構與判題
  doc.items.forEach((item, i) => {
    for (const [key, options, answer, path] of choiceQuestions(item, i)) {
      const normalized = options.map((o) => o.trim().toLowerCase());
      if (new Set(normalized).size !== normalized.length) push('MCQ_OPTIONS', path, '選項重複');
      if (answer >= options.length) push('MCQ_OPTIONS', `${path}/answer`, `答案索引 ${answer} 超出 ${options.length} 個選項`);
      const verdict = doc.judge?.verdicts[key];
      if (verdict === undefined) {
        if (requireJudge) push('MCQ_UNJUDGED', path, `缺判題結果：${key}`);
        continue;
      }
      const picked = [...new Set(verdict)].sort((a, b) => a - b);
      if (picked.length > 1) {
        push('MCQ_AMBIGUOUS', path, `判題模型認為 ${picked.join(', ')} 都正確（答案 ${answer}）`);
      } else if (picked.length === 0 || picked[0] !== answer) {
        push('MCQ_WRONG_KEY', path, `判題模型選 ${picked.join(', ') || '無'}，答案 ${answer}`);
      }
    }
  });

  // 正解位置①：單課跨題型合計（mcq＋聽選＋閱讀小題），≥4 個正解在同一位置
  const lessonCounts = [];
  doc.items.forEach((item, i) => {
    for (const [, , answer] of choiceQuestions(item, i)) lessonCounts[answer] = (lessonCounts[answer] ?? 0) + 1;
  });
  const dense = Array.from(lessonCounts, (c) => c ?? 0);
  const top = Math.max(0, ...dense);
  if (top >= 4) {
    const total = dense.reduce((n, c) => n + c, 0);
    push('ANSWER_POSITION', 'items', `單課選擇類正解集中在位置 ${dense.indexOf(top)}：${top}/${total}（上限 3 個）`);
  }

  return errors;
}

// 正解位置分布：依題型統計各位置的正解數；題數 ≥minCount 且某位置佔比超過 maxShare 時回傳說明。
function answerPositionSkew(items, minCount, maxShare) {
  const byType = new Map();
  items.forEach((item, i) => {
    for (const [, , answer] of choiceQuestions(item, i)) {
      const counts = byType.get(item.type) ?? [];
      counts[answer] = (counts[answer] ?? 0) + 1;
      byType.set(item.type, counts);
    }
  });
  const out = [];
  for (const [type, counts] of byType) {
    const dense = Array.from(counts, (c) => c ?? 0);
    const total = dense.reduce((n, c) => n + c, 0);
    const top = Math.max(...dense);
    if (total >= minCount && top / total > maxShare) {
      out.push(`${type} 正解集中在位置 ${dense.indexOf(top)}：${top}/${total}（上限 ${maxShare * 100}%）`);
    }
  }
  return out;
}

// 正解位置③：同一單元跨課合計，同題型正解集中在同一位置（題數 ≥6、超過 50%）。單元＝lessonId 去掉 -lNN。
export function checkUnitAnswerPositions(docs) {
  const byUnit = new Map();
  for (const doc of docs) {
    const unit = doc.lessonId.replace(/-l\d+$/, '');
    byUnit.set(unit, [...(byUnit.get(unit) ?? []), ...doc.items]);
  }
  return [...byUnit].flatMap(([unit, items]) =>
    answerPositionSkew(items, 6, 0.5).map((msg) => ({ code: 'ANSWER_POSITION_UNIT', path: unit, message: `${unit} 全單元${msg}` })),
  );
}

// 正解位置②：同一級跨課合計，同題型正解集中在同一位置（題數 ≥6、超過 50%）。docs＝全部題目檔。
export function checkLevelAnswerPositions(docs) {
  const byLevel = new Map();
  for (const doc of docs) byLevel.set(doc.level, [...(byLevel.get(doc.level) ?? []), ...doc.items]);
  return [...byLevel].flatMap(([level, items]) =>
    answerPositionSkew(items, 6, 0.5).map((msg) => ({ code: 'ANSWER_POSITION_LEVEL', path: level, message: `${level} 全級${msg}` })),
  );
}

// 正解位置④：同一級內，課內相鄰兩題的正解位置差有固定規律（TASK-9 執行長裁示 G1）。
// 比兩組：課內 mcq 第 2 題對第 1 題、閱讀第 2 小題對第 1 小題；差＝(後−前) mod 前一題選項數。
// 樣本（課數）≥8 時，兩種情況報錯——學習者答完前一題就能縮小下一題的範圍：
//   ① 某個差值占比超過 60%；② 某個差值完全沒出現，但依均勻分布應出現 ≥5 次（例：mcq 永遠相鄰 ±1，差 0、2 從不出現）。
export function checkAnswerPositionPatterns(docs, minCount = 8, maxShare = 0.6, minExpected = 5) {
  const byLevel = new Map();
  const add = (level, kind, n, delta) => {
    const kinds = byLevel.get(level) ?? new Map();
    const entry = kinds.get(kind) ?? { n, counts: new Map() };
    entry.n = Math.max(entry.n, n);
    entry.counts.set(delta, (entry.counts.get(delta) ?? 0) + 1);
    kinds.set(kind, entry);
    byLevel.set(level, kinds);
  };
  const diff = (a, b, n) => (((b - a) % n) + n) % n;
  for (const doc of docs) {
    const mcqs = doc.items.filter((it) => it.type === 'mcq');
    if (mcqs.length >= 2) add(doc.level, 'mcq', mcqs[0].options.length, diff(mcqs[0].answer, mcqs[1].answer, mcqs[0].options.length));
    for (const it of doc.items.filter((x) => x.type === 'reading' && x.questions.length >= 2)) {
      const [q1, q2] = it.questions;
      add(doc.level, 'reading', q1.options.length, diff(q1.answer, q2.answer, q1.options.length));
    }
  }
  const out = [];
  for (const [level, kinds] of byLevel) {
    for (const [kind, { n, counts }] of kinds) {
      const total = [...counts.values()].reduce((sum, c) => sum + c, 0);
      if (total < minCount) continue;
      const label = kind === 'mcq' ? 'mcq 第 2 題對第 1 題' : '閱讀第 2 小題對第 1 小題';
      const [delta, top] = [...counts].sort((a, b) => b[1] - a[1])[0];
      const missing = Array.from({ length: n }, (_, d) => d).filter((d) => !counts.has(d));
      const dist = Array.from({ length: n }, (_, d) => `${d}:${counts.get(d) ?? 0}`).join('、');
      if (top / total > maxShare) {
        out.push({ code: 'ANSWER_POSITION_PATTERN', path: level, message: `${level} 全級${label}的正解位置差集中在 ${delta}：${top}/${total}（上限 ${maxShare * 100}%；分布 ${dist}）` });
      } else if (missing.length && total / n >= minExpected) {
        out.push({ code: 'ANSWER_POSITION_PATTERN', path: level, message: `${level} 全級${label}的正解位置差從未出現 ${missing.join('、')}（共 ${total} 課，均勻時每個差值約 ${(total / n).toFixed(1)} 次；分布 ${dist}）` });
      }
    }
  }
  return out;
}

// 會讓該課不合格的錯誤（排除 notice 提示）。
export const blockingErrors = (errors) => errors.filter((e) => !e.notice);
