import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  assertEvalModel,
  FreeOnlyError,
  scoreItem,
  summarize,
  validateSet,
} from '../scripts/lib/llm-eval.mjs'

const set = JSON.parse(readFileSync(new URL('../eval/llm-eval-set.json', import.meta.url), 'utf8'))

describe('llm-eval 題組', () => {
  it('40 句、中翻英 30＋造句 10、結構與評分規則自洽', () => {
    assert.equal(set.items.length, 40)
    assert.equal(set.items.filter((i) => i.kind === 'translate').length, 30)
    assert.equal(set.items.filter((i) => i.kind === 'makeSentence').length, 10)
    assert.deepEqual(validateSet(set), [])
  })

  it('validateSet 抓得到錯句不含錯誤點、參考答案含錯誤點、id 重複', () => {
    const bad = {
      items: [
        { ...set.items[0], answer: 'I have an apple.' },
        { ...set.items[1], referenceEn: ['She drink coffee every morning.'] },
        { ...set.items[2], id: 'ev-01' },
      ],
    }
    const errors = validateSet(bad)
    assert.ok(errors.some((e) => e.startsWith('ev-01：answer 不含 wrong')))
    assert.ok(errors.some((e) => e.startsWith('ev-02：參考答案含 wrong')))
    assert.ok(errors.some((e) => e === 'ev-01：id 重複'))
  })
})

describe(':free 硬守衛', () => {
  it('只准 :free；openrouter/free、付費模型、NVIDIA 一律拒絕', () => {
    assert.doesNotThrow(() => assertEvalModel('google/gemma-4-31b-it:free'))
    for (const m of [
      'openrouter/free',
      'anthropic/claude-sonnet-x',
      'nvidia/nemotron-3-super-120b-a12b:free',
      '',
      undefined,
    ])
      assert.throws(() => assertEvalModel(m), FreeOnlyError)
  })
})

describe('scoreItem（D4：判錯且修對才算正確）', () => {
  const ev01 = set.items.find((i) => i.id === 'ev-01') // a apple → an apple
  const graded = (isCorrect, corrected) => ({
    isCorrect,
    corrected,
    errors: [],
    explanationZh: '',
    levelOk: true,
  })

  for (const [label, parsed, want] of [
    ['修對', graded(false, 'I have an apple.'), { detected: true, fixed: true, correct: true }],
    ['大小寫不同也算', graded(false, 'I HAVE AN APPLE.'), { detected: true, fixed: true, correct: true }],
    ['沒判出錯', graded(true, 'I have a apple.'), { detected: false, fixed: false, correct: false }],
    ['判錯但沒修掉', graded(false, 'I have a apple!'), { detected: true, fixed: false, correct: false }],
    ['改成別的字（不含 fix）', graded(false, 'I have one apple.'), { detected: true, fixed: false, correct: false }],
  ])
    it(label, () => assert.deepEqual(scoreItem(ev01, parsed), { parsed: true, ...want }))

  it('解析失敗 → 全否', () => {
    assert.deepEqual(scoreItem(ev01, null), {
      parsed: false,
      detected: false,
      fixed: false,
      correct: false,
    })
  })

  it('wrong 帶尾空白：She drinks 不算殘留 She drink', () => {
    const ev02 = set.items.find((i) => i.id === 'ev-02')
    assert.equal(scoreItem(ev02, graded(false, 'She drinks coffee every morning.')).correct, true)
  })
})

describe('summarize', () => {
  it('每題取最後一筆完成紀錄；rate_limited 不計；花費加總', () => {
    const ok = (id, correct, cost = 0, latencyMs = 1000) => ({
      model: 'm:free',
      id,
      status: 'ok',
      cost,
      latencyMs,
      score: { parsed: true, detected: true, fixed: correct, correct },
    })
    const ledger = [
      { model: 'm:free', id: 'ev-01', status: 'rate_limited', latencyMs: 10 },
      ok('ev-01', false),
      ok('ev-01', true, 0, 3000),
      ok('ev-02', true, 0, 2000),
      { model: 'm:free', id: 'ev-03', status: 'error', latencyMs: 5, score: { parsed: false, detected: false, fixed: false, correct: false } },
      ok('ev-04', true, 0.0001, 1000),
      { model: 'other:free', id: 'ev-05', status: 'ok', latencyMs: 1, score: { correct: true } },
    ]
    assert.deepEqual(summarize(ledger, set, ['m:free']), [
      {
        model: 'm:free',
        total: 40,
        done: 4,
        parsed: 3,
        detected: 3,
        correct: 3,
        errors: 1,
        costUsd: 0.0001,
        medianLatencyMs: 2000,
      },
    ])
  })
})
