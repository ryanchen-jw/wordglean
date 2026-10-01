// 課綱 validator：結構層（JSON Schema）＋語意層（跨檔對照 lexicon 與 topics）。
// 規則表見 docs/pending/2026-10-01-curriculum-skeleton/proposal.md。

import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { headwordLevels } from './lexicon.mjs';
import { LESSON_MAX_WORDS, LESSON_MIN_WORDS, LEVELS, lessonCount } from './rules.mjs';

const loadSchema = (name) =>
  JSON.parse(readFileSync(new URL(`../../schema/${name}`, import.meta.url), 'utf8'));

const ajv = new Ajv2020({ allErrors: true });
const checkLevelSchema = ajv.compile(loadSchema('curriculum-level.schema.json'));
const checkTopicsSchema = ajv.compile(loadSchema('topics.schema.json'));
const checkWordTopicsSchema = ajv.compile(loadSchema('word-topics.schema.json'));

function schemaErrors(check, data, basePath) {
  if (check(data)) return [];
  return check.errors.map((e) => ({
    code: 'SCHEMA',
    path: `${basePath}${e.instancePath}`,
    message: e.message,
  }));
}

export function validateTopics(topics) {
  const errors = schemaErrors(checkTopicsSchema, topics, 'topics');
  if (errors.length) return errors;

  const seen = new Set();
  topics.topics.forEach((topic, i) => {
    if (seen.has(topic.id)) {
      errors.push({ code: 'DUPLICATE_ID', path: `topics/topics/${i}`, message: `主題 id 重複：${topic.id}` });
    }
    seen.add(topic.id);
  });
  for (const [level, ids] of Object.entries(topics.levels)) {
    ids.forEach((id, i) => {
      if (!seen.has(id)) {
        errors.push({ code: 'UNKNOWN_TOPIC', path: `topics/levels/${level}/${i}`, message: `未定義的主題：${id}` });
      }
    });
  }
  return errors;
}

// 字→主題分類檔：每字只分一次、放在自己的級距、主題列在該級、該級每字都有分類、每個主題的字數切得出 6–10 字的小課。
export function validateWordTopics(wordTopics, lexicon, topics) {
  const errors = schemaErrors(checkWordTopicsSchema, wordTopics, 'wordTopics');
  errors.push(...validateTopics(topics));
  if (errors.length) return errors;

  const wordLevel = headwordLevels(lexicon);
  const seenAt = new Map();
  for (const [level, byTopic] of Object.entries(wordTopics.levels)) {
    for (const [topic, words] of Object.entries(byTopic)) {
      const topicPath = `wordTopics/levels/${level}/${topic}`;
      if (!topics.levels[level].includes(topic)) {
        errors.push({ code: 'UNKNOWN_TOPIC', path: topicPath, message: `${level} 未列主題：${topic}` });
      }
      if (lessonCount(words.length) === null) {
        errors.push({
          code: 'TOPIC_SIZE',
          path: topicPath,
          message: `${words.length} 字切不出每課 ${LESSON_MIN_WORDS}–${LESSON_MAX_WORDS} 字的小課`,
        });
      }
      words.forEach((word, i) => {
        const path = `${topicPath}/${i}`;
        if (seenAt.has(word)) {
          errors.push({ code: 'DUPLICATE_INTRO', path, message: `「${word}」已分類於 ${seenAt.get(word)}` });
          return;
        }
        seenAt.set(word, topicPath);
        const expected = wordLevel.get(word);
        if (expected === undefined) {
          errors.push({ code: 'UNKNOWN_WORD', path, message: `「${word}」不是 lexicon 中有級距的 headword` });
        } else if (expected !== level) {
          errors.push({ code: 'LEVEL_MISMATCH', path, message: `「${word}」屬 ${expected}，不應分類在 ${level}` });
        }
      });
    }
  }
  for (const [word, level] of wordLevel) {
    if (LEVELS.includes(level) && !seenAt.has(word)) {
      errors.push({ code: 'MISSING_WORD', path: level, message: `${level} 的「${word}」沒有主題分類` });
    }
  }
  return errors;
}

export function validateCurriculum(levels, lexicon, topics) {
  const errors = [];
  levels.forEach((doc, i) => errors.push(...schemaErrors(checkLevelSchema, doc, `levels/${i}`)));
  errors.push(...validateTopics(topics));
  if (errors.length) return errors;

  const wordLevel = headwordLevels(lexicon);
  const topicLevels = topics.levels;
  const seenIds = new Set();
  const introducedAt = new Map();

  const checkId = (id, path) => {
    if (seenIds.has(id)) errors.push({ code: 'DUPLICATE_ID', path, message: `ID 重複：${id}` });
    seenIds.add(id);
  };

  levels.forEach((doc, li) => {
    const levelPath = `levels/${li}`;
    checkId(doc.level, levelPath);
    const prefix = doc.level.toLowerCase();

    doc.units.forEach((unit, ui) => {
      const unitPath = `${levelPath}/units/${ui}`;
      checkId(unit.id, unitPath);
      if (!unit.id.startsWith(`${prefix}-`)) {
        errors.push({ code: 'ID_MISMATCH', path: unitPath, message: `單元 ${unit.id} 不屬於 ${doc.level}` });
      }
      if (!topicLevels[doc.level].includes(unit.topic)) {
        errors.push({ code: 'UNKNOWN_TOPIC', path: unitPath, message: `${doc.level} 未列主題：${unit.topic}` });
      }

      unit.lessons.forEach((lesson, si) => {
        const lessonPath = `${unitPath}/lessons/${si}`;
        checkId(lesson.id, lessonPath);
        if (!lesson.id.startsWith(`${unit.id}-`)) {
          errors.push({ code: 'ID_MISMATCH', path: lessonPath, message: `小課 ${lesson.id} 不屬於 ${unit.id}` });
        }
        const n = lesson.words.length;
        if (n < LESSON_MIN_WORDS || n > LESSON_MAX_WORDS) {
          errors.push({
            code: 'LESSON_SIZE',
            path: lessonPath,
            message: `${lesson.id} 有 ${n} 字，應為 ${LESSON_MIN_WORDS}–${LESSON_MAX_WORDS}`,
          });
        }

        lesson.words.forEach((word, wi) => {
          const wordPath = `${lessonPath}/words/${wi}`;
          if (introducedAt.has(word)) {
            errors.push({
              code: 'DUPLICATE_INTRO',
              path: wordPath,
              message: `「${word}」已在 ${introducedAt.get(word)} 引入`,
            });
            return;
          }
          introducedAt.set(word, lesson.id);
          const expected = wordLevel.get(word);
          if (expected === undefined) {
            errors.push({ code: 'UNKNOWN_WORD', path: wordPath, message: `「${word}」不是 lexicon 中有級距的 headword` });
          } else if (expected !== doc.level) {
            errors.push({
              code: 'LEVEL_MISMATCH',
              path: wordPath,
              message: `「${word}」屬 ${expected}，不應出現在 ${doc.level}`,
            });
          }
        });
      });
    });
  });

  for (const [word, level] of wordLevel) {
    if (LEVELS.includes(level) && !introducedAt.has(word)) {
      errors.push({ code: 'MISSING_WORD', path: level, message: `${level} 的「${word}」未被任何小課引入` });
    }
  }
  return errors;
}
