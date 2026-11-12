// 高音質發音診斷頁 /debug/voice（TASK-34）：內部工具、App 內沒有入口；使用者照網址打開、截圖回傳。
// 文字用英文（內部工具，卡片邊界允許）。只讀不寫：不載入模型、不改任何旗標
import { useEffect, useState, type ReactNode } from 'react'
import { SubScreen } from '../../shell/Screen'

const CACHE = 'transformers-cache'
const LIMITS = [
  'maxBufferSize',
  'maxStorageBufferBindingSize',
  'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup',
] as const

type GpuAdapterLike = {
  limits: Record<string, number>
  info?: Record<string, string>
  features?: Set<string>
}
type Gpu = { requestAdapter(): Promise<GpuAdapterLike | null> }

const mb = (n: number | undefined) => (n === undefined ? '?' : `${(n / 2 ** 20).toFixed(1)} MB`)

async function gpuReport() {
  const gpu = (navigator as Navigator & { gpu?: Gpu }).gpu
  if (!gpu) return { available: false as const, note: 'navigator.gpu missing' }
  try {
    const a = await gpu.requestAdapter()
    if (!a) return { available: false as const, note: 'requestAdapter() returned null' }
    return {
      available: true as const,
      info: a.info ? `${a.info.vendor ?? ''} ${a.info.architecture ?? ''}`.trim() : '?',
      features: a.features ? [...a.features].join(', ') : '?',
      limits: LIMITS.map((k) => [k, a.limits[k]] as const),
    }
  } catch (e) {
    return { available: false as const, note: `requestAdapter() threw: ${String(e)}` }
  }
}

// 高音質在 Worker 裡跑 WebGPU：主執行緒有不代表 Worker 有
function workerGpu(): Promise<string> {
  const src = `(async()=>{const g=self.navigator.gpu;let a=null,err='';try{a=g?await g.requestAdapter():null}catch(e){err=String(e)}postMessage('gpu='+!!g+' adapter='+!!a+(err?' error='+err:''))})()`
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))
      const w = new Worker(url)
      const done = (s: string) => {
        w.terminate()
        URL.revokeObjectURL(url)
        resolve(s)
      }
      w.onmessage = (e: MessageEvent<string>) => done(e.data)
      w.onerror = (e) => done(`worker error: ${e.message}`)
      setTimeout(() => done('no answer in 5s'), 5000)
    } catch (e) {
      resolve(`cannot start worker: ${String(e)}`)
    }
  })
}

async function storageReport() {
  const s = navigator.storage
  const est = await s?.estimate?.().catch(() => undefined)
  const persisted = await s?.persisted?.().catch(() => undefined)
  return { usage: est?.usage, quota: est?.quota, persisted }
}

type CacheFile = { url: string; header?: number; body?: number }

async function cacheFiles(): Promise<CacheFile[] | string> {
  try {
    if (!(await caches.has(CACHE))) return 'cache not found'
    const c = await caches.open(CACHE)
    const files: CacheFile[] = []
    for (const req of await c.keys()) {
      const res = await c.match(req)
      const len = res?.headers.get('content-length')
      files.push({
        url: req.url.replace(/^https:\/\/huggingface\.co\//, ''),
        header: len ? +len : undefined,
      })
    }
    return files
  } catch (e) {
    return `error: ${String(e)}`
  }
}

// 實際內容大小：要把檔案讀出來（大檔在手機上慢），所以另按才量
async function measureBodies(files: CacheFile[]): Promise<CacheFile[]> {
  const c = await caches.open(CACHE)
  const out: CacheFile[] = []
  for (const f of files) {
    const res = await c.match(`https://huggingface.co/${f.url}`).catch(() => undefined)
    const body = await res
      ?.blob()
      .then((b) => b.size)
      .catch(() => undefined)
    out.push({ ...f, body })
  }
  return out
}

function storageEntries(s: Storage, prefix: string) {
  const out: [string, string][] = []
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i)
    if (k?.startsWith(prefix)) out.push([k, s.getItem(k) ?? ''])
  }
  return out.sort()
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-1">
      <h2 className="text-caption tracking-[0.04em] text-muted">{title}</h2>
      <div className="grid gap-0.5 rounded-2xl border border-line bg-surface px-3 py-2 text-caption break-all">
        {children}
      </div>
    </section>
  )
}

