// 用法：node scripts/build-review.mjs [--out <html>] [--lessons a1-u01,b1-u01] [--rounds <review-rounds.json>]
// 產生 G5 抽審頁（只寫檔、不發佈）。新流程（創辦人 G5 裁示 2026-10-02）：開發端 Claude 撰寫 → 檢查器 → 獨立審題員（多輪）。
// 每課一版：題目（人讀版）＋審題結果（各輪摘要、最終審後修正）＋「通過／退回＋備註」。
// 保存介面：資料放 window.__ITEM_ROWS__；按「保存」呼叫 window.onSave(rows)（由發佈端接上）。

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { blockingErrors, checkLessonItems } from './lib/check-items.mjs';
import { CONTENT_ROOT, DEFAULT_PATHS, loadCheckContext } from './lib/items-context.mjs';

const pilotDir = resolve(CONTENT_ROOT, '../docs/pending/2026-10-01-item-bank-pilot');
const { values } = parseArgs({
  options: {
    out: { type: 'string', default: join(pilotDir, 'review.html') },
    lessons: { type: 'string', default: 'a1-u01,b1-u01' },
    rounds: { type: 'string', default: join(pilotDir, 'review-rounds.json') },
  },
});

const ctx = loadCheckContext();
const readJson = (f) => JSON.parse(readFileSync(f, 'utf8'));
const rounds = existsSync(values.rounds) ? readJson(values.rounds) : {};
const unitIds = values.lessons.split(',');
// resolvedAfterFinalReview 分三類：第③關複審通過（rechecked）、第③關裁示修正（message 前綴）、其餘＝最終審後修正未再複審。
const GATE3 = '執行長第③關裁示修正';
function splitResolved(doc) {
  const all = doc.judge?.resolvedAfterFinalReview ?? [];
  return {
    rechecked: all.filter((r) => r.rechecked),
    gate3: all.filter((r) => !r.rechecked && r.message.startsWith(GATE3)),
    unchecked: all.filter((r) => !r.rechecked && !r.message.startsWith(GATE3)),
  };
}
const lessons = [...ctx.lessons.values()].filter((l) => unitIds.includes(l.unitId) || unitIds.includes(l.id));

const data = lessons.map((lesson) => {
  const file = join(DEFAULT_PATHS.items, lesson.level.toLowerCase(), `${lesson.id}.json`);
  if (!existsSync(file)) return { lesson, doc: null, errors: [], status: { key: 'none', label: '未撰寫' } };
  const doc = readJson(file);
  const errors = blockingErrors(checkLessonItems(doc, { ...ctx, lesson, requireJudge: true }));
  const { unchecked, gate3 } = splitResolved(doc);
  let status;
  if (errors.length) status = { key: 'bad', label: `檢查未過（${errors.length}）` };
  else if (unchecked.length) status = { key: 'resolved', label: '審題通過・含最終審後修正（未再複審）' };
  else if (gate3.length) status = { key: 'gate3', label: '審題通過・含第③關裁示修正' };
  else status = { key: 'ok', label: '審題通過' };
  return { lesson, doc, errors, status };
});

// ---- HTML ----
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const opts = (options, answer) =>
  `<ol class="opts">${options.map((o, i) => `<li class="${i === answer ? 'right' : ''}">${esc(o)}${i === answer ? ' <span class="tag">答案</span>' : ''}</li>`).join('')}</ol>`;
const withGloss = (it) => (it.optionGlossZh ? it.options.map((o, k) => `${o}（${it.optionGlossZh[k] ?? ''}）`) : it.options);

