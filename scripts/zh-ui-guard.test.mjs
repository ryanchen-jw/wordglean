import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkZhUi, collectStrings } from './zh-ui-guard.mjs';

const codes = (text) => checkZhUi(text).map((e) => e.code);

test('台灣介面用語通過', () => {
  assert.deepEqual(codes('開始今天的學習'), []);
  assert.deepEqual(codes('金鑰只存在這支手機，不會傳到我們的伺服器'), []);
  assert.deepEqual(codes('沒有網路時，複習與已下載的課程仍可使用'), []);
});

test('豁免詞通過：單字庫、了解、查看', () => {
  assert.deepEqual(codes('單字庫還是空的'), []);
  assert.deepEqual(codes('我了解資料無法復原'), []);
  assert.deepEqual(codes('英文字都可以點，查看意思'), []);
});

test('不含中文的字串略過', () => {
  assert.deepEqual(codes('{current}／{total}'), []);
  assert.deepEqual(codes('Email'), []);
});

test('變數名稱不當成文案', () => {
  assert.deepEqual(codes('今日免費額度剩 {count} 次'), []);
});

test('簡體字 → SIMPLIFIED', () => {
  assert.ok(codes('开始学习').includes('SIMPLIFIED'));
  assert.equal(checkZhUi('开始学习').find((e) => e.code === 'SIMPLIFIED').message, '含簡體字：开学习');
});

test('大陸用語 → MAINLAND_TERM，訊息附台灣說法', () => {
  const errors = checkZhUi('請先登錄賬號再保存設置');
  const term = errors.find((e) => e.code === 'MAINLAND_TERM');
  assert.ok(term);
  assert.equal(
    term.message,
    '含大陸用語：設置（台灣用「設定」）、保存（台灣用「儲存」）、登錄（台灣用「登入」）、賬號（台灣用「帳號」）',
  );
});

test('不在手選清單、由 opencc 反查擋下的大陸用語（打開→開啟、視窗類）', () => {
  assert.deepEqual(codes('打開麥克風'), ['ZH_NOT_TW']);
});

test('題庫版豁免的「點擊、支持」在介面版會被擋', () => {
  assert.ok(codes('點擊這裡').includes('MAINLAND_TERM'));
  assert.ok(codes('需要支持 WebGPU').includes('MAINLAND_TERM'));
});

test('collectStrings：copy-table 取 rows 的 key／text', () => {
  assert.deepEqual(collectStrings({ rows: [{ key: 'a.b', text: '繼續', where: 'x' }], excluded: [] }), [['a.b', '繼續']]);
});

test('collectStrings：巢狀 zh-TW.json 攤平成點分 key，略過 _ 開頭的中繼欄位', () => {
  const json = { _status: 'approved', _pendingG3: ['nav.words'], home: { today: { start: '開始' } }, nav: { words: '單字庫' } };
  assert.deepEqual(collectStrings(json), [
    ['home.today.start', '開始'],
    ['nav.words', '單字庫'],
  ]);
});
