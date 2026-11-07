// 聽類兩題型共用（設計 s03）：題目卡（題型、播放鈕、慢速播放、手機內建聲音說明）與第一次出現的高音質提示條
import { Info, Turtle, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { t } from '../../i18n/t'
import { hqVoice, speak, tts } from '../../speech/speak'
import type { Rate } from '../../speech/tts'
import { Card } from '../../ui/Card'

const HINT_SEEN_KEY = 'lg.ttsHqHintSeen'

export function ListenCard({
  title,
  text,
  answered,
  children,
  after,
}: {
  title: string
  /** 要念的英文句 */
  text: string
  answered: boolean
  /** 播放鈕上方（聽音打字的說明） */
  children?: ReactNode
  /** 播放鈕下方（聽音選答的提問） */
  after?: ReactNode
}) {
  // 高音質失敗退回內建聲音時，說明要跟著改
  const [engine, setEngine] = useState(() => tts.engine())
  useEffect(() => tts.onNotice(() => setEngine(tts.engine())), [])
  const system = engine === 'system'
  // 用高音質時要先載入模型、合成，可能等好幾秒：念完前播放鈕標示忙碌（內建聲音立即開始念，不標示）
  const [busy, setBusy] = useState(false)
  const lastPlay = useRef(0)
  const play = (rate?: Rate) => {
    const p = Promise.resolve(rate ? speak(text, { rate }) : speak(text))
    if (tts.engine() !== 'hq') return
    const mine = ++lastPlay.current
    setBusy(true)
    void p.finally(() => {
      if (mine === lastPlay.current) setBusy(false)
    })
  }
  return (
    <Card className="justify-items-center text-center">
      <span className="text-secondary text-muted">{title}</span>
      {children}
      <button
        type="button"
        aria-label={t(answered ? 'common.text.playAgain' : 'common.text.play')}
        aria-busy={busy || undefined}
        onClick={() => play()}
        className="mt-1 grid size-18 aria-busy:opacity-60 place-items-center rounded-full bg-primary-soft text-primary transition-transform duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale)"
      >
        <Volume2 size={30} aria-hidden="true" />
      </button>
      {!answered && (
        <button
          type="button"
          aria-busy={busy || undefined}
          onClick={() => play(0.8)}
          className="flex min-h-11 items-center gap-1.5 font-medium text-primary active:bg-primary-soft"
        >
          <Turtle size={20} aria-hidden="true" />
          {t('lesson.listen.slow')}
        </button>
      )}
      {!answered && system && (
        <span className="text-caption text-muted">{t('lesson.listen.systemVoice')}</span>
      )}
      {after}
    </Card>
  )
}

/** 高音質發音載入或合成失敗、已退回內建聲音時的提示（TASK-13 AC#2）；這次開啟內換題也持續顯示。
 *  aria-live 容器先存在（空的、不佔版面），失敗後才在裡面放文字，報讀器才念得到 */
export function HqFailedNotice() {
  const [failed, setFailed] = useState(() => tts.hqFailed())
  useEffect(() => tts.onNotice(() => setFailed(true)), [])
  return (
    <div aria-live="polite" className={failed ? undefined : 'sr-only'}>
      {failed && (
        <div
          data-testid="hq-failed"
          className="flex items-center gap-2 rounded-control bg-hint-bg px-3.5 py-2.5 text-secondary text-hint"
        >
          <Info size={20} aria-hidden="true" className="flex-none" />
          <span>{t('lesson.listen.hqFailed')}</span>
        </div>
      )}
    </div>
  )
}

/** 用內建聲音時，第一次遇到聽題才出現一次（設計 s03 註記）；沒有 WebGPU 的手機開不了高音質，不提示 */
export function HqVoiceHint() {
  const [show] = useState(() => {
    try {
      return (
        tts.engine() === 'system' &&
        hqVoice.status().kind !== 'unsupported' &&
        !localStorage.getItem(HINT_SEEN_KEY)
      )
    } catch {
      return false
    }
  })
  useEffect(() => {
    if (!show) return
    try {
      localStorage.setItem(HINT_SEEN_KEY, '1')
    } catch {
      // 私密模式等寫不進去：下次再提示一次，無妨
    }
  }, [show])
  if (!show) return null
  return (
    <div
      data-testid="hq-voice-hint"
      className="flex items-center gap-2 rounded-control bg-hint-bg px-3.5 py-2.5 text-secondary text-hint"
    >
      <Info size={20} aria-hidden="true" className="flex-none" />
      <span>{t('lesson.listen.hqHint')}</span>
    </div>
  )
}
