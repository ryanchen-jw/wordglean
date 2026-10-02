// G3 定稿回寫：copy-table.json（279 列，2026-10-02 創辦人全數照推薦定稿）→ app/src/i18n/zh-TW.json。
// TASK-11 的 json 已採三層 key 且命名與總表不同，故以下 MAP 明列對照；未列者依 newKey() 規則新增。
// 用法（repo 根）：node docs/verification/2026-10-02-task4-copy-evidence/g3-apply.mjs  （可重跑：以 git 上 main 版本為底）
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const here = new URL('./', import.meta.url);
const root = new URL('../../../', here);
const JSON_PATH = 'app/src/i18n/zh-TW.json';
const table = JSON.parse(readFileSync(new URL('copy-table.json', here), 'utf8'));
// 底稿固定取 main 版本（G3 前 TASK-11／12 的草稿），重跑結果相同
const base = JSON.parse(execFileSync('git', ['show', `main:${JSON_PATH}`], { cwd: root, encoding: 'utf8' }));

// copyKey → { to: json key 或陣列, rename: {總表參數: 程式參數}, keep: 不套用的理由 }
// keep 的三種：SAME＝程式拆開渲染、顯示結果與定稿相同；CONFLICT＝定稿與程式現況不符，保留原值待裁
const SAME = (why) => ({ kind: 'same', why });
const CONFLICT = (why) => ({ kind: 'conflict', why });
const MAP = {
  'common.continue': { to: 'lesson.feedback.continue' },
  'common.check': { to: 'lesson.choice.check' },
  'common.cancel': { to: 'clearData.dialog.cancel' },
  'common.back': { to: 'common.action.back' },
  'common.exitLesson': { to: 'lesson.frame.leave' },
  'common.pronounce': { to: ['lesson.wordCard.speak', 'dict.sheet.speak'] },
  'common.level': { to: 'common.level.toeic' },
  'common.minutes': { to: ['home.due.minutes', 'course.sheet.minutes'], rename: { minutes: 'min' } },
  'common.progressAria': { to: 'lesson.frame.progress' },
  'common.correct': { to: 'lesson.feedback.right' },
  'common.answerIs': { to: 'lesson.feedback.answerIs', keep: SAME('程式把「{answer}」（英文，可點查義）接在後面另外渲染，畫面結果與定稿相同') },
  'common.dueToday': { to: 'words.due.today' },
  'common.dueInDays': { to: 'words.due.days', rename: { count: 'n' } },
  'common.dueInMonths': { to: 'words.due.months', rename: { count: 'n' } },
  'nav.today': { to: 'nav.bar.today' },
  'nav.course': { to: 'nav.bar.course' },
  'nav.words': { to: 'nav.bar.words' },
  'home.title': { to: 'home.header.title' },
  'home.settings': { to: 'home.header.settings' },
  'home.unplaced': { to: ['home.header.unplaced', 'settings.learning.unplaced'] },
  'home.today.title': { to: 'home.today.title' },
  'home.today.plan': { to: 'home.today.summaryReviewLesson', rename: { minutes: 'min' } },
  'home.today.start': { to: 'home.today.startButton' },
  'home.tile.due': { to: 'home.due.label' },
  'home.tile.next': { to: 'home.next.label' },
  'home.tile.nextMeta': { to: 'home.next.meta', rename: { minutes: 'min' } },
  'home.progress.title': { to: 'home.progress.label' },
  'home.progress.review': { to: 'home.progress.reviews' },
  'home.progress.lesson': { to: 'home.progress.lessons' },
  'home.done.title': { to: 'home.done.title' },
  'home.done.body': { to: 'home.done.tomorrow', rename: { count: 'n' } },
  'home.done.extraLesson': { to: 'home.done.extraLesson' },
  'home.paused.plan': { to: 'home.today.summaryReview', rename: { minutes: 'min' } },
  'home.paused.start': { to: 'home.today.startReview' },
  'home.paused.title': { to: 'home.paused.title' },
  'home.paused.body': { to: 'home.paused.body', rename: { limit: 'n' } },
  'home.first.title': { to: 'home.first.title' },
  'home.first.body': { to: 'home.first.body' },
  'home.first.start': { to: 'home.first.startButton' },
  'home.first.skip': { to: 'home.first.skip' },
  'course.title': { to: 'course.header.title' },
  'course.levelTabs': { to: 'course.level.tabsLabel' },
  'course.unitProgress': { to: 'course.unit.progress' },
  'course.current': { to: 'course.unit.current' },
  'course.expand': { to: 'course.unit.expand' },
  'course.detail.aria': { to: 'course.sheet.label' },
  'course.detail.newWords': { to: 'course.sheet.newWords', rename: { count: 'n' } },
  'course.detail.start': { to: 'course.sheet.startButton' },
  'lesson.name': {
    to: ['home.next.title', 'course.sheet.title', 'lesson.done.subtitle'],
    keep: CONFLICT('定稿「{topic} {number}｜{title}」需要小課名稱，但課綱資料沒有小課名（只有主題名＋第幾課），程式顯示「{unit} {n}」'),
  },
  'lesson.type.reading': { to: 'lesson.reading.type' },
  'lesson.loadError': { to: 'lesson.question.loadError' },
  'lesson.loadErrorNext': { to: 'lesson.question.loadErrorNext' },
  'lesson.exit.title': { to: 'lesson.leave.title' },
  'lesson.exit.body': {
    to: 'lesson.leave.body',
    keep: CONFLICT('定稿寫「離開後下次會從第 1 題重新開始」，但 TASK-12 已實作續作（下次從第 {next} 題繼續）；照定稿會說錯話'),
  },
  'lesson.exit.stay': { to: 'lesson.leave.stay' },
  'lesson.exit.leave': { to: 'lesson.leave.leave' },
  'lesson.done.title': { to: 'lesson.done.title' },
  'lesson.done.newWords': { to: 'lesson.done.newWords', rename: { count: 'n' } },
  'lesson.done.statsTitle': { to: 'lesson.done.summary' },
  'lesson.done.total': { to: 'lesson.done.questions', rename: { count: 'n' } },
  'lesson.done.correct': { to: 'lesson.done.correct', rename: { count: 'n' } },
  'lesson.done.wrongScheduled': { to: 'lesson.done.wrongScheduled', rename: { count: 'n' } },
  'lesson.done.home': { to: 'lesson.done.home' },
  'lesson.done.reviewAgain': { to: 'lesson.done.reviewAgain' },
  'read.mc.instruction': { to: 'lesson.mcq.type' },
  'read.showTranslation': { to: 'lesson.reading.showTranslation' },
  'card.progress': { to: 'lesson.wordCard.progress' },
  'card.instruction': { to: 'lesson.wordCard.prompt' },
  'card.exampleHint': { to: 'lesson.wordCard.hint' },
  'card.right': { to: 'lesson.wordCard.right', rename: { meaning: 'gloss' } },
  'card.wrong': { to: 'lesson.wordCard.isGloss', keep: SAME('程式先渲染英文字「{word}」（可點查義），再接「 是「{gloss}」」，畫面結果與定稿相同') },
  'words.title': { to: 'words.header.title' },
  'words.summary': { to: 'words.header.summary', rename: { count: 'total' } },
  'words.summaryEmpty': { to: 'words.header.summaryEmpty', keep: SAME('只在 0 字時顯示，json 寫死「共 0 字」與定稿 count=0 相同') },
  'words.search': { to: 'words.filter.search' }, // TASK-16 已支援中文搜尋（main 7874889），執行長裁示套用定稿
  'words.filter.all': { to: 'words.filter.all' },
  'words.filter.due': { to: 'words.filter.due' },
  'words.filter.saved': { to: 'words.filter.favorite' },
  'words.familiarity': { to: 'words.filter.familiarity', rename: { value: 'name' } },
  'words.familiarity.new': { to: 'words.filter.familiarityNew' },
  'words.familiarity.learning': { to: 'words.filter.familiarityLearning' },
  'words.familiarity.known': { to: 'words.filter.familiarityFamiliar' },
  'words.savedMark': { to: 'words.list.favorited' },
  'words.empty.title': { to: 'words.empty.title' },
  'words.empty.body': { to: 'words.empty.body' },
  'words.empty.start': { to: 'words.empty.button' },
  'settings.title': { to: 'settings.header.title' },
  'settings.learning': { to: 'settings.learning.title' },
  'settings.level': { to: 'settings.learning.level' },
  'settings.levelPicker': { to: 'settings.learning.levelSheet' },
  'settings.dailyNew': { to: ['settings.learning.dailyNew', 'settings.learning.dailyNewSheet'] },
  'settings.ai.statusNone': { to: 'settings.ai.status' },
  'settings.ai.oauth': { to: 'settings.ai.oauthButton' },
  'settings.ai.keyPrivacy': { to: 'settings.ai.privacy' },
  'settings.ai.unlinkConfirm.title': { to: 'settings.ai.unlinkConfirmTitle' },
  'settings.ai.unlinkConfirm.body': { to: 'settings.ai.unlinkConfirmBody' },
  'settings.look': { to: 'settings.appearance.title' },
  'settings.theme': { to: 'settings.appearance.theme' },
  'settings.theme.system': { to: 'settings.appearance.themeSystem' },
  'settings.theme.light': { to: 'settings.appearance.themeLight' },
  'settings.theme.dark': { to: 'settings.appearance.themeDark' },
  'settings.fontSize': { to: 'settings.appearance.textSize' },
  'settings.fontSize.standard': { to: 'settings.appearance.textSizeMd' },
  'settings.fontSize.large': { to: 'settings.appearance.textSizeLg' },
  'settings.fontSize.xlarge': { to: 'settings.appearance.textSizeXl' },
  'settings.voice': { to: 'settings.voice.title' },
  'settings.voice.pronounce': { to: 'settings.voice.tts' },
  'settings.voice.builtin': { to: 'settings.voice.ttsValue' },
  'settings.voice.hq': { to: 'settings.voice.ttsHq' },
  'settings.voice.hqHint': { to: 'settings.voice.ttsHqNote' },
  'settings.voice.sttHint': { to: 'settings.voice.sttNote' },
  'settings.voice.download': { to: 'download.action.start' },
  'settings.voice.downloaded': { to: 'download.status.done' },
  'settings.data': { to: 'settings.data.title' },
  'settings.export': { to: 'settings.data.export' },
  'settings.clear': { to: 'settings.data.clear' },
  'settings.account': { to: 'settings.account.title' },
  'settings.account.local': { to: 'settings.account.signedOut' },
  'settings.other': { to: 'settings.other.title' },
  'settings.about': { to: 'settings.other.about' },
  'clearData.title': { to: 'clearData.dialog.title' },
  'clearData.body': { to: 'clearData.dialog.body' },
  'clearData.ack': { to: 'clearData.dialog.confirmCheck' },
  'clearData.confirm': { to: 'clearData.dialog.confirm' },
  'clearData.busy': { to: 'clearData.dialog.busy' },
  'clearData.done': { to: 'clearData.dialog.done' },
  'install.title': { to: 'install.card.title' },
  'install.body': { to: 'install.card.bodyPrompt' },
  'install.add': { to: 'install.card.button' },
  'install.iosSteps': { to: 'install.card.bodyIos' },
  'install.updateReady': { to: 'install.update.title' },
  'install.reload': { to: 'install.update.reload' },
  'install.offlineReady': { to: 'install.update.offlineReady' },
  'system.offline.banner': { to: 'system.offline.strip' },
  'system.toast.exported': { to: 'settings.data.exportDone' },
  'account.entry': { to: 'account.panel.entry' },
  'account.intro': { to: 'account.panel.intro' },
  'account.google': { to: 'account.panel.google' },
  'account.error': { to: 'account.panel.error' },
  'account.signedIn': { to: 'account.panel.signedIn' },
  'account.logout': { to: 'account.panel.logout' },
  'account.logoutBlocked': { to: 'account.panel.logoutBlocked' },
  'download.failed': { to: 'download.status.failed' },
  // TASK-16 查義彈層（main 7874889）已建的 key
  'common.toeicTag': { to: 'dict.sheet.toeic' },
  'dict.aria': { to: 'dict.sheet.label' },
  'dict.lemma': { to: 'dict.sheet.baseForm', rename: { form: 'query', lemma: 'headword' } },
  'dict.save': { to: 'dict.favorite.add' },
  'dict.saved': { to: 'dict.favorite.saved' },
  'dict.source': { to: 'dict.sheet.source' },
  'dict.notFound': { to: 'dict.sheet.notFound' },
  'system.toast.saved': { to: 'dict.favorite.added' },
  'system.toast.undo': { to: 'dict.favorite.undo' },
  'download.storageFull': { to: 'download.status.storageFull' },
  'system.notFound': { to: 'system.page.notFound' },
  'system.appDescription': { to: 'system.page.appDescription' },
};

