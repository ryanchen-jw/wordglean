// 量測腳本：一次只跑一個情境（由 tests/run-segments.mjs 逐段呼叫），每個情境跑完立即寫
// results/<project>/<情境>.json——被中止也只丟當段。OS 行程記憶體在背景取樣取峰值；
// 系統空閒記憶體 < 1.2 GB 或本量測行程合計 > 3 GB 時先存下頁內數據再關分頁，該段標記 abortedLowMemory。
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { startSampler, sampleOnce } from './procmem.js';

test.describe.configure({ mode: 'serial' });

let context;
let meta;

test.beforeAll(async ({ browser }, info) => {
  meta = { project: info.project.name, browserVersion: browser.version() };
  context = await browser.newContext(info.project.use);
});

test.afterAll(async () => {
  await context?.close();
});

const grab = (page) => page.evaluate(async () => ({ metrics: window.__metrics, mem: await window.poc.memory() }));

// 跑一個情境：開分頁 → fn(page) → 收集 __metrics、頁內記憶體、行程峰值、是否崩潰 → 落檔
async function scenario(name, query, fn) {
  const page = await context.newPage();
  let crashed = false;
  let lowData = null;
  page.on('crash', () => (crashed = true));
  const baseline = await sampleOnce().catch(() => null);
  const stop = startSampler({
    onLow: async () => {
      lowData = await grab(page).catch(() => null);
      await page.close().catch(() => {});
    },
  });
  const t0 = Date.now();
  let error = null;
  try {
    await page.goto(`/?${query}`);
    await fn(page);
  } catch (e) {
    error = String(e.message || e).slice(0, 2000);
  }
  const procPeak = await stop();
  const pageData = lowData || (crashed || page.isClosed() ? null : await grab(page).catch(() => null));
  await page.close().catch(() => {});
  const result = { ...meta, scenario: name, finishedAt: new Date().toISOString(), query, wallMs: Date.now() - t0, crashed, error, baseline, procPeak, ...pageData };
  mkdirSync(`results/${meta.project}`, { recursive: true });
  writeFileSync(`results/${meta.project}/${name}.json`, JSON.stringify(result, null, 1));
  // 被記憶體閘門中止的段落一律判失敗，讓 run-segments 記為未完成、下次重跑
  if (procPeak?.abortedLowMemory) throw new Error(`記憶體閘門中止：${procPeak.abortReason}`);
  return result;
}

const call = (page, expr) => page.evaluate(expr);

test('A. 只載 Kokoro q8（冷下載＋暖載入＋合成）', async () => {
  const r = await scenario('A_tts_q8_cold', 'device=auto&ttsDtype=q8&workers=1', async (page) => {
    await call(page, () => window.poc.loadTts());
    await call(page, () => window.poc.speak('Could you tell me how to get to the train station, please?'));
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
    await call(page, () => window.poc.speak('She has been studying English for three years.'));
  });
  expect(r.error).toBeNull();
  const w = await scenario('A2_tts_q8_warm', 'device=auto&ttsDtype=q8&workers=1', async (page) => {
    await call(page, () => window.poc.loadTts());
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
  });
  expect(w.error).toBeNull();
});

test('B. 只載 Moonshine tiny（範本 dtype，10 句真人錄音）', async () => {
  const r = await scenario('B_stt_template', 'device=auto&sttDtype=template&workers=1', async (page) => {
    await call(page, () => window.poc.loadStt());
    await call(page, () => window.poc.runFixtures());
  });
  expect(r.error).toBeNull();
});

// 對照組：規格估的「約 28 MB」全 q8 版本，比體積與正確率的取捨
test('B2. 只載 Moonshine tiny 全 q8（10 句真人錄音）', async () => {
  const q = await scenario('B2_stt_q8', 'device=auto&sttDtype=q8&workers=1', async (page) => {
    await call(page, () => window.poc.loadStt());
    await call(page, () => window.poc.runFixtures());
  });
  expect(q.error).toBeNull();
});

test('C. 兩者同時載入（各一支 worker）', async () => {
  const r = await scenario('C_both_q8_2workers', 'device=auto&ttsDtype=q8&sttDtype=template&workers=2', async (page) => {
    await call(page, () => Promise.all([window.poc.loadTts(), window.poc.loadStt()]));
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
    await call(page, () => window.poc.runFixtures());
    await call(page, () => window.poc.speak('Both models are loaded now.'));
  });
  expect(r.crashed).toBe(false);
});

test('D. 兩者同時載入（共用一支 worker）', async () => {
  const r = await scenario('D_both_q8_1worker', 'device=auto&ttsDtype=q8&sttDtype=template&workers=1', async (page) => {
    await call(page, () => window.poc.loadTts());
    await call(page, () => window.poc.loadStt());
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
    await call(page, () => window.poc.runFixtures());
  });
  expect(r.crashed).toBe(false);
});

test('E. 強制 WASM 後備（兩者同時）', async () => {
  const r = await scenario('E_both_q8_wasm', 'device=wasm&ttsDtype=q8&sttDtype=template&workers=2', async (page) => {
    await call(page, () => Promise.all([window.poc.loadTts(), window.poc.loadStt()]));
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
    await call(page, () => window.poc.runFixtures());
  });
  expect(r.crashed).toBe(false);
});

test('F. Kokoro fp32（WebGPU 建議設定）＋Moonshine', async () => {
  const r = await scenario('F_both_fp32', 'device=auto&ttsDtype=fp32&sttDtype=template&workers=2', async (page) => {
    await call(page, () => Promise.all([window.poc.loadTts(), window.poc.loadStt()]));
    await call(page, () => window.poc.speak('Could you tell me how to get to the train station, please?'));
    await call(page, () => window.poc.speak('I would like a cup of coffee.'));
  });
  expect(r.crashed).toBe(false);
});

test('G. 麥克風錄音路徑（chromium 假麥克風）', async ({ browserName }) => {
  test.skip(browserName !== 'chromium', 'webkit 無假麥克風選項');
  const r = await scenario('G_mic_fake', 'device=auto&sttDtype=template&workers=1', async (page) => {
    await call(page, () => window.poc.loadStt());
    await page.click('summary');
    await page.click('#btnRecord');
    await page.waitForTimeout(4500); // 測試音檔約 3.3 秒
    await page.click('#btnRecord');
    await page.waitForFunction(() => window.__metrics.events.some((e) => e.kind === 'sttRecognize'), null, { timeout: 120000 });
  });
  expect(r.error).toBeNull();
});
