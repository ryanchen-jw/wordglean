// 即時跟讀原型測試頁（TASK-39，內部工具、以英文標示）：/debug/live-shadowing，App 內沒有入口、延遲載入。
// 即時取樣（liveMic）＋滑動視窗重複辨識（liveStt）＋不照順序比對（liveMatch）；印每輪辨識文字與耗時，
// 視窗 3／4／6 秒可在錄音中切換；「Continuous 60 s」模式不因整句完成而停，供耗電實驗（設計 §7 實驗 4）
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createLiveMatch, type LiveState } from '../../speech/liveMatch'
import { liveMicSupported, startLiveMic, type LiveMic } from '../../speech/liveMic'
import {
  createFileSource,
  percentile,
  startLiveLoop,
  type LiveRound,
  type LiveStopReason,
} from '../../speech/liveStt'
import { to16k } from '../../speech/mic'
import { useSpeech } from '../../speech/services'
import { stt } from '../../speech/stt'
import { Button } from '../../ui/Button'

const SENTENCES = [
  'I want to eat dinner.',
  "I'm going to the park with my dog.",
  'She has two cats and a little bird.',
  'Can you tell me where the station is?',
  "It's ten o'clock and the shop is closed.",
  'You will be frank with me. I always am.',
]
const WINDOWS = [3, 4, 6] as const
type Mode = 'shadow' | 'continuous'

const fmt = (n: number) => (Number.isFinite(n) ? `${Math.round(n)} ms` : '–')
const markCls: Record<string, string> = {
  todo: 'border-b-2 border-dashed border-border text-text',
  heard: 'bg-hint-bg text-text',
  done: 'bg-correct-bg font-bold text-correct',
  light: 'text-muted',
}

