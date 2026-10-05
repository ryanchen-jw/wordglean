// 片語比對（scripts/lib/phrase-match.mjs）：詞形變化、可分離片語、冠詞與所有格。用真 dict 做詞形還原。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';
import { extractPhrases, hasPhrase, isPhraseForm } from '../scripts/lib/phrase-match.mjs';

const { lemmas } = loadCheckContext({ allowlist: 'no-such-file.json' });
const has = (text, phrase, separable = false) => hasPhrase(text, phrase, { lemmas, separable });

test('詞形變化：不規則過去式、-ing、第三人稱都算（gave up、giving up、gives up、looked forward to、put up with）', () => {
  for (const s of ['He gave up smoking.', 'She is giving up her job.', 'Tom never gives up.', 'I have given up.']) assert.ok(has(s, 'give up'), s);
  assert.ok(has('We looked forward to the trip.', 'look forward to'));
  assert.ok(has("I'm looking forward to seeing you.", 'look forward to'));
  assert.ok(has('She put up with the noise for years.', 'put up with'));
});

test('小品詞、介系詞只收原字：give in 不算 give up；look forward 少了 to 不算', () => {
  assert.ok(!has('He gave in at last.', 'give up'));
  assert.ok(!has('I look forward every day.', 'look forward to'));
});

test('可分離片語：受詞 1–3 字插在中間（pick it up、turn the light on、picked my little brother up）', () => {
  assert.ok(has('Please pick it up.', 'pick up', true));
  assert.ok(has('Can you turn the light on?', 'turn on', true));
  assert.ok(has('Dad picked my little brother up after school.', 'pick up', true));
  assert.ok(has('She turned on the radio.', 'turn on', true));
});

test('可分離片語：插入超過 3 字、跨子句、或片語不可分離時不算', () => {
  assert.ok(!has('Pick the big red box up.', 'pick up', true));
  assert.ok(!has('Turn left. On Monday we met.', 'turn on', true));
  assert.ok(!has('Please pick it up.', 'pick up', false));
  assert.ok(!has('She put the noise up with.', 'put up with', false));
});

test('搭配：your 代表任一所有格；插入形容詞或省略冠詞不算', () => {
  assert.ok(has('She took a photo of the lake.', 'take a photo'));
  assert.ok(has('I did my best on the test.', 'do your best'));
  assert.ok(has('They are doing their best.', 'do your best'));
  assert.ok(!has('He made an important decision.', 'make a decision'));
  assert.ok(!has('We take photos every day.', 'take a photo'));
});

test('isPhraseForm：整個字串恰為片語的詞形（mcq 正解用），多字或分離都不算', () => {
  assert.ok(isPhraseForm('gave up', 'give up', { lemmas }));
  assert.ok(isPhraseForm('looking forward to', 'look forward to', { lemmas }));
  assert.ok(!isPhraseForm('gave it up', 'give up', { lemmas }));
  assert.ok(!isPhraseForm('gave up on', 'give up', { lemmas }));
  assert.ok(!isPhraseForm('give', 'give up', { lemmas }));
});

test('extractPhrases：挖掉片語本身的字，可分離片語中間的受詞留下來照常查級距', () => {
  const r = extractPhrases('Can you turn the radio on and pick it up?', [
    { phrase: 'turn on', separable: true },
    { phrase: 'pick up', separable: true },
  ], { lemmas });
  assert.deepEqual(r.phrases.sort(), ['pick up', 'turn on']);
  assert.deepEqual(r.rest.match(/[a-z]+/gi), ['Can', 'you', 'the', 'radio', 'and', 'it']);
  // 含所有格位置的片語也挖得到（預篩不可因 your 不在句中就略過）
  assert.deepEqual(extractPhrases('She did her best.', [{ phrase: 'do your best', separable: false }], { lemmas }).phrases, ['do your best']);
});