function renderItem(it) {
  switch (it.type) {
    case 'wordCard':
      return `<tr><td class="w en">${esc(it.word)}</td><td><span class="en">${esc(it.exampleEn)}</span><br>${esc(it.exampleZh)}<br><span class="gloss">釋義：<b>${esc(it.glossZh)}</b>　干擾：${(it.distractorsZh ?? []).map(esc).join('／')}</span></td></tr>`;
    case 'listenType':
      return `<div class="q"><b>聽音打字</b><p class="en">${esc(it.sentenceEn)}</p><p>${esc(it.sentenceZh)}</p></div>`;
    case 'shadowing':
      return `<div class="q"><b>跟讀</b><p class="en">${esc(it.sentenceEn)}</p><p>${esc(it.sentenceZh)}</p></div>`;
    case 'listenChoice':
      return `<div class="q"><b>聽音選答</b><p>音檔：<span class="en">${esc(it.audioEn)}</span></p><p>${esc(it.audioZh)}</p><p>問：${esc(it.questionZh)}</p>${opts(it.options, it.answer)}</div>`;
    case 'mcq':
      return `<div class="q"><b>選擇題</b><p class="en">${esc(it.stemEn)}</p><p>${esc(it.stemZh)}</p>${opts(withGloss(it), it.answer)}</div>`;
    case 'reading':
      return `<div class="q"><b>閱讀理解</b><p class="en passage">${esc(it.passageEn)}</p><p class="passage">${esc(it.passageZh)}</p>${it.questions
        .map((q, k) => `<p>問 ${k + 1}：${esc(q.questionZh)}</p>${opts(q.options, q.answer)}`)
        .join('')}</div>`;
    case 'translate':
      return `<div class="q"><b>中翻英</b><p>${esc(it.promptZh)}（提示字：<span class="en">${esc(it.hintWords.join(', '))}</span>）</p><p class="en">參考：${it.referenceEn.map(esc).join(' ／ ')}</p><ul class="rubric">${it.rubricZh.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`;
    case 'makeSentence':
      return `<div class="q"><b>造句</b>（<span class="en">${esc(it.targetWord)}</span>）<p>${esc(it.instructionZh)}</p><p class="en">參考：${it.referenceEn.map(esc).join(' ／ ')}</p><ul class="rubric">${it.rubricZh.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`;
    default:
      return `<div class="q">未知題型 ${esc(it.type)}</div>`;
  }
}

const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }) : '—');

function renderReview(d) {
  const lessonRounds = rounds[d.lesson.id] ?? [];
  const roundRows = lessonRounds
    .map(
      (r) => `<li><b>第 ${r.round} 輪</b>（${esc(fmtTime(r.reviewedAt))}）：選擇類 ${r.choiceQuestions} 題${r.ambiguous ? `，${r.ambiguous} 題非單一正解` : '全部單一正解'}；干擾項同義 ${r.glossSynonyms} 處；問題 ${r.issues.length} 條${
        r.issues.length ? `<ul>${r.issues.map((i) => `<li><code>${esc(i.path)}</code> ${esc(i.message)}</li>`).join('')}</ul>` : ''
      }</li>`,
    )
    .join('');
  const { rechecked, gate3, unchecked } = splitResolved(d.doc);
  const block = (title, list, who) =>
    list.length
      ? `<div class="resolved"><b>${title}</b><ul>${list
          .map((r) => `<li><code>${esc(r.path)}</code> ${who}：${esc(r.message.replace(`${GATE3}：`, ''))}<br>修正：${esc(r.resolution)}（${esc(fmtTime(r.resolvedAt))}）</li>`)
          .join('')}</ul></div>`
      : '';
  const resolvedHtml =
    block('最終審後修正、未再複審', unchecked, '審題員') +
    block(`最終審後修正（${esc(rechecked[0]?.rechecked.by ?? '')} ${esc(rechecked[0]?.rechecked.at ?? '')} 複審通過）`, rechecked, '審題員') +
    block('執行長第③關（課綱符合度審查）裁示修正', gate3, '第③關');
  const errs = d.errors.length ? `<ul class="errs">${d.errors.map((e) => `<li><code>${esc(e.code)}</code> ${esc(e.path)}：${esc(e.message)}</li>`).join('')}</ul>` : '';
  return `<section class="review"><h3>審題紀錄</h3>${roundRows ? `<ul class="rounds">${roundRows}</ul>` : '<p>無審題紀錄。</p>'}${resolvedHtml}${errs}</section>`;
}

function renderLesson(d, i) {
  const id = esc(d.lesson.id);
  const head = `<summary><span class="lid">${id}</span><span class="st st-${d.status.key}">${esc(d.status.label)}</span><span class="words en">${esc(d.lesson.words.join(', '))}</span></summary>`;
  if (!d.doc) return `<details class="lesson" id="${id}">${head}<p class="pad">尚未撰寫。</p></details>`;
  const cards = d.doc.items.filter((it) => it.type === 'wordCard');
  const rest = d.doc.items.filter((it) => it.type !== 'wordCard');
  return `<details class="lesson" id="${id}"${i === 0 ? ' open' : ''}>${head}
<div class="decide">
  <label><input type="radio" name="dec-${id}" id="ok-${id}" value="通過"> 通過</label>
  <label><input type="radio" name="dec-${id}" id="back-${id}" value="退回"> 退回</label>
  <input type="text" id="note-${id}" placeholder="備註（例：第 3 題選項 B 也對）" aria-label="${id} 備註">
</div>
<div class="body">
${renderReview(d)}
<section class="items"><h3>題目（${d.doc.items.length} 題，撰寫 ${esc(fmtTime(d.doc.authoredAt))}）</h3>
<table class="cards"><tbody>${cards.map(renderItem).join('')}</tbody></table>${rest.map(renderItem).join('')}</section>
</div>
</details>`;
}