// 未列在 MAP 的列：三層照用；二層補中間層；四層把最後兩層併成駝峰
const MIDDLE = { common: 'text', listen: 'question', speak: 'question', write: 'question', dict: 'sheet', placement: 'pick', lesson: 'frame' };
function newKey(key) {
  const p = key.split('.');
  if (p.length === 3) return key;
  if (p.length === 2) {
    if (!MIDDLE[p[0]]) throw new Error(`二層 key 沒有中間層規則：${key}`);
    return `${p[0]}.${MIDDLE[p[0]]}.${p[1]}`;
  }
  if (p.length === 4) return `${p[0]}.${p[1]}.${p[2]}${p[3][0].toUpperCase()}${p[3].slice(1)}`;
  throw new Error(`key 層數不符：${key}`);
}

// 定稿以外、程式需要的新 key（G3 後發現的硬寫字串）→ 標 _pendingG3
const EXTRA = {
  'account.panel.mismatch': '這支手機上有另一個帳號的學習資料。請先用原帳號登入並登出，或到設定清除這支手機上的資料。',
};

const leaves = (node, path = '') =>
  typeof node === 'string'
    ? [[path, node]]
    : Object.entries(node).flatMap(([k, v]) => (k.startsWith('_') ? [] : leaves(v, path ? `${path}.${k}` : k)));