export default function LiveShadowingScreen() {
  const { stt: client } = useSpeech()
  const sttState = useSyncExternalStore(client.subscribe, client.get)
  const [win, setWin] = useState<number>(4)
  const winRef = useRef(win)
  const [confirm, setConfirm] = useState(true)
  const confirmRef = useRef(confirm)
  const [mode, setMode] = useState<Mode>('shadow')
  const [target, setTarget] = useState(SENTENCES[0])
  const [rounds, setRounds] = useState<LiveRound[]>([])
  const [match, setMatch] = useState<{ on: LiveState; off: LiveState } | null>(null)
  const [running, setRunning] = useState(false)
  const [stopReason, setStopReason] = useState<LiveStopReason | 'complete' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const session = useRef<{ mic: LiveMic; stop: () => void } | null>(null)
  // 取得麥克風中（權限還沒回應）：期間按停止或離開頁面就標 cancelled，權限回來時立即釋放
  const pending = useRef<{ cancelled: boolean } | null>(null)

  useEffect(() => {
    const release = client.acquire()
    void client.refresh()
    return () => {
      if (pending.current) pending.current.cancelled = true
      session.current?.stop()
      release()
    }
  }, [client])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const s = session.current
      if (!s) return
      setLevel(s.mic.level())
      setElapsed(s.mic.elapsed())
    }, 100)
    return () => clearInterval(id)
  }, [running])

  async function start() {
    // 連按只建立一條錄音
    if (pending.current || session.current) return
    const req = { cancelled: false }
    pending.current = req
    setError(null)
    setStopReason(null)
    setRounds([])
    setSkipped(0)
    setRunning(true)
    let mic: LiveMic
    try {
      mic = await startLiveMic()
    } catch (e) {
      pending.current = null
      if (!req.cancelled) {
        setError(String(e))
        setRunning(false)
      }
      return
    }
    pending.current = null
    if (req.cancelled) {
      mic.stop()
      return
    }
    const on = createLiveMatch(target, { confirm: true })
    const off = createLiveMatch(target, { confirm: false })
    setMatch({ on: on.state(), off: off.state() })
    const end = (reason: LiveStopReason | 'complete') => {
      mic.stop()
      session.current = null
      setRunning(false)
      setStopReason(reason)
    }
    const loop = startLiveLoop({
      source: mic,
      transcribe: (s) => client.transcribe(s),
      windowSec: () => winRef.current,
      onRound: (r) => {
        setRounds((rs) => [...rs, r])
        setSkipped(loop.skipped())
        const next = { on: on.update(r.text), off: off.update(r.text) }
        setMatch(next)
        if (mode === 'shadow' && next[confirmRef.current ? 'on' : 'off'].complete) {
          end('complete')
          loop.stop()
        }
      },
      onStop: (reason, e) => {
        if (e) setError(String(e))
        if (session.current) end(reason)
      },
    })
    session.current = { mic, stop: () => loop.stop() }
  }

  function stop() {
    if (pending.current) {
      pending.current.cancelled = true
      pending.current = null
      setRunning(false)
      setStopReason('stopped')
    } else session.current?.stop()
  }
  const ms = rounds.map((r) => r.ms)
  const half = (first: boolean) =>
    percentile(
      rounds.filter((r) => r.at < 30 === first).map((r) => r.ms),
      0.5,
    )
  const shown = match?.[confirm ? 'on' : 'off']
  const results = () =>
    JSON.stringify(
      {
        ua: navigator.userAgent,
        target,
        mode,
        confirm,
        stopReason,
        skipped,
        median: percentile(ms, 0.5),
        p90: percentile(ms, 0.9),
        firstHalfMedian: half(true),
        secondHalfMedian: half(false),
        words: shown?.words.map((w) => ({ text: w.text, mark: w.mark, doneAt: w.doneAt })),
        rounds: rounds.map((r) => ({
          at: +r.at.toFixed(2),
          win: r.windowSec,
          ms: Math.round(r.ms),
          text: r.text,
        })),
      },
      null,
      1,
    )

  const ready = sttState.kind === 'ready'
  const busy = sttState.kind === 'downloading' || sttState.kind === 'loading'
  return (
    <main
      data-testid="screen-live-shadowing"
      className="mx-auto grid max-w-120 gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8 text-body text-text"
    >
      <header className="grid gap-1">
        <h1 className="text-title font-bold">Live shadowing prototype</h1>
        <p className="text-caption text-muted">
          Internal test page (TASK-39). Audio stays on this device.
        </p>
      </header>

      <section className="grid gap-2" aria-label="Model">
        <p data-testid="live-model">
          Model: {sttState.kind}
          {sttState.kind === 'downloading' && ` ${Math.round(sttState.progress * 100)}%`}
        </p>
        {!ready && (
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => void client.load().catch((e) => setError(String(e)))}
          >
            {sttState.kind === 'notDownloaded' ? 'Download model (~52–76 MB)' : 'Load model'}
          </Button>
        )}
      </section>

      <fieldset className="grid gap-2">
        <legend className="text-caption text-muted">Window</legend>
        <div className="grid grid-cols-3 gap-2">
          {WINDOWS.map((w) => (
            <Button
              key={w}
              variant={w === win ? 'primary' : 'secondary'}
              aria-pressed={w === win}
              onClick={() => {
                winRef.current = w
                setWin(w)
              }}
            >
              {w} s
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2" disabled={running}>
        <legend className="text-caption text-muted">Mode</legend>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'shadow' ? 'primary' : 'secondary'}
            aria-pressed={mode === 'shadow'}
            onClick={() => setMode('shadow')}
          >
            Shadowing
          </Button>
          <Button
            variant={mode === 'continuous' ? 'primary' : 'secondary'}
            aria-pressed={mode === 'continuous'}
            onClick={() => setMode('continuous')}
          >
            Continuous 60 s
          </Button>
        </div>
      </fieldset>

      <label className="grid gap-1">
        <span className="text-caption text-muted">Target sentence</span>
        <select
          className="min-h-11 rounded-control border border-border bg-surface px-3 font-en"
          value={target}
          disabled={running}
          onChange={(e) => setTarget(e.target.value)}
        >
          {SENTENCES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          className="size-5"
          checked={confirm}
          onChange={(e) => {
            confirmRef.current = e.target.checked
            setConfirm(e.target.checked)
          }}
        />
        Two-round confirm
      </label>

      <section aria-label="Target" className="grid gap-2 rounded-card bg-surface p-4">
        <p
          data-testid="live-target"
          className="flex flex-wrap gap-x-2 gap-y-1 font-en text-content"
        >
          {(shown?.words ?? createLiveMatch(target).state().words).map((w, i) => (
            <span key={i} data-mark={w.mark} className={`rounded px-0.5 ${markCls[w.mark]}`}>
              {w.text}
            </span>
          ))}
        </p>
        <p className="text-caption text-muted" data-testid="live-progress">
          {shown
            ? `${shown.doneCount}/${shown.words.length} done · longest run ${shown.longestRun}`
            : 'Not started'}
          {shown?.complete && ' · Complete!'}
        </p>
      </section>

      <Button
        variant={running ? 'danger' : 'primary'}
        disabled={!ready && !running}
        onClick={() => (running ? stop() : void start())}
      >
        {running ? 'Stop' : 'Start'}
      </Button>
      {!liveMicSupported() && (
        <p className="text-error">AudioWorklet or microphone not supported in this browser.</p>
      )}
      {error && <p className="break-all text-error">{error}</p>}

      <section
        aria-label="Stats"
        data-testid="live-stats"
        className="grid grid-cols-2 gap-1 text-caption tabular-nums"
      >
        <span>Elapsed {elapsed.toFixed(1)} s</span>
        <span>Level {(level * 100).toFixed(0)}</span>
        <span>Rounds {rounds.length}</span>
        <span>Skipped (quiet) {skipped}</span>
        <span>Median {fmt(percentile(ms, 0.5))}</span>
        <span>P90 {fmt(percentile(ms, 0.9))}</span>
        <span>First 30 s median {fmt(half(true))}</span>
        <span>Last 30 s median {fmt(half(false))}</span>
        {stopReason && <span className="col-span-2">Stopped: {stopReason}</span>}
      </section>

      <Button
        variant="secondary"
        disabled={rounds.length === 0}
        onClick={() => void navigator.clipboard?.writeText(results())}
      >
        Copy results
      </Button>

      <ol data-testid="live-rounds" className="grid gap-1 text-caption tabular-nums">
        {[...rounds].reverse().map((r) => (
          <li
            key={r.index}
            data-testid="live-round"
            data-at={r.at.toFixed(2)}
            className="grid grid-cols-[3rem_6rem_1fr] gap-2 border-b border-line py-1"
          >
            <span>#{r.index}</span>
            <span>
              {Math.round(r.ms)} ms · {r.windowSec}s
            </span>
            <span className="font-en break-words">{r.text || '(empty)'}</span>
          </li>
        ))}
      </ol>
    </main>
  )
}

// 實驗 2 用（只在跟讀 e2e 建置）：把測試音檔當即時音源跑辨識迴圈，回傳每輪文字
if (import.meta.env.VITE_E2E_SPEECH === 'true') {
  ;(window as unknown as { __liveShadowing: unknown }).__liveShadowing = {
    async runFile(
      url: string,
      opts: { cutSec: number; tailSec: number; windowSec: number; minSeconds?: number },
    ): Promise<LiveRound[]> {
      const all = await to16k(await (await fetch(url)).arrayBuffer())
      const source = createFileSource(all.slice(0, Math.round(opts.cutSec * 16_000)))
      const rounds: LiveRound[] = []
      await new Promise<void>((resolve) => {
        startLiveLoop({
          source,
          transcribe: (s) => stt.transcribe(s),
          windowSec: () => opts.windowSec,
          maxSeconds: opts.cutSec + opts.tailSec,
          minSeconds: opts.minSeconds,
          onRound: (r) => rounds.push(r),
          onStop: () => resolve(),
        })
      })
      return rounds
    },
    marks(target: string, texts: string[], confirm: boolean) {
      const m = createLiveMatch(target, { confirm })
      for (const t of texts) m.update(t)
      return m.state().words.map((w) => w.mark === 'done')
    },
    async transcribeRange(url: string, fromSec: number, toSec: number) {
      const all = await to16k(await (await fetch(url)).arrayBuffer())
      return stt.transcribe(all.slice(Math.round(fromSec * 16_000), Math.round(toSec * 16_000)))
    },
  }
}
