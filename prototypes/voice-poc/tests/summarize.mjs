// 把 results/<project>/<情境>.json 彙整成一行一情境的摘要（給結論文件取數用）
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const r1 = (x) => (x == null ? '—' : Math.round(x));
const s1 = (ms) => (ms == null ? '—' : (ms / 1000).toFixed(1));

for (const project of readdirSync('results', { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'partial').map((d) => d.name)) {
  for (const f of readdirSync(`results/${project}`).sort()) {
    const s = JSON.parse(readFileSync(`results/${project}/${f}`, 'utf-8'));
    const ev = s.metrics?.events ?? [];
    const p = s.procPeak ?? {};
    const parts = [`[${project}] ${s.scenario}`, `crashed=${s.crashed}`, s.error ? `ERR=${s.error.slice(0, 160)}` : 'ok'];
    parts.push(`峰值單行程=${r1(p.maxProcPrivateMB)}MB(${p.maxProcName}) 全部=${r1(p.peakTotalPrivateMB)}MB${p.peakTotalWorkingSetMB != null ? ` WS單行程=${r1(p.peakProcWorkingSetMB)}MB WS全部=${r1(p.peakTotalWorkingSetMB)}MB` : ''} 最低系統空閒=${r1(p.minSystemFreeMB)}MB${p.abortedLowMemory ? ' 【低記憶體中止】' : ''}`);
    if (s.mem?.uaMemoryMB) parts.push(`頁內 measureUserAgentSpecificMemory=${r1(s.mem.uaMemoryMB)}MB`);
    for (const e of ev) {
      if (e.kind === 'ttsLoad') parts.push(`TTS載入 ${e.dtype}/${e.device} 下載${s1(e.downloadMs)}s ${r1(e.bytes / 2 ** 20)}MB 載入${s1(e.loadMs)}s`);
      if (e.kind === 'sttLoad') parts.push(`STT載入 ${JSON.stringify(e.dtype)}/${e.device} 下載${s1(e.downloadMs)}s ${r1(e.bytes / 2 ** 20)}MB 載入${s1(e.loadMs)}s 暖機${s1(e.warmupMs)}s`);
      if (e.kind === 'ttsSpeak') parts.push(`合成${s1(e.synthMs)}s/音長${e.audioSec.toFixed(1)}s(RTF ${e.rtf.toFixed(2)})`);
      if (e.kind === 'sttFixtures') parts.push(`10句正確率=${(e.accuracy * 100).toFixed(1)}% 平均辨識${s1(e.avgRecognizeMs)}s 總音長${e.totalAudioSec.toFixed(0)}s`);
      if (e.kind === 'sttRecognize' && !e.ref) parts.push(`錄音辨識「${e.text}」${s1(e.recognizeMs)}s`);
    }
    if (s.metrics?.env) parts.push(`env webgpu=${s.metrics.env.hasWebGPU} coi=${s.metrics.env.crossOriginIsolated}`);
    console.log(parts.join(' | '));
  }
}
if (existsSync('results/segments.json')) console.log(readFileSync('results/segments.json', 'utf-8'));
