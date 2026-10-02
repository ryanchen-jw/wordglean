// 檢查器需要的上下文：lexicon 級距、詞形還原、白名單、小課清單。

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { headwordLevels } from './lexicon.mjs';
import { createDictLemmas } from './english.mjs';

export const CONTENT_ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const DEFAULT_PATHS = {
  lexicon: resolve(CONTENT_ROOT, '../data/lexicon/lexicon.json'),
  dict: resolve(CONTENT_ROOT, '../data/dict'),
  curriculum: resolve(CONTENT_ROOT, 'curriculum'),
  allowlist: resolve(CONTENT_ROOT, 'items/allowlist.json'),
  items: resolve(CONTENT_ROOT, 'items'),
};

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

// 小課 id → { id, level, words, unitId, topic, unitTitleZh }
export function loadLessons(curriculumDir) {
  const lessons = new Map();
  for (const name of ['a1', 'a2', 'b1', 'b2', 'c1']) {
    const file = join(curriculumDir, `${name}.json`);
    if (!existsSync(file)) continue;
    const doc = readJson(file);
    for (const unit of doc.units) {
      for (const lesson of unit.lessons) {
        lessons.set(lesson.id, {
          id: lesson.id,
          level: doc.level,
          words: lesson.words,
          unitId: unit.id,
          topic: unit.topic,
          unitTitleZh: unit.titleZh,
        });
      }
    }
  }
  return lessons;
}

// allowlist.json：{ "words": [{ "word": 小寫, "reason": 說明 }] }
export function loadAllowlist(file) {
  if (!existsSync(file)) return new Set();
  return new Set(readJson(file).words.map((w) => w.word.toLowerCase()));
}

export function loadCheckContext(paths = {}) {
  const p = { ...DEFAULT_PATHS, ...paths };
  const lexiconEntries = readJson(p.lexicon);
  return {
    lexiconEntries,
    levels: headwordLevels(lexiconEntries),
    lemmas: createDictLemmas(p.dict),
    allowlist: loadAllowlist(p.allowlist),
    lessons: loadLessons(p.curriculum),
    topics: readJson(join(p.curriculum, 'topics.json')),
  };
}
