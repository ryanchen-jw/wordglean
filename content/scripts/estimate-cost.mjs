// 用法：node scripts/estimate-cost.mjs [--prices <定價快照>] [--out <markdown 檔>]
// 成本估算（proposal「成本估算方法」）：
// - 輸入 token：對每一課實際組出產題 prompt 後估算；判題輸入以手寫樣本課組出的判題 prompt 估算。
// - 輸出 token：手寫樣本課（A1–A2 用 a1-u01-l01、B1–C1 用 b1-u01-l01）的模型輸出 JSON，
//   拆成「單字卡平均每張」＋「其他題」，依每課實際字數組合。
// - token 估算法見 lib/pricing.mjs（ASCII／4＋非 ASCII×1）；真打後以帳本實數校正。

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { MAX_TOKENS } from './lib/generate.mjs';
import { CONTENT_ROOT, loadCheckContext } from './lib/items-context.mjs';
import { buildGenMessages, buildJudgeMessages } from './lib/prompts.mjs';
import { callCost, estimateTokens, loadPrices, messagesTokens } from './lib/pricing.mjs';

const { values } = parseArgs({
  options: {
    prices: { type: 'string', default: resolve(CONTENT_ROOT, 'pricing/openrouter-2026-10-01.json') },
    out: { type: 'string' },
  },
});

const GEN_MODELS = ['anthropic/claude-sonnet-5.5', 'google/gemini-3.8-flash', 'openai/gpt-6-luna'];
// 判題＝與產題不同家族的便宜模型（proposal 決策 2）。
const JUDGE_FOR = {
  'anthropic/claude-sonnet-5.5': 'openai/gpt-6-luna',
  'google/gemini-3.8-flash': 'openai/gpt-6-luna',
  'openai/gpt-6-luna': 'google/gemini-3.8-flash',
};
const REASONING_FACTOR = 1.5; // 推理 token 緩衝：輸出×1.5（假設，pilot 後校正）
const REGEN_FACTOR = 1.25; // 全量重產緩衝：首輪 20% 不合格、重產最多 2 次（假設）
// 輸出速度假設（token／秒），僅供時間粗估；pilot 帳本有每次 durationMs 可校正。
const THROUGHPUT = { 'anthropic/claude-sonnet-5.5': 60, 'google/gemini-3.8-flash': 150, 'openai/gpt-6-luna': 150 };

const prices = loadPrices(values.prices);
const ctx = loadCheckContext();
const lessons = [...ctx.lessons.values()];
const sample = (name) => JSON.parse(readFileSync(resolve(CONTENT_ROOT, `test/fixtures/items/${name}.json`), 'utf8'));

// 樣本課的輸出 token：模型輸出不含題號，以 2 格縮排 JSON 估。
function outputModel(doc) {
  const body = (items) => JSON.stringify({ properNouns: doc.properNouns, items: items.map(({ id, ...r }) => r) }, null, 2);
  const cards = doc.items.filter((it) => it.type === 'wordCard');
  const others = doc.items.filter((it) => it.type !== 'wordCard');
  const perCard = (estimateTokens(body(doc.items)) - estimateTokens(body(others))) / cards.length;
  return { perCard, others: estimateTokens(body(others)) };
}
const BANDS = {
  low: { sample: sample('a1-u01-l01'), levels: ['A1', 'A2'] },
  high: { sample: sample('b1-u01-l01'), levels: ['B1', 'B2', 'C1'] },
};
for (const band of Object.values(BANDS)) {
  band.output = outputModel(band.sample);
  band.judgeIn = messagesTokens(buildJudgeMessages(band.sample));
  const verdicts = {};
  for (const it of band.sample.items) {
    if (it.type === 'listenChoice' || it.type === 'mcq') verdicts[it.id] = [it.answer];
    if (it.type === 'reading') it.questions.forEach((q, k) => (verdicts[`${it.id}#${k}`] = [q.answer]));
  }
  band.judgeOut = estimateTokens(JSON.stringify({ verdicts }, null, 2));
}
const bandOf = (lesson) => (BANDS.low.levels.includes(lesson.level) ? BANDS.low : BANDS.high);

function lessonTokens(lesson) {
  const band = bandOf(lesson);
  return {
    genIn: messagesTokens(buildGenMessages(lesson, ctx)),
    genOut: Math.round(band.output.others + band.output.perCard * lesson.words.length),
    judgeIn: band.judgeIn,
    judgeOut: band.judgeOut,
  };
}

