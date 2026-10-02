// recheck-rejected CLI：檢查器修正後，以目前規則重判「已判題」的退件檔；通過的移到合格目錄，不打 API。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../scripts/recheck-rejected.mjs', import.meta.url));
const sample = () => JSON.parse(readFileSync(new URL('./fixtures/items/a1-u01-l01.json', import.meta.url), 'utf8'));
const goodVerdicts = { 'a1-u01-l01-q10': [0], 'a1-u01-l01-q13': [0], 'a1-u01-l01-q14': [1], 'a1-u01-l01-q15#0': [1], 'a1-u01-l01-q15#1': [2] };

test('重判：通過的退件檔移到合格目錄；仍有錯的、未判題的留在退件', () => {
  const dir = mkdtempSync(join(tmpdir(), 'recheck-'));
  try {
    mkdirSync(join(dir, '_rejected'), { recursive: true });
    const pass = { ...sample(), attempt: 3, judge: { model: 'x/y:free', promptVersion: 'judge-mcq.v1', verdicts: goodVerdicts } };
    writeFileSync(join(dir, '_rejected', 'a1-u01-l01.json'), JSON.stringify(pass));
    const fail = { ...sample(), lessonId: 'a1-u01-l02', judge: { model: 'x/y:free', promptVersion: 'judge-mcq.v1', verdicts: goodVerdicts } };
    writeFileSync(join(dir, '_rejected', 'a1-u01-l02.json'), JSON.stringify(fail));
    const r = spawnSync(process.execPath, [cli, '--dir', dir], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /a1-u01-l01\t通過 → 合格/);
    assert.match(r.stdout, /a1-u01-l02\t仍退件/);
    assert.ok(existsSync(join(dir, 'a1', 'a1-u01-l01.json')));
    assert.ok(!existsSync(join(dir, '_rejected', 'a1-u01-l01.json')));
    assert.ok(existsSync(join(dir, '_rejected', 'a1-u01-l02.json')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