const get = (obj, key) => key.split('.').reduce((n, k) => n?.[k], obj);
function set(obj, key, value) {
  const p = key.split('.');
  if (p.length !== 3) throw new Error(`寫入的 key 必須三層：${key}`);
  let n = obj;
  for (const k of p.slice(0, -1)) n = n[k] ??= {};
  n[p.at(-1)] = value;
}
const params = (s) => [...new Set(s.match(/\{\w+\}/g) ?? [])].sort().join(' ');

const out = structuredClone(base);
out._status = 'approved-G3-2026-10-02';
const baseKeys = new Map(leaves(base));
const touched = new Set();
const report = { overwritten: [], unchanged: [], added: [], same: [], conflict: [] };

for (const row of table.rows) {
  const m = MAP[row.key];
  const targets = m ? [m.to].flat() : [newKey(row.key)];
  let text = row.text;
  for (const [from, to] of Object.entries(m?.rename ?? {})) text = text.replaceAll(`{${from}}`, `{${to}}`);
  for (const target of targets) {
    if (touched.has(target)) throw new Error(`兩列寫到同一個 key：${target}`);
    if (m?.keep) {
      if (!baseKeys.has(target)) throw new Error(`keep 的 key 不在底稿：${target}`);
      report[m.keep.kind].push({ copy: row.key, target, approved: row.text, kept: baseKeys.get(target), why: m.keep.why });
      if (m.keep.kind === 'same') touched.add(target);
      continue;
    }
    touched.add(target);
    if (baseKeys.has(target)) {
      const old = baseKeys.get(target);
      // 改寫既有 key 時參數集合必須與程式現用的相同，否則 t() 帶不進值
      if (params(old) !== params(text)) throw new Error(`參數不一致：${target}「${old}」→「${text}」`);
      (old === text ? report.unchanged : report.overwritten).push({ copy: row.key, target, old, text });
    } else {
      if (get(out, target) !== undefined) throw new Error(`新 key 撞到既有節點：${target}`);
      report.added.push({ copy: row.key, target, text });
    }
    set(out, target, text);
  }
}
for (const [key, text] of Object.entries(EXTRA)) set(out, key, text);