const Line = ({ k, v }: { k: string; v: ReactNode }) => (
  <div>
    <span className="text-muted">{k}: </span>
    {v}
  </div>
)

export function VoiceDiagnosticsScreen() {
  const [gpu, setGpu] = useState<Awaited<ReturnType<typeof gpuReport>>>()
  const [inWorker, setInWorker] = useState<string>()
  const [storage, setStorage] = useState<Awaited<ReturnType<typeof storageReport>>>()
  const [files, setFiles] = useState<CacheFile[] | string>()
  const [measuring, setMeasuring] = useState(false)

  useEffect(() => {
    void gpuReport().then(setGpu)
    void workerGpu().then(setInWorker)
    void storageReport().then(setStorage)
    void cacheFiles().then(setFiles)
  }, [])

  const local = storageEntries(localStorage, 'lg.tts')
  const session = storageEntries(sessionStorage, 'lg.tts')
  const lastFailure = localStorage.getItem('lg.ttsHq.lastFailure')
  const total = Array.isArray(files) ? files.reduce((n, f) => n + (f.body ?? f.header ?? 0), 0) : 0

  return (
    <SubScreen title="Voice diagnostics">
      <div data-testid="screen-debug-voice" className="grid gap-4 py-4">
        <Section title="Time">
          <Line k="now" v={new Date().toISOString()} />
        </Section>
        <Section title="Browser">
          <Line k="userAgent" v={navigator.userAgent} />
        </Section>
        <Section title="Last HQ voice failure">
          <Line k="lg.ttsHq.lastFailure" v={lastFailure ?? 'none'} />
        </Section>
        <Section title="WebGPU">
          {!gpu ? (
            '…'
          ) : gpu.available ? (
            <>
              <Line k="available" v="yes" />
              <Line k="adapter" v={gpu.info} />
              {gpu.limits.map(([k, v]) => (
                <Line key={k} k={k} v={`${v} (${mb(v)})`} />
              ))}
              <Line k="features" v={gpu.features} />
            </>
          ) : (
            <Line k="available" v={`no (${gpu.note})`} />
          )}
          <Line k="in worker" v={inWorker ?? '…'} />
        </Section>
        <Section title="Storage">
          {!storage ? (
            '…'
          ) : (
            <>
              <Line k="usage" v={mb(storage.usage)} />
              <Line k="quota" v={mb(storage.quota)} />
              <Line k="persisted" v={String(storage.persisted ?? '?')} />
            </>
          )}
        </Section>
        <Section title={`Cache ${CACHE}`}>
          {files === undefined ? (
            '…'
          ) : typeof files === 'string' ? (
            files
          ) : (
            <>
              {files.map((f) => (
                <Line
                  key={f.url}
                  k={f.url}
                  v={`header ${mb(f.header)}${f.body === undefined ? '' : ` / body ${mb(f.body)}`}`}
                />
              ))}
              <Line k="files" v={`${files.length}, total ${mb(total)}`} />
              <button
                type="button"
                disabled={measuring}
                onClick={() => {
                  setMeasuring(true)
                  void measureBodies(files).then((r) => {
                    setFiles(r)
                    setMeasuring(false)
                  })
                }}
                className="mt-1 min-h-11 rounded-xl border border-line px-3 text-left active:bg-primary-soft"
              >
                {measuring ? 'Measuring…' : 'Measure actual body sizes'}
              </button>
            </>
          )}
        </Section>
        <Section title="localStorage (lg.tts*)">
          {local.length ? local.map(([k, v]) => <Line key={k} k={k} v={v} />) : 'none'}
        </Section>
        <Section title="sessionStorage (lg.tts*)">
          {session.length ? session.map(([k, v]) => <Line key={k} k={k} v={v} />) : 'none'}
        </Section>
      </div>
    </SubScreen>
  )
}