function plan(set, genModel, judgeModel) {
  const t = set.map(lessonTokens).reduce(
    (a, x) => ({ genIn: a.genIn + x.genIn, genOut: a.genOut + x.genOut, judgeIn: a.judgeIn + x.judgeIn, judgeOut: a.judgeOut + x.judgeOut }),
    { genIn: 0, genOut: 0, judgeIn: 0, judgeOut: 0 },
  );
  const base = callCost(prices, genModel, t.genIn, t.genOut) + callCost(prices, judgeModel, t.judgeIn, t.judgeOut);
  const reasoning =
    callCost(prices, genModel, t.genIn, t.genOut * REASONING_FACTOR) +
    callCost(prices, judgeModel, t.judgeIn, t.judgeOut * REASONING_FACTOR);
  const worst = set.reduce(
    (sum, l) =>
      sum +
      callCost(prices, genModel, lessonTokens(l).genIn, MAX_TOKENS.gen) +
      callCost(prices, judgeModel, lessonTokens(l).judgeIn, MAX_TOKENS.judge),
    0,
  );
  const hours = (t.genOut * REASONING_FACTOR) / THROUGHPUT[genModel] / 3600;
  return { ...t, base, reasoning, worst, hours };
}

const usd = (n) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`;
const num = (n) => n.toLocaleString('en-US');

const pilot = lessons.filter((l) => l.unitId === 'a1-u01' || l.unitId === 'b1-u01');
const toeicUnit = [...ctx.lessons.values()].find(
  (l) => l.level === 'B1' && ctx.topics.topics.find((t) => t.id === l.topic).domain === 'toeic',
);
const compare = [ctx.lessons.get('a1-u01-l01'), toeicUnit];

const lines = [];
const p = (s = '') => lines.push(s);
p('# TASK-8 成本估算（Stage 3，未真打）');
p();
p(`> 由 \`node content/scripts/estimate-cost.mjs\` 產生。定價快照：\`${values.prices.replace(/\\/g, '/').split('/content/')[1] ?? values.prices}\`（來源 ${prices.source}，查詢時間 ${prices.fetchedAt}）。`);
p('> token 估算：ASCII 字元／4＋非 ASCII 字元×1；真打 pilot 後以帳本實數（OpenRouter 回報的 usage.cost）校正。');
p();
p('## 定價（USD／百萬 token）');
p();
p('| 模型 | 輸入 | 輸出 | batch 版輸入／輸出 |');
p('|---|---|---|---|');
for (const m of GEN_MODELS) {
  const b = prices.models[`${m}:batch`];
  p(`| \`${m}\` | ${prices.models[m].promptPerM} | ${prices.models[m].completionPerM} | ${b ? `${b.promptPerM}／${b.completionPerM}` : '—'} |`);
}
p();
p('## token 推算依據');
p();
p('| 項目 | 數值 | 依據 |');
p('|---|---|---|');
const avg = (set, key) => Math.round(set.map(lessonTokens).reduce((s, x) => s + x[key], 0) / set.length);
p(`| 產題輸入／課 | 平均 ${num(avg(lessons, 'genIn'))} | 984 課逐課組出 gen-lesson.v1 prompt 估算 |`);
for (const [name, band] of Object.entries(BANDS)) {
  p(
    `| 產題輸出／課（${band.levels.join('–')}） | 其他題 ${num(Math.round(band.output.others))}＋單字卡每張 ${Math.round(band.output.perCard)} | 手寫樣本課 \`${band.sample.lessonId}\` 的輸出 JSON |`,
  );
}
p(`| 判題輸入／課 | ${num(BANDS.low.judgeIn)}（A1–A2）、${num(BANDS.high.judgeIn)}（B1–C1） | 樣本課組出 judge-mcq.v1 prompt |`);
p(`| 判題輸出／課 | ${BANDS.low.judgeOut}（A1–A2）、${BANDS.high.judgeOut}（B1–C1） | 5 個判題鍵的 verdicts JSON |`);
p(`| 推理緩衝 | 輸出×${REASONING_FACTOR} | 三個候選皆為推理模型、推理 token 按輸出計價；送 reasoning.effort=low（假設，pilot 校正） |`);
p(`| 單次上限 | 產題 ${num(MAX_TOKENS.gen)}、判題 ${num(MAX_TOKENS.judge)} 輸出 token | \`MAX_TOKENS\`；CLI 以此算「最壞」並在超過 --budget 時拒跑 |`);
p();