const conflictKeys = new Set(report.conflict.map((c) => c.target));
const pending = [
  ...[...baseKeys.keys()].filter((k) => !touched.has(k)),
  ...Object.keys(EXTRA),
].sort();
// 衝突列一定在 pending 內（沒被 touched）
for (const k of conflictKeys) if (!pending.includes(k)) throw new Error(`衝突 key 未列入待審：${k}`);
out._pendingG3 = pending;

// _status、_pendingG3 放最前面
const { _status, _pendingG3, ...rest } = out;
writeFileSync(new URL(JSON_PATH, root), JSON.stringify({ _status, _pendingG3, ...rest }, null, 2) + '\n', 'utf8');

const lines = [
  '# G3 定稿回寫報告（g3-apply.mjs 產生，勿手改）',
  '',
  `總表 ${table.rows.length} 列 → 覆寫 ${report.overwritten.length}、值相同 ${report.unchanged.length}、新增 ${report.added.length}、拆開渲染視同相同 ${report.same.length}、衝突保留 ${report.conflict.length}；json 待審（_pendingG3）${pending.length}`,
  '',
  '## 覆寫（main 的值與定稿不同）',
  '',
  '| json key | 原值 | 定稿 |',
  '|---|---|---|',
  ...report.overwritten.map((r) => `| \`${r.target}\` | ${r.old} | ${r.text} |`),
  '',
  '## 衝突：定稿與程式現況不符，保留原值、列入 _pendingG3',
  '',
  '| json key | 保留的原值 | 定稿 | 理由 |',
  '|---|---|---|---|',
  ...report.conflict.map((r) => `| \`${r.target}\` | ${r.kept} | ${r.approved} | ${r.why} |`),
  '',
  '## 拆開渲染、顯示結果與定稿相同（不改）',
  '',
  ...report.same.map((r) => `- \`${r.target}\`「${r.kept}」← 定稿「${r.approved}」：${r.why}`),
  '',
  '## 待審 _pendingG3（main 有、總表沒有，或衝突，或 G3 後新增）',
  '',
  ...pending.map((k) => `- \`${k}\`：${get(out, k)}`),
  '',
  '## 新增 key（總表 key → json key）',
  '',
  ...report.added.map((r) => `- \`${r.target}\` ← ${r.copy}`),
  '',
];
writeFileSync(new URL('g3-apply-report.md', here), lines.join('\n'), 'utf8');
console.log(lines[2]);
