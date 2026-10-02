// prompt 組裝：v3 附「本課可用字表」。期望值取 lexicon 字面值（road A2、the A1、whether B1、conference B2）。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCheckContext } from '../scripts/lib/items-context.mjs';
import { allowedWords, buildGenMessages } from '../scripts/lib/prompts.mjs';

const ctx = loadCheckContext({ allowlist: 'no-such-file.json' });
const words = (level) => new Set(allowedWords(ctx.levels, level).split(', '));

test('可用字表：A1 含 the、不含 road（A2）；B1 含 road、whether，不含 conference（B2）', () => {
  const a1 = words('A1');
  assert.ok(a1.has('the') && !a1.has('road'));
  const b1 = words('B1');
  assert.ok(b1.has('road') && b1.has('whether') && !b1.has('conference'));
});

test('v3 把可用字表放進 user 訊息、無殘留佔位符；v1／v2 不附字表', () => {
  const lesson = ctx.lessons.get('a1-u01-l01');
  const v3 = buildGenMessages(lesson, ctx, 'gen-lesson.v3');
  assert.match(v3[1].content, /ALLOWED WORD LIST \(CEFR A1;/);
  assert.ok(v3[1].content.includes(allowedWords(ctx.levels, 'A1')));
  assert.doesNotMatch(v3.map((m) => m.content).join(''), /\{\{/);
  for (const version of ['gen-lesson.v1', 'gen-lesson.v2']) {
    assert.doesNotMatch(buildGenMessages(lesson, ctx, version)[1].content, /ALLOWED WORD LIST/);
  }
});
