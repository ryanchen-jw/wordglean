// CLI 測試：exit code 與錯誤輸出。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../scripts/validate-curriculum.mjs', import.meta.url));
const lexicon = fileURLToPath(new URL('./fixtures/lexicon.json', import.meta.url));
const validDir = fileURLToPath(new URL('./fixtures/valid', import.meta.url));
const phrases = fileURLToPath(new URL('./fixtures/phrases-empty.json', import.meta.url));

const runCli = (dir) =>
  spawnSync(process.execPath, [cli, '--lexicon', lexicon, '--phrases', phrases, '--dir', dir], { encoding: 'utf8' });

test('合法目錄：exit 0、印全綠', () => {
  const r = runCli(validDir);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /檢查 2 個級距檔：全綠/);
});

function withCopy(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'curriculum-'));
  try {
    cpSync(validDir, dir, { recursive: true });
    mutate(dir);
    return runCli(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('缺級距檔：exit 1、該級的字報 MISSING_WORD', () => {
  const r = withCopy((dir) => rmSync(join(dir, 'a2.json')));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /^MISSING_WORD\tA2\t.*passport/m);
});

test('檔名與檔內 level 不符：exit 1、報 ID_MISMATCH', () => {
  const r = withCopy((dir) => {
    const a1 = readFileSync(join(dir, 'a1.json'));
    writeFileSync(join(dir, 'a1.json'), readFileSync(join(dir, 'a2.json')));
    writeFileSync(join(dir, 'a2.json'), a1);
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /^ID_MISMATCH\ta1\.json\t/m);
  assert.match(r.stderr, /^ID_MISMATCH\ta2\.json\t/m);
});

test('有錯目錄：exit 1、逐條印出錯誤代碼', () => {
  const dir = mkdtempSync(join(tmpdir(), 'curriculum-'));
  try {
    cpSync(validDir, dir, { recursive: true });
    const a2 = JSON.parse(readFileSync(join(dir, 'a2.json'), 'utf8'));
    a2.units[0].lessons[0].words.push('esoteric');
    writeFileSync(join(dir, 'a2.json'), JSON.stringify(a2));
    const r = runCli(dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /^LEVEL_MISMATCH\tlevels\/1\/units\/0\/lessons\/0\/words\/6\t/m);
    assert.match(r.stdout, /1 個錯誤/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
