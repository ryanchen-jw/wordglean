// 同一支 worker 可載 TTS、STT 或兩者；頁面決定開 1 支或 2 支（量「共用一份推論引擎」與「各自一份」的記憶體差）。
//
// STT 部分改寫自 huggingface/transformers.js-examples 的 moonshine-web/src/worker.js（Apache-2.0，
// https://github.com/huggingface/transformers.js-examples/tree/main/moonshine-web）：
// 沿用「WebGPU 偵測→WASM 後備」「依裝置分 dtype」「載入後以 1 秒靜音暖機（編譯 shader）」「推論串成一條鏈」；
// 改動：模型 base→tiny、拿掉 Silero VAD 與自動斷句（跟讀只用按鈕開始／結束）、加上時間量測。
// TTS 部分以 kokoro-js（Apache-2.0）README 用法為起點。
import { KokoroTTS } from 'kokoro-js';
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;

const KOKORO_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const MOONSHINE_ID = 'onnx-community/moonshine-tiny-ONNX';
const SAMPLE_RATE = 16000;

// 出自 moonshine-web：sttDtype=template 時採用
const DEVICE_DTYPE_CONFIGS = {
  webgpu: { encoder_model: 'fp32', decoder_model_merged: 'q4' },
  wasm: { encoder_model: 'fp32', decoder_model_merged: 'q8' },
};

let tts = null;
let stt = null;

// transformers.js 不支援同時推論（出自 moonshine-web 註解）→ 同一 worker 內 TTS 與 STT 共用一條鏈
let inferenceChain = Promise.resolve();
const chained = (fn) => (inferenceChain = inferenceChain.then(fn, fn));

async function resolveDevice(requested) {
  if (requested !== 'auto') return requested;
  try {
    if (self.navigator?.gpu && (await self.navigator.gpu.requestAdapter())) return 'webgpu';
  } catch {}
  return 'wasm';
}

// 下載時間＝第一個檔開始 → 最後一個檔完成；bytes 取各檔 total（已快取時仍會回報）。
function progressTracker() {
  const files = {};
  let first = null;
  let last = null;
  return {
    cb(p) {
      const now = performance.now();
      if (p.status === 'initiate') { first ??= now; files[p.file] ??= { bytes: 0 }; }
      if (p.status === 'progress' && p.total) files[p.file] = { bytes: p.total };
      if (p.status === 'done') last = now;
      if (p.status === 'progress') self.postMessage({ type: 'progress', file: p.file, progress: p.progress });
    },
    result() {
      const bytes = Object.values(files).reduce((s, f) => s + f.bytes, 0);
      return { downloadMs: first != null && last != null ? last - first : null, bytes, files: Object.keys(files) };
    },
  };
}

async function loadTts({ dtype, device }) {
  const dev = await resolveDevice(device);
  const t = progressTracker();
  const t0 = performance.now();
  tts = await KokoroTTS.from_pretrained(KOKORO_ID, { dtype, device: dev, progress_callback: t.cb });
  return { model: 'kokoro', dtype, device: dev, loadMs: performance.now() - t0, ...t.result() };
}

async function loadStt({ dtype, device }) {
  const dev = await resolveDevice(device);
  const resolvedDtype = dtype === 'template' ? DEVICE_DTYPE_CONFIGS[dev] : dtype;
  const t = progressTracker();
  const t0 = performance.now();
  stt = await pipeline('automatic-speech-recognition', MOONSHINE_ID, { dtype: resolvedDtype, device: dev, progress_callback: t.cb });
  const loadMs = performance.now() - t0;
  const t1 = performance.now();
  // 暖機；必須限制輸出長度——tiny 對靜音不會產生結束符號，範本原寫法在 WebGPU 上實測跑了 17 分鐘
  await chained(() => stt(new Float32Array(SAMPLE_RATE), { max_new_tokens: 2 }));
  const warmupMs = performance.now() - t1;
  return { model: 'moonshine', dtype: resolvedDtype, device: dev, loadMs, warmupMs, readyMs: loadMs + warmupMs, ...t.result() };
}

async function speak({ text, voice }) {
  const t0 = performance.now();
  const audio = await chained(() => tts.generate(text, { voice }));
  const synthMs = performance.now() - t0;
  const audioSec = audio.audio.length / audio.sampling_rate;
  return { synthMs, audioSec, rtf: synthMs / 1000 / audioSec, samplingRate: audio.sampling_rate, samples: audio.audio };
}

async function transcribe({ samples }) {
  const t0 = performance.now();
  // Moonshine 依音長決定輸出長度上限（約每秒 6 個 token），避免長句被截斷
  const audioSec = samples.length / SAMPLE_RATE;
  const out = await chained(() => stt(samples, { max_new_tokens: Math.ceil(audioSec * 6) + 10 }));
  return { text: out.text.trim(), recognizeMs: performance.now() - t0, audioSec };
}

const handlers = { loadTts, loadStt, speak, transcribe };

self.onmessage = async ({ data }) => {
  const { id, cmd, args } = data;
  try {
    const result = await handlers[cmd](args);
    const transfer = result.samples ? [result.samples.buffer] : [];
    self.postMessage({ type: 'result', id, result }, transfer);
  } catch (e) {
    self.postMessage({ type: 'error', id, error: String(e?.stack || e) });
  }
};
