// 乾跑用的決定性假模型：不碰網路、不需金鑰。產出只為走通整條管線（解析、判題、檢查、寫檔、記帳），
// 內容是固定句型、不代表題目品質。句子只用 A1 字，任何級距的課都能通過用字檢查。

import { PASSAGE_WORDS, compositionFor } from './item-rules.mjs';
import { estimateTokens, messagesTokens } from './pricing.mjs';

const SENTENCE = 'We read a book in class today.';
const SENTENCE_ZH = '我們今天在課堂上讀了一本書。';

function fakeLesson(lesson) {
  const words = lesson.words;
  const pick = (k) => [0, 1, 2, 3].map((j) => words[(k + j) % words.length]);
  const passageCount = Math.ceil(PASSAGE_WORDS[lesson.level][0] / 7) + 1;
  return {
    properNouns: ['Tom'],
    items: [
      ...words.map((word) => ({
        type: 'wordCard',
        word,
        exampleEn: `We read the word "${word}" in class today.`,
        exampleZh: `我們今天在課堂上讀到「${word}」這個字。`,
        glossZh: `「${word}」的意思`,
        distractorsZh: ['錯誤釋義一', '錯誤釋義二', '錯誤釋義三'],
      })),
      { type: 'listenType', sentenceEn: SENTENCE, sentenceZh: SENTENCE_ZH },
      {
        type: 'listenChoice',
        audioEn: 'Tom has a dog and a cat.',
        audioZh: 'Tom 有一隻狗和一隻貓。',
        questionZh: 'Tom 有什麼？',
        options: ['A dog and a cat', 'Two dogs', 'A cat and a bird'],
        answer: 0,
      },
      { type: 'shadowing', sentenceEn: SENTENCE, sentenceZh: SENTENCE_ZH },
      { type: 'shadowing', sentenceEn: 'Tom has a dog and a cat.', sentenceZh: 'Tom 有一隻狗和一隻貓。' },
      { type: 'mcq', stemEn: 'We read the word "____" in class today.', stemZh: SENTENCE_ZH, options: pick(0), answer: 0 },
      { type: 'mcq', stemEn: 'Tom read the word "____" in class today.', stemZh: SENTENCE_ZH, options: pick(1), answer: 1 },
      {
        type: 'reading',
        passageEn: Array(passageCount).fill(SENTENCE).join(' '),
        passageZh: SENTENCE_ZH,
        questions: [
          { questionZh: '我們今天讀了什麼？', options: ['一本書', '一封信', '一張地圖'], answer: 0 },
          { questionZh: '我們在哪裡讀？', options: ['在家', '在課堂上', '在公園'], answer: 1 },
        ],
      },
      { type: 'translate', promptZh: SENTENCE_ZH, hintWords: [words[0]], referenceEn: [SENTENCE], rubricZh: ['時態用過去式'] },
      compositionFor(lesson.level).makeSentence
        ? {
            type: 'makeSentence',
            targetWord: words[0],
            instructionZh: `用「${words[0]}」造一個句子。`,
            referenceEn: [`We read the word "${words[0]}" in class today.`],
            rubricZh: ['句子有主詞和動詞'],
          }
        : { type: 'translate', promptZh: SENTENCE_ZH, hintWords: [words[1]], referenceEn: [SENTENCE], rubricZh: ['時態用過去式'] },
    ],
  };
}

// 假判題：照題目檔的答案回答（乾跑只驗管線，不驗判題品質）。
function fakeVerdicts(doc) {
  const verdicts = {};
  for (const item of doc.items) {
    if (item.type === 'listenChoice' || item.type === 'mcq') verdicts[item.id] = [item.answer];
    if (item.type === 'reading') item.questions.forEach((q, k) => (verdicts[`${item.id}#${k}`] = [q.answer]));
  }
  return { verdicts };
}

export function createFakeClient() {
  return {
    async complete({ messages, meta }) {
      const body = meta.role === 'gen' ? fakeLesson(meta.lesson) : fakeVerdicts(meta.doc);
      const text = `\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\``;
      return {
        text,
        finishReason: 'stop',
        usage: { promptTokens: messagesTokens(messages), completionTokens: estimateTokens(text), cost: null },
        durationMs: 0,
      };
    },
  };
}
