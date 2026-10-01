// 以 OS 行程記憶體當替代指標（webkit 沒有頁內記憶體 API）：
// 取「本測試 worker 行程（process.pid）底下所有子孫行程」＝本測試自己開的瀏覽器，不會算到別的 worker。
import { execFile } from 'node:child_process';

const PS = `@{ procs = @(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name,PrivatePageCount,WorkingSetSize); freeKB = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory } | ConvertTo-Json -Compress -Depth 3`;

function snapshot() {
  return new Promise((resolve, reject) =>
    execFile('powershell.exe', ['-NoProfile', '-Command', PS], { maxBuffer: 64 * 2 ** 20 }, (err, out) =>
      err ? reject(err) : resolve(JSON.parse(out)),
    ),
  );
}

function descendants(all, rootPid) {
  const kids = new Map();
  for (const p of all) {
    if (!kids.has(p.ParentProcessId)) kids.set(p.ParentProcessId, []);
    kids.get(p.ParentProcessId).push(p);
  }
  const out = [];
  const stack = [...(kids.get(rootPid) || [])];
  while (stack.length) {
    const p = stack.pop();
    if (p.ProcessId === rootPid) continue;
    out.push(p);
    stack.push(...(kids.get(p.ProcessId) || []));
  }
  return out.filter((p) => !/^(powershell|conhost|node|cmd)\.exe$/i.test(p.Name));
}

const MB = 2 ** 20;

export async function sampleOnce() {
  const snap = await snapshot();
  const procs = descendants(snap.procs, process.pid);
  const totalPrivateMB = procs.reduce((s, p) => s + Number(p.PrivatePageCount), 0) / MB;
  const totalWorkingSetMB = procs.reduce((s, p) => s + Number(p.WorkingSetSize), 0) / MB;
  const topWs = procs.reduce((a, p) => (Number(p.WorkingSetSize) > Number(a?.WorkingSetSize ?? -1) ? p : a), null);
  const top = procs.reduce((a, p) => (Number(p.PrivatePageCount) > Number(a?.PrivatePageCount ?? -1) ? p : a), null);
  return {
    totalPrivateMB,
    totalWorkingSetMB,
    maxProcWsOnlyMB: topWs ? Number(topWs.WorkingSetSize) / MB : 0,
    maxProcPrivateMB: top ? Number(top.PrivatePageCount) / MB : 0,
    maxProcWorkingSetMB: top ? Number(top.WorkingSetSize) / MB : 0,
    maxProcName: top?.Name ?? null,
    procCount: procs.length,
    systemFreeMB: Number(snap.freeKB) / 1024,
  };
}

// 背景取樣，stop() 回傳峰值；中止閘門（觸發時呼叫 onLow 一次）：
// 系統空閒記憶體 < lowMB，或本量測自己的瀏覽器行程＋本 node 行程的 working set（實際佔用）合計 > ownMaxMB。
// 不看 private bytes：WebKit 的 Windows build 啟動 WASM 就預留約 5 GB private bytes，實佔不到 1 GB。
export function startSampler({ intervalMs = 1500, lowMB = 1.2 * 1024, ownMaxMB = 3 * 1024, onLow = () => {} } = {}) {
  let peak = null;
  let stopped = false;
  let minFreeMB = Infinity;
  let maxOwnMB = 0;
  let lowFired = false;
  let lowReason = null;
  const loop = (async () => {
    while (!stopped) {
      try {
        const s = await sampleOnce();
        const ownMB = s.totalWorkingSetMB + process.memoryUsage().rss / MB;
        minFreeMB = Math.min(minFreeMB, s.systemFreeMB);
        maxOwnMB = Math.max(maxOwnMB, ownMB);
        if (!lowFired && (s.systemFreeMB < lowMB || ownMB > ownMaxMB)) {
          lowFired = true;
          lowReason = s.systemFreeMB < lowMB ? `系統空閒 ${Math.round(s.systemFreeMB)} MB < ${Math.round(lowMB)}` : `本量測行程 working set 合計 ${Math.round(ownMB)} MB > ${Math.round(ownMaxMB)}`;
          onLow(s.systemFreeMB);
        }
        if (!peak || s.maxProcPrivateMB > peak.maxProcPrivateMB) peak = { ...s, peakTotalPrivateMB: Math.max(s.totalPrivateMB, peak?.peakTotalPrivateMB ?? 0) };
        else peak.peakTotalPrivateMB = Math.max(peak.peakTotalPrivateMB, s.totalPrivateMB);
        peak.peakTotalWorkingSetMB = Math.max(peak.peakTotalWorkingSetMB ?? 0, s.totalWorkingSetMB);
        peak.peakProcWorkingSetMB = Math.max(peak.peakProcWorkingSetMB ?? 0, s.maxProcWsOnlyMB);
      } catch {}
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  })();
  return async () => {
    stopped = true;
    await loop;
    return peak && { ...peak, minSystemFreeMB: minFreeMB, maxOwnMB, abortedLowMemory: lowFired, abortReason: lowReason };
  };
}