p('## pilot 預估（真打 Stage 4）');
p();
p(`模型比較：每個候選產 2 課（\`${compare[0].id}\`、\`${compare[1].id}\`＝B1 第一個多益主題單元 ${compare[1].unitId}「${compare[1].unitTitleZh}」第 1 課），各配不同家族判題。pilot：A1-u01 ${pilot.filter((l) => l.level === 'A1').length} 課＋B1-u01 ${pilot.filter((l) => l.level === 'B1').length} 課＝${pilot.length} 課，用勝出模型。`);
p();
p('| 項目 | 產題／判題模型 | token 輸入／輸出（基準） | 基準 | 含推理緩衝 | 最壞（輸出打滿上限） |');
p('|---|---|---|---|---|---|');
let compareTotals = { base: 0, reasoning: 0, worst: 0 };
for (const m of GEN_MODELS) {
  const r = plan(compare, m, JUDGE_FOR[m]);
  compareTotals = { base: compareTotals.base + r.base, reasoning: compareTotals.reasoning + r.reasoning, worst: compareTotals.worst + r.worst };
  p(`| 比較 2 課 | ${m}／${JUDGE_FOR[m]} | ${num(r.genIn + r.judgeIn)}／${num(r.genOut + r.judgeOut)} | ${usd(r.base)} | ${usd(r.reasoning)} | ${usd(r.worst)} |`);
}
p(`| **比較小計** | | | **${usd(compareTotals.base)}** | **${usd(compareTotals.reasoning)}** | **${usd(compareTotals.worst)}** |`);
for (const m of GEN_MODELS) {
  const r = plan(pilot, m, JUDGE_FOR[m]);
  p(
    `| pilot 16 課（若選此模型） | ${m}／${JUDGE_FOR[m]} | ${num(r.genIn + r.judgeIn)}／${num(r.genOut + r.judgeOut)} | ${usd(r.base)} | ${usd(r.reasoning)} | ${usd(r.worst)} |`,
  );
}
const pilotSonnet = plan(pilot, GEN_MODELS[0], JUDGE_FOR[GEN_MODELS[0]]);
p();
p(
  `**pilot 合計（比較＋最貴情況 sonnet 產 16 課）**：基準 ${usd(compareTotals.base + pilotSonnet.base)}、含推理緩衝 ${usd(compareTotals.reasoning + pilotSonnet.reasoning)}、最壞 ${usd(compareTotals.worst + pilotSonnet.worst)}——上限 US$3。`,
);
p();

p('## 全量預估（TASK-9，984 課）');
p();
p(`含推理緩衝×${REASONING_FACTOR}、重產緩衝×${REGEN_FACTOR}。時間＝輸出 token ÷ 假設輸出速度（${GEN_MODELS.map((m) => `${m.split('/')[1]} ${THROUGHPUT[m]} tok/s`).join('、')}），單線依序執行；並行 N 路約除以 N。`);
p();
p('| 產題／判題模型 | token 輸入／輸出（基準） | 基準 | 含推理＋重產緩衝 | batch 價（同緩衝） | 單線時間 |');
p('|---|---|---|---|---|---|');
for (const m of GEN_MODELS) {
  const r = plan(lessons, m, JUDGE_FOR[m]);
  const bm = `${m}:batch`;
  const bj = `${JUDGE_FOR[m]}:batch`;
  const batch = prices.models[bm] && prices.models[bj]
    ? (callCost(prices, bm, r.genIn, r.genOut * REASONING_FACTOR) + callCost(prices, bj, r.judgeIn, r.judgeOut * REASONING_FACTOR)) * REGEN_FACTOR
    : null;
  p(
    `| ${m}／${JUDGE_FOR[m]} | ${num(r.genIn + r.judgeIn)}／${num(r.genOut + r.judgeOut)} | ${usd(r.base)} | ${usd(r.reasoning * REGEN_FACTOR)} | ${batch === null ? '—' : usd(batch)} | ${(r.hours * REGEN_FACTOR).toFixed(1)} 小時 |`,
  );
}
p();
p('各級課數：' + ['A1', 'A2', 'B1', 'B2', 'C1'].map((lv) => `${lv} ${lessons.filter((l) => l.level === lv).length}`).join('、') + `，共 ${lessons.length} 課。`);
p();
p('## 注意');
p();
p('- batch 版（`:batch`）為 OpenRouter 模型清單上的另一個 id、價格約半；回應時效與用法未查證，TASK-9 若要用需先小量實測。');
p('- token 估算法 2026-10-01 以 o200k_base（js-tiktoken）對兩份樣本課的輸出 JSON、產題與判題 prompt 校準：實際／估算＝0.92–1.18（見 evidence.md）；Anthropic／Google 的 tokenizer 未校準，可能再偏高。');
p('- 推理 token 比例、輸出速度皆為假設；Stage 4 pilot 帳本會有每次呼叫的實際 token、金額、耗時，屆時重算本表。');

const md = `${lines.join('\n')}\n`;
if (values.out) writeFileSync(values.out, md);
process.stdout.write(md);
