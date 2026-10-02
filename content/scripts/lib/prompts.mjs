// 讀版本化 prompt（content/prompts/<名>.md 的 ## system／## user 兩節）並填入課程資料。

import { readFileSync } from 'node:fs';
import { CEFR_ORDER, normalizeHeadword } from './lexicon.mjs';
import { PASSAGE_WORDS, SENTENCE_WORDS } from './item-rules.mjs';

export const GEN_PROMPT = 'gen-lesson.v1';
export const JUDGE_PROMPT = 'judge-mcq.v1';

export function loadPrompt(name) {
  const text = readFileSync(new URL(`../../prompts/${name}.md`, import.meta.url), 'utf8');
  const section = (title) => {
    const match = text.match(new RegExp(`^## ${title}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
    if (!match) throw new Error(`${name}.md 缺少「## ${title}」一節`);
    return match[1].trim();
  };
  return { system: section('system'), user: section('user') };
}

export function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`prompt 變數未提供：${key}`);
    return String(vars[key]);
  });
}

// 每字的詞性與釋義：只列與該字級距相同（最低級）的詞性。
function wordList(words, lexiconEntries, level) {
  return words
    .map((word) => {
      const senses = lexiconEntries.filter((e) => normalizeHeadword(e.headword) === word && e.cefr === level);
      const detail = senses.map((e) => `${e.pos ?? '?'}: ${e.glossZh ?? '—'}`).join('; ');
      return `- ${word} / ${detail || '—'}`;
    })
    .join('\n');
}

export function allowedWords(levels, level) {
  const max = CEFR_ORDER.indexOf(level);
  return [...levels]
    .filter(([, l]) => CEFR_ORDER.indexOf(l) <= max)
    .map(([w]) => w)
    .sort()
    .join(', ');
}

// lesson：items-context 的小課物件；ctx：{ lexiconEntries, levels, topics }
export function buildGenMessages(lesson, ctx, promptName = GEN_PROMPT) {
  const prompt = loadPrompt(promptName);
  const topic = ctx.topics.topics.find((t) => t.id === lesson.topic);
  const [sentenceMin, sentenceMax] = SENTENCE_WORDS[lesson.level];
  const [passageMin, passageMax] = PASSAGE_WORDS[lesson.level];
  const vars = {
    lessonId: lesson.id,
    level: lesson.level,
    allowedLevels: CEFR_ORDER.slice(0, CEFR_ORDER.indexOf(lesson.level) + 1).join(', '),
    // v3：級距 ≤ 本課級距的所有小寫 headword（含片語），字母排序。v1／v2 模板不使用此變數。
    allowedWords: allowedWords(ctx.levels, lesson.level),
    toeicNote: topic.domain === 'toeic' ? ' (TOEIC workplace context)' : '',
    topicTitleEn: topic.titleEn,
    topicTitleZh: topic.titleZh,
    topicScope: topic.scope,
    wordList: wordList(lesson.words, ctx.lexiconEntries, lesson.level),
    wordCount: lesson.words.length,
    sentenceMin,
    sentenceMax,
    passageMin,
    passageMax,
  };
  return [
    { role: 'system', content: fill(prompt.system, vars) },
    { role: 'user', content: fill(prompt.user, vars) },
  ];
}

// 送判題的題目：不附答案。
export function judgeQuestions(doc) {
  const out = [];
  for (const item of doc.items) {
    if (item.type === 'listenChoice') {
      out.push({ key: item.id, audioTranscript: item.audioEn, question: item.questionZh, options: item.options });
    } else if (item.type === 'mcq') {
      out.push({ key: item.id, sentence: item.stemEn, options: item.options });
    } else if (item.type === 'reading') {
      item.questions.forEach((q, k) =>
        out.push({ key: `${item.id}#${k}`, passage: item.passageEn, question: q.questionZh, options: q.options }),
      );
    }
  }
  return out;
}

export function buildJudgeMessages(doc, promptName = JUDGE_PROMPT) {
  const prompt = loadPrompt(promptName);
  const vars = { questions: JSON.stringify(judgeQuestions(doc), null, 1) };
  return [
    { role: 'system', content: fill(prompt.system, vars) },
    { role: 'user', content: fill(prompt.user, vars) },
  ];
}
