import { wordErrors, corpusAccuracy } from './wer.js';

// 網址參數：device=auto|webgpu|wasm、ttsDtype=q8|fp32|…、sttDtype=template（moonshine-web 依裝置設定）|q8|…、workers=1|2
const params = new URLSearchParams(location.search);
const cfg = {
  device: params.get('device') || 'auto',
  ttsDtype: params.get('ttsDtype') || 'q8',
  sttDtype: params.get('sttDtype') || 'template',
  workers: params.get('workers') === '1' ? 1 : 2,
  voice: params.get('voice') || 'af_heart',
};
const SENTENCE = 'Could you tell me how to get to the train station, please?';

const logEl = document.getElementById('log');
const numsEl = document.getElementById('nums');
const metrics = { cfg, env: {}, events: [] };
window.__metrics = metrics;

function log(msg) {
  logEl.textContent += `${new Date().toISOString().slice(11, 19)} ${msg}\n`;
}

function record(kind, data) {
  metrics.events.push({ kind, at: performance.now(), ...data });
  log(`${kind} ${JSON.stringify(data, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v))}`);
  renderNums();
}

// worker 包裝：call(cmd, args) → Promise
function makeWorker(name) {
  const w = new Worker(new URL('./voice.worker.js', import.meta.url), { type: 'module', name });
  let seq = 0;
  const pending = new Map();
  w.onmessage = ({ data }) => {
    if (data.type === 'progress') return;
    const p = pending.get(data.id);
    if (!p) return;
    pending.delete(data.id);
    data.type === 'error' ? p.reject(new Error(data.error)) : p.resolve(data.result);
  };
  w.onerror = (e) => log(`worker ${name} error: ${e.message}`);
  return (cmd, args, transfer = []) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      w.postMessage({ id, cmd, args }, transfer);
    });
}

const ttsWorker = makeWorker('tts');
const sttWorker = cfg.workers === 1 ? ttsWorker : makeWorker('stt');

// 16-bit PCM WAV 直接解析（只供量測：Playwright 的 Windows 版 WebKit 沒有 Web Audio API；真機 Safari 有）
function wavToFloat32(arrayBuffer) {
  const v = new DataView(arrayBuffer);
  let off = 12;
  let rate = 0;
  let channels = 1;
  while (off < v.byteLength) {
    const id = String.fromCharCode(v.getUint8(off), v.getUint8(off + 1), v.getUint8(off + 2), v.getUint8(off + 3));
    const size = v.getUint32(off + 4, true);
    if (id === 'fmt ') { channels = v.getUint16(off + 10, true); rate = v.getUint32(off + 12, true); }
    if (id === 'data') {
      if (rate !== 16000 || channels !== 1) throw new Error(`無 Web Audio 時只支援 16 kHz 單聲道 WAV（此檔 ${rate} Hz／${channels} 聲道）`);
      const out = new Float32Array(size / 2);
      for (let i = 0; i < out.length; i++) out[i] = v.getInt16(off + 8 + i * 2, true) / 32768;
      return out;
    }
    off += 8 + size + (size % 2);
  }
  throw new Error('WAV 找不到 data 區塊');
}

const hasWebAudio = !!(window.AudioContext || window.webkitAudioContext);

async function to16k(arrayBuffer) {
  if (!hasWebAudio) return wavToFloat32(arrayBuffer);
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await ctx.decodeAudioData(arrayBuffer);
  ctx.close();
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start();
  return (await off.startRendering()).getChannelData(0);
}

let audioCtx = null;
function play(samples, rate) {
  if (!hasWebAudio) return log('此瀏覽器沒有 Web Audio，略過播放');
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  const buf = audioCtx.createBuffer(1, samples.length, rate);
  buf.copyToChannel(samples, 0);
  const node = audioCtx.createBufferSource();
  node.buffer = buf;
  node.connect(audioCtx.destination);
  node.start();
}

async function memory() {
  const out = { crossOriginIsolated: self.crossOriginIsolated };
  if (performance.memory) out.jsHeapUsedMB = performance.memory.usedJSHeapSize / 2 ** 20;
  if (self.crossOriginIsolated && performance.measureUserAgentSpecificMemory) {
    try {
      const m = await performance.measureUserAgentSpecificMemory();
      out.uaMemoryMB = m.bytes / 2 ** 20;
    } catch (e) {
      out.uaMemoryError = String(e);
    }
  }
  return out;
}

async function loadTts() {
  log(`載入 Kokoro（${cfg.ttsDtype}／${cfg.device}）…`);
  const r = await ttsWorker('loadTts', { dtype: cfg.ttsDtype, device: cfg.device });
  record('ttsLoad', r);
  return r;
}

async function speak(text = SENTENCE, { playAudio = true } = {}) {
  const r = await ttsWorker('speak', { text, voice: cfg.voice });
  const { samples, ...rest } = r;
  if (playAudio) play(samples, r.samplingRate);
  record('ttsSpeak', { text, ...rest });
  return rest;
}

async function loadStt() {
  log(`載入 Moonshine tiny（${cfg.sttDtype}／${cfg.device}）…`);
  const r = await sttWorker('loadStt', { dtype: cfg.sttDtype, device: cfg.device });
  record('sttLoad', r);
  return r;
}

async function transcribe(samples, ref) {
  const r = await sttWorker('transcribe', { samples }, [samples.buffer]);
  const score = ref ? wordErrors(ref, r.text) : null;
  record('sttRecognize', { ...r, ref, ...(score || {}) });
  return { ...r, ...(score || {}) };
}

