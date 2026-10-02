// 正解位置：每個選擇類題位以 sha256(題位鍵) 決定位置（TASK-9 執行長裁示 G1）。
// 題位鍵＝題 id（閱讀小題為 id#k）；整課違反位置規則時改用 鍵＋"#"＋n 重抽（n＝1, 2, …），不用固定位移。
// 重抽只看本課與同級其他課：單課（ANSWER_POSITION）、同單元、同級、相鄰題位置差規律四條規則。

import { createHash } from 'node:crypto';
import { checkAnswerPositionPatterns, checkLevelAnswerPositions, checkUnitAnswerPositions } from './check-items.mjs';

const hash = (s) => parseInt(createHash('sha256').update(s).digest('hex').slice(0, 8), 16);
const swap = (arr, a, b) => {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
};

// 把正解移到 target：與 target 位置的選項互換（optionGlossZh 同步）
function moveAnswer(q, target) {
  const out = { ...q, options: swap(q.options, q.answer, target), answer: target };
  if (q.optionGlossZh) out.optionGlossZh = swap(q.optionGlossZh, q.answer, target);
  return out;
}

export function placeRound(items, round) {
  const key = (k) => (round === 0 ? k : `${k}#${round}`);
  return items.map((it) => {
    if (it.type === 'mcq' || it.type === 'listenChoice') return moveAnswer(it, hash(key(it.id)) % it.options.length);
    if (it.type === 'reading') {
      return { ...it, questions: it.questions.map((q, k) => moveAnswer(q, hash(key(`${it.id}#${k}`)) % q.options.length)) };
    }
    return it;
  });
}

function lessonTooDense(items) {
  const counts = [];
  for (const it of items) {
    const answers = it.type === 'reading' ? it.questions.map((q) => q.answer) : it.type === 'mcq' || it.type === 'listenChoice' ? [it.answer] : [];
    for (const a of answers) counts[a] = (counts[a] ?? 0) + 1;
  }
  return counts.some((n) => n >= 4);
}

// doc＝{ lessonId, level, items（含 id）}；others＝同級其他課的題目檔。回傳 { items, round }。
export function placeAnswers(doc, others, maxRounds = 200) {
  const unit = doc.lessonId.replace(/-l\d+$/, '');
  for (let round = 0; round < maxRounds; round++) {
    const items = placeRound(doc.items, round);
    const all = [...others, { ...doc, items }];
    const bad =
      lessonTooDense(items) ||
      checkUnitAnswerPositions(all).some((e) => e.path === unit) ||
      checkLevelAnswerPositions(all).length > 0 ||
      checkAnswerPositionPatterns(all).length > 0;
    if (!bad) return { items, round };
  }
  throw new Error(`${doc.lessonId}：${maxRounds} 輪內找不到符合正解位置規則的排列`);
}

// 驗證重排前後：每題的選項集合與正解文字不變、optionGlossZh 跟著正解
export function assertSameAnswers(before, after) {
  before.forEach((it, i) => {
    const pairs = it.type === 'reading' ? it.questions.map((q, k) => [q, after[i].questions[k]]) : it.type === 'mcq' || it.type === 'listenChoice' ? [[it, after[i]]] : [];
    for (const [a, b] of pairs) {
      if (a.options[a.answer] !== b.options[b.answer]) throw new Error(`${it.id} 正解文字改變`);
      if ([...a.options].sort().join('\n') !== [...b.options].sort().join('\n')) throw new Error(`${it.id} 選項集合改變`);
      if (a.optionGlossZh && a.optionGlossZh[a.answer] !== b.optionGlossZh[b.answer]) throw new Error(`${it.id} 選項釋義未同步`);
    }
  });
}
