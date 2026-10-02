import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertSameAnswers, placeAnswers, placeRound } from '../scripts/lib/answer-placement.mjs';
import { checkAnswerPositionPatterns, checkLevelAnswerPositions, checkUnitAnswerPositions } from '../scripts/lib/check-items.mjs';

const mcq = (id, opts) => ({ id, type: 'mcq', stemEn: '____ x', options: opts, optionGlossZh: opts.map((o) => `義${o}`), answer: 0 });
const lesson = (n) => {
  const id = `b2-u99-l${String(n).padStart(2, '0')}`;
  return {
    lessonId: id,
    level: 'B2',
    items: [
      mcq(`${id}-q01`, ['a', 'b', 'c', 'd']),
      mcq(`${id}-q02`, ['e', 'f', 'g', 'h']),
      { id: `${id}-q03`, type: 'listenChoice', options: ['p', 'q', 'r'], answer: 0 },
      { id: `${id}-q04`, type: 'reading', questions: [{ options: ['甲', '乙', '丙', '丁'], answer: 0 }, { options: ['子', '丑', '寅'], answer: 0 }] },
    ],
  };
};

test('重排只換位置：正解文字、選項集合、optionGlossZh 對應不變', () => {
  const doc = lesson(1);
  const { items } = placeAnswers(doc, []);
  assertSameAnswers(doc.items, items);
  assert.equal(items[0].optionGlossZh[items[0].answer], '義a');
});

test('同一題 id 的結果可重現（sha256，不是亂數）', () => {
  const doc = lesson(2);
  assert.deepEqual(placeRound(doc.items, 0), placeRound(doc.items, 0));
  assert.notDeepEqual(placeRound(doc.items, 0), placeRound(doc.items, 1));
});

test('全部正解原本都在位置 0 的 12 課，逐課排完後四條位置規則都通過', () => {
  const done = [];
  for (let n = 1; n <= 12; n++) {
    const doc = lesson(n);
    done.push({ ...doc, items: placeAnswers(doc, done).items });
  }
  assert.deepEqual([...checkLevelAnswerPositions(done), ...checkUnitAnswerPositions(done), ...checkAnswerPositionPatterns(done)], []);
});

test('單課正解密度：300 課排完，沒有一課有 ≥4 個正解在同一位置', () => {
  for (let n = 1; n <= 300; n++) {
    const doc = { ...lesson(1), lessonId: `b2-u97-l${n}` };
    doc.items = doc.items.map((it) => ({ ...it, id: it.id.replace('b2-u99-l01', `b2-u97-l${n}`) }));
    const { items } = placeAnswers(doc, []);
    const counts = [];
    for (const it of items) {
      for (const a of it.type === 'reading' ? it.questions.map((q) => q.answer) : [it.answer]) counts[a] = (counts[a] ?? 0) + 1;
    }
    assert.ok(Math.max(...counts.filter(Boolean)) <= 3, `${doc.lessonId} 正解集中：${counts}`);
  }
});

// 只有一題 mcq 的課：用來單獨測同級／同單元規則（避開相鄰題位置差規則）
const oneMcq = (lessonId, level, answer) => ({ lessonId, level, items: [{ ...mcq(`${lessonId}-q01`, ['a', 'b', 'c', 'd']), answer }] });
// 其他課：位置 p 有 5 題、其餘 5 題分散——新課的正解若也落在 p，就變成 6／11 超過 50%
const skewedOthers = (prefix, level, p) =>
  [p, p, p, p, p, (p + 1) % 4, (p + 1) % 4, (p + 2) % 4, (p + 2) % 4, (p + 3) % 4].map((a, k) => oneMcq(`${prefix}-l${k + 10}`, level, a));

test('同級規則：會看同級其他課，正解不會落在已經過半的位置', () => {
  const doc = oneMcq('b2-u90-l01', 'B2', 0);
  const p = placeRound(doc.items, 0)[0].answer; // 第 0 輪的位置
  const others = skewedOthers('b2-u91', 'B2', p); // 別的單元、同一級
  const { items } = placeAnswers(doc, others);
  assert.notEqual(items[0].answer, p);
  assert.deepEqual(checkLevelAnswerPositions([...others, { ...doc, items }]), []);
});

test('同單元規則：會看同單元其他課（不同級時只有單元規則生效）', () => {
  const doc = oneMcq('b2-u92-l01', 'B2', 0);
  const p = placeRound(doc.items, 0)[0].answer;
  const others = skewedOthers('b2-u92', 'C1', p); // 同單元、但 level 不同，同級規則管不到
  const { items } = placeAnswers(doc, others);
  assert.notEqual(items[0].answer, p);
  assert.deepEqual(checkUnitAnswerPositions([...others, { ...doc, items }]).filter((e) => e.path === 'b2-u92'), []);
});

test('驗證器擋得住被換掉的干擾項（正解文字不變）', () => {
  const doc = lesson(4);
  const changed = placeRound(doc.items, 0).map((it) => {
    if (it.type !== 'mcq') return it;
    const k = (it.answer + 1) % 4;
    return { ...it, options: it.options.map((o, i) => (i === k ? 'zzz' : o)) };
  });
  assert.throws(() => assertSameAnswers(doc.items, changed), /選項集合改變/);
});

test('驗證器擋得住沒跟著換的選項釋義', () => {
  const doc = lesson(5);
  const stale = placeRound(doc.items, 0).map((it, i) => (it.type === 'mcq' && it.answer !== 0 ? { ...it, optionGlossZh: doc.items[i].optionGlossZh } : it));
  assert.ok(stale.some((it, i) => it.type === 'mcq' && it.optionGlossZh === doc.items[i].optionGlossZh), '測資要有正解被移動的 mcq');
  assert.throws(() => assertSameAnswers(doc.items, stale), /釋義未同步/);
});

test('驗證器擋得住被改掉的正解', () => {
  const doc = lesson(3);
  const broken = placeRound(doc.items, 0).map((it) => (it.type === 'mcq' ? { ...it, answer: (it.answer + 1) % 4 } : it));
  assert.throws(() => assertSameAnswers(doc.items, broken), /正解文字改變/);
});