async function runFixtures() {
  const manifest = await (await fetch('librispeech/manifest.json')).json();
  const results = [];
  for (const item of manifest) {
    const samples = await to16k(await (await fetch(`librispeech/${item.file}`)).arrayBuffer());
    results.push(await transcribe(samples, item.text));
  }
  const accuracy = corpusAccuracy(results);
  const avgRecognizeMs = results.reduce((s, r) => s + r.recognizeMs, 0) / results.length;
  const audioSec = results.reduce((s, r) => s + r.audioSec, 0);
  record('sttFixtures', { n: results.length, accuracy, avgRecognizeMs, totalAudioSec: audioSec });
  return { accuracy, avgRecognizeMs, results };
}

let recorder = null;
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((resolve) => (recorder.onstop = () => resolve(new Blob(chunks))));
  recorder.start();
  log('錄音中…');
  return async () => {
    recorder.stop();
    stream.getTracks().forEach((t) => t.stop());
    const blob = await done;
    return transcribe(await to16k(await blob.arrayBuffer()), null);
  };
}

async function recordMemory(label) {
  const m = await memory();
  record('memory', { label, ...m });
  return m;
}

// 手機自測一鍵流程：產出 6 個回填數字
async function selfTest() {
  sessionStorage.setItem('voicepoc-selftest', 'running');
  let k, second, m;
  try {
    k = await loadTts();
    await speak();
    second = await speak('I would like a cup of coffee.');
    m = await loadStt();
    const samples = await to16k(await (await fetch('librispeech/6930-75918-0007.wav')).arrayBuffer());
    await transcribe(samples, 'YOU WILL BE FRANK WITH ME I ALWAYS AM');
    await speak('Both models are loaded now.');
    await recordMemory('selftest-both');
  } catch (e) {
    // 一般例外不是分頁被殺：清掉旗標，否則重整後第 ⑥ 列會誤報「是」
    sessionStorage.removeItem('voicepoc-selftest');
    throw e;
  }
  sessionStorage.setItem('voicepoc-selftest', 'done');
  record('selfTestDone', { kokoroDevice: k.device, moonshineDevice: m.device, secondSynthMs: second.synthMs });
}

function last(kind) {
  return [...metrics.events].reverse().find((e) => e.kind === kind);
}
const sec = (ms) => (ms == null ? '—' : (ms / 1000).toFixed(1) + ' 秒');

function renderNums() {
  const tl = last('ttsLoad');
  const speaks = metrics.events.filter((e) => e.kind === 'ttsSpeak');
  const sl = last('sttLoad');
  const rec = last('sttRecognize');
  const crashed = sessionStorage.getItem('voicepoc-selftest') === 'running-crashed';
  const done = last('selfTestDone');
  const rows = [
    ['① Kokoro 首次下載', sec(tl?.downloadMs) + (tl ? `（${(tl.bytes / 2 ** 20).toFixed(0)} MB）` : '')],
    ['② Kokoro 載入（含下載）', sec(tl?.loadMs) + (tl ? `［${tl.device}］` : '')],
    ['③ 單句合成（第 2 句）', sec(speaks[1]?.synthMs)],
    ['④ Moonshine 載入（含暖機）', sec(sl?.readyMs) + (sl ? `［${sl.device}］` : '')],
    ['⑤ 辨識延遲（1 句）', sec(rec?.recognizeMs) + (rec?.text ? `「${rec.text}」` : '')],
    ['⑥ 兩者同時載入後當掉／自動重整？', crashed ? '是（頁面曾重整）' : done ? '否' : '—'],
  ];
  numsEl.replaceChildren(
    ...rows.map(([k, v]) => {
      const tr = document.createElement('tr');
      tr.append(Object.assign(document.createElement('th'), { textContent: k }), Object.assign(document.createElement('td'), { textContent: v }));
      return tr;
    }),
  );
}

// 上次自測跑到一半頁面就重整 → 視為分頁被系統殺掉（iOS 記憶體超限的典型症狀）
if (sessionStorage.getItem('voicepoc-selftest') === 'running') sessionStorage.setItem('voicepoc-selftest', 'running-crashed');

metrics.env = {
  ua: navigator.userAgent,
  hasWebGPU: !!navigator.gpu,
  hasWebAudio,
  crossOriginIsolated: self.crossOriginIsolated,
  hardwareConcurrency: navigator.hardwareConcurrency,
  deviceMemory: navigator.deviceMemory ?? null,
};
document.getElementById('env').textContent = JSON.stringify({ ...metrics.env, cfg });
renderNums();

window.poc = { loadTts, speak, loadStt, transcribe, runFixtures, memory, recordMemory, selfTest, to16k };

const bind = (id, fn) =>
  document.getElementById(id).addEventListener('click', async () => {
    try { await fn(); } catch (e) { log(`錯誤：${e.message}`); }
  });
bind('btnSelfTest', selfTest);
bind('btnLoadTts', loadTts);
bind('btnSpeak', () => speak(document.getElementById('text').value));
bind('btnLoadStt', loadStt);
bind('btnFixtures', runFixtures);
bind('btnMemory', () => recordMemory('manual'));
let stopRec = null;
bind('btnRecord', async () => {
  const btn = document.getElementById('btnRecord');
  if (stopRec) { const s = stopRec; stopRec = null; btn.textContent = '開始錄音'; await s(); }
  else { stopRec = await startRecording(); btn.textContent = '停止並辨識'; }
});
bind('btnCopy', () => navigator.clipboard.writeText(numsEl.innerText + '\n' + JSON.stringify(metrics)));