const counts = data.reduce((m, d) => ((m[d.status.key] = (m[d.status.key] ?? 0) + 1), m), {});
const totalItems = data.reduce((n, d) => n + (d.doc?.items.length ?? 0), 0);
const allRounds = Object.values(rounds).flat();
const issuesByRound = [1, 2, 3].map((n) => allRounds.filter((r) => r.round === n).reduce((k, r) => k + r.issues.length, 0));
const totalLessons = ctx.lessons.size;
const sumBy = (k) => data.reduce((n, d) => n + (d.doc ? splitResolved(d.doc)[k].length : 0), 0);
const totalRechecked = sumBy('rechecked');
const totalGate3 = sumBy('gate3');
const totalUnchecked = sumBy('unchecked');
const topicRows = ctx.topics.topics.map((t) => `<tr><td>${esc(t.titleZh)}</td><td>${esc(t.domain)}</td><td>${esc(t.scope)}</td></tr>`).join('');
const rows = data.map((d) => ({ lessonId: d.lesson.id, unitId: d.lesson.unitId, status: d.status.key, decision: '', note: '' }));

const html = `<title>題庫 Pilot 抽審</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600&family=Noto+Sans+TC:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* 版面：單欄審閱流——頂部流程與時程、待裁示，下方每課一個可展開區塊（審題紀錄在前、題目在後） */
:root{
  --bg:#f5f7f9; --surface:#ffffff; --ink:#18232e; --muted:#5b6b7a; --line:#d8e0e7;
  --accent:#1f6f8b; --good:#2f7d4f; --warn:#a86a12; --bad:#b03a3a; --tint:#e8f1f5;
  --zh:"Noto Sans TC",system-ui,sans-serif; --en:"Literata",Georgia,serif; --mono:"IBM Plex Mono",ui-monospace,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#0f161c; --surface:#16212a; --ink:#e3eaf0; --muted:#94a6b5; --line:#2a3a46;
  --accent:#6cb7d1; --good:#6cc28e; --warn:#e0a44a; --bad:#ec7d7d; --tint:#1b2d38; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0f161c; --surface:#16212a; --ink:#e3eaf0; --muted:#94a6b5; --line:#2a3a46;
  --accent:#6cb7d1; --good:#6cc28e; --warn:#e0a44a; --bad:#ec7d7d; --tint:#1b2d38; color-scheme:dark}
body{background:var(--bg);color:var(--ink);font-family:var(--zh);font-size:15px;line-height:1.6}
.wrap{max-width:980px;margin:0 auto;padding-inline:16px;padding-block:24px 96px;display:grid;gap:20px}
h1,h2,h3{text-wrap:balance;margin:0}
h1{font-size:1.6rem} h2{font-size:1.15rem} h3{font-size:1rem;color:var(--muted);letter-spacing:.02em}
.lede{color:var(--muted);margin:4px 0 0}
.panel{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px;display:grid;gap:10px;min-width:0}
.panel ul,.panel ol{margin:0;padding-left:20px}
.tbl{overflow-x:auto} table{border-collapse:collapse;width:100%} th,td{border-top:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{font-weight:600;color:var(--muted);font-size:.85rem;letter-spacing:.02em}
.num{font-variant-numeric:tabular-nums;font-family:var(--mono);white-space:nowrap}
.flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0;padding:0;list-style:none}
.flow li{background:var(--tint);border-radius:4px;padding:2px 10px}
.flow li+li::before{content:"→";margin-right:8px;color:var(--muted)}
.stats{display:flex;flex-wrap:wrap;gap:8px}
.st{font-size:.8rem;padding:1px 8px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}
.st-ok,.st-gate3{color:var(--good)} .st-resolved{color:var(--warn)} .st-bad,.st-none{color:var(--bad)}
.en{font-family:var(--en)}
.lesson{background:var(--surface);border:1px solid var(--line);border-radius:8px}
.lesson>summary{cursor:pointer;padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:baseline}
.lesson>summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.lid{font-family:var(--mono);font-weight:500}
.words{color:var(--muted);font-size:.9rem;min-width:0}
.decide{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding:0 16px 12px;border-bottom:1px solid var(--line)}
.decide input[type=text]{flex:1 1 240px;min-width:0;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);font:inherit}
.body{display:grid;gap:16px;padding:16px}
.review,.items{display:grid;gap:8px;min-width:0}
.rounds{margin:0;padding-left:18px} .rounds code,.resolved code,.errs code{font-family:var(--mono);font-size:.82rem}
.resolved{border-left:3px solid var(--warn);padding:6px 12px;background:var(--tint);border-radius:0 6px 6px 0}
.resolved ul{margin:4px 0 0;padding-left:18px}
.errs{margin:0;padding-left:18px;color:var(--bad)}
.cards td{font-size:.95rem} .cards .w{white-space:nowrap;font-weight:600;width:1%}
.gloss{font-size:.88rem;color:var(--muted)}
.q{display:grid;gap:2px}.q p{margin:0}
.passage{max-width:65ch}
.opts{margin:0;padding-left:22px} .opts .right{font-weight:600}
.tag{font-size:.72rem;color:var(--good);border:1px solid currentColor;border-radius:4px;padding:0 4px;font-family:var(--zh);font-weight:400}
.rubric{margin:0;padding-left:18px;color:var(--muted)}
.pad{padding:0 16px 12px}
.savebar{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:12px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
.savebar button{font:inherit;font-weight:600;background:var(--accent);color:var(--bg);border:0;border-radius:6px;padding:8px 18px;cursor:pointer}
.savebar button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
#saveMsg{color:var(--muted);font-size:.9rem}
@media (prefers-reduced-motion: reduce){*{scroll-behavior:auto}}
</style>
<div class="wrap">
<header>
  <h1>題庫 Pilot 抽審（TASK-8，G5）</h1>
  <p class="lede">A1 第 1 單元 10 課＋B1 第 1 單元 6 課，共 ${totalItems} 題。題目由開發端 Claude 逐課撰寫，經自動檢查與三輪獨立審題。每課選「通過」或「退回」並寫備註，最後按頁底「保存」。</p>
</header>

<section class="panel">
  <h2>產題流程（2026-10-02 創辦人裁示後）</h2>
  <ol class="flow"><li>開發端 Claude 逐課撰寫</li><li>自動檢查器</li><li>獨立審題員（新 context，不看撰寫過程）</li><li>修正後只複審被改的課</li><li>執行長第③關：課綱符合度審查</li></ol>
  <ul>
    <li><b>撰寫</b>：依課綱（單元主題、本課新字）、本課可用字表與撰寫準則（題型題數、繁體台灣用語、句長、四選一釋義與干擾項）。</li>
    <li><b>自動檢查器</b>：越級字、無級距字、簡體與大陸用語、長度、選項重複、格式。16 課全數 0 錯。</li>
    <li><b>審題</b>：三輪共審 ${allRounds.length} 課次。選擇類題目各輪都判為單一正解；單字卡干擾項無一與正解同義；三輪共抓出 ${issuesByRound.reduce((a, b) => a + b, 0)} 條（各輪 ${issuesByRound.join('／')}）語言品質問題（評分要點過嚴、範文連接詞邏輯、中譯不忠實等），已全部修正。其中 ${totalRechecked} 條是最後一輪審後修正，由執行長第③關複審通過${totalUnchecked ? `；另有 ${totalUnchecked} 條最終審後修正、未再複審` : ''}。</li>
    <li><b>第③關（課綱符合度審查，執行長，2026-10-02）</b>：274 題全部通讀，另裁示修正 ${totalGate3} 處（參考答案主詞、評分要點寫死、越級詞義、干擾項合文法、感嘆詞語氣、人設與中譯，以及選擇類題的正解位置重排），於各課標示。G5 由執行長代審（2026-10-02 創辦人授權）。</li>
    <li>免費 LLM 不再用於產題，只用在使用者端即時批改。先前以免費模型產題的結果保留在 <code>archive-openrouter/</code> 供對照。</li>
  </ul>
  <div class="stats">${Object.entries({ ok: '審題通過', gate3: '含第③關裁示修正', resolved: '含最終審後修正（未複審）', bad: '檢查未過', none: '未撰寫' })
    .filter(([k]) => counts[k])
    .map(([k, label]) => `<span class="st st-${k}">${label} ${counts[k]} 課</span>`)
    .join('')}</div>
</section>

<section class="panel">
  <h2>全量 ${totalLessons} 課的時程估算（依 pilot 實測）</h2>
  <div class="tbl"><table>
    <thead><tr><th>項目</th><th>pilot 實測（16 課）</th><th>換算每課</th><th>推算 ${totalLessons} 課</th></tr></thead>
    <tbody>
      <tr><td>撰寫到檢查器 0 錯</td><td class="num">24 分鐘</td><td class="num">約 1.5 分鐘</td><td class="num">約 25 小時</td></tr>
      <tr><td>撰寫＋三輪審題與修正（端到端，含派工等待）</td><td class="num">約 2 小時 8 分</td><td class="num">約 8 分鐘</td><td class="num">約 130 小時</td></tr>
    </tbody>
  </table></div>
  <ul>
    <li><b>建議分批</b>：以單元為單位，每批約 50 課（同一級距的數個單元）：撰寫 → 檢查器 → 審題員一次審整批 → 只複審被改的課。共約 20 批。</li>
    <li>每批結束把新抓到的問題類型寫進撰寫準則，預期後面批次的審題問題會減少、端到端時間縮短。</li>
    <li>B2、C1 句子較長、可用字表較大，第一批 B2 實測後重估時程。</li>
  </ul>
</section>

<section class="panel">
  <h2>待裁示</h2>
  <ul>
    <li><b>全量做法</b>：照上方分批方式進行 TASK-9。</li>
    <li><b>課綱議題（TASK-7）</b>：多益常考字 TSL 有 30.2%（377 字）在單字表沒有級距、未排課；總課數 ${totalLessons} 決定全量時程。</li>
    <li><b>知情事項</b>：第③關裁示修正的 ${totalGate3} 處（含正解位置重排）由撰寫端修正、未再送審題員複審；各課審題紀錄中標示。</li>
  </ul>
</section>

<details class="panel">
  <summary><h2 style="display:inline">主題清單與單元粒度</h2></summary>
  <p>課綱 ${ctx.topics.topics.length} 個主題（A1–A2 只用生活與一般主題，B1 起加入多益情境）。本次 pilot 兩個單元都是「基礎常用字」（功能字），題目情境以日常生活為主。單元粒度：每課 6–10 字、每單元最多 10 課。</p>
  <div class="tbl"><table><thead><tr><th>主題</th><th>類別</th><th>範圍</th></tr></thead><tbody>${topicRows}</tbody></table></div>
</details>

${data.map(renderLesson).join('\n')}
</div>
<div class="savebar"><span id="saveMsg" role="status"></span><button type="button" id="saveBtn">保存抽審結果</button></div>
<script>
window.__ITEM_ROWS__ = ${JSON.stringify(rows)};
(function () {
  var rows = window.__ITEM_ROWS__;
  var KEY = 'task8-review-draft-v2';
  function byId(id) { return document.getElementById(id); }
  function collect() {
    rows.forEach(function (r) {
      var ok = byId('ok-' + r.lessonId), back = byId('back-' + r.lessonId), note = byId('note-' + r.lessonId);
      r.decision = ok && ok.checked ? '通過' : back && back.checked ? '退回' : '';
      r.note = note ? note.value.trim() : '';
    });
    return rows;
  }
  function restore() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { saved = null; }
    (saved || []).forEach(function (r) {
      if (r.decision === '通過' && byId('ok-' + r.lessonId)) byId('ok-' + r.lessonId).checked = true;
      if (r.decision === '退回' && byId('back-' + r.lessonId)) byId('back-' + r.lessonId).checked = true;
      if (r.note && byId('note-' + r.lessonId)) byId('note-' + r.lessonId).value = r.note;
    });
  }
  document.addEventListener('change', function () {
    try { localStorage.setItem(KEY, JSON.stringify(collect())); } catch (e) {}
  });
  byId('saveBtn').addEventListener('click', function () {
    var data = collect();
    var done = data.filter(function (r) { return r.decision; }).length;
    if (typeof window.onSave === 'function') {
      Promise.resolve(window.onSave(data)).then(function () {
        byId('saveMsg').textContent = '已保存 ' + done + '／' + data.length + ' 課的結果';
      }, function () {
        byId('saveMsg').textContent = '保存失敗，請稍後再按一次';
      });
    } else {
      byId('saveMsg').textContent = '這個頁面還沒接上保存功能；已在本機暫存 ' + done + '／' + data.length + ' 課';
    }
  });
  restore();
})();
</script>
`;

writeFileSync(values.out, html);
console.log(`寫入 ${values.out}：${data.length} 課（${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join('、')}）`);
