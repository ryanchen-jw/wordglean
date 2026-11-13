// 聽類兩題型共用（設計 s03）：題目卡（題型、播放鈕、慢速播放）
// 發音先播預先產生的音檔、沒有才用手機內建聲音（TASK-35），題目卡不另標示用哪一種
import { Turtle, Volume2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { t } from '../../i18n/t'
import type { Rate } from '../../speech/tts'
import { useSpeak } from '../../speech/useSpeak'
import { Card } from '../../ui/Card'

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
  // 離開這個畫面時停掉自己發起、還沒念完的發音（TASK-32）
  const speak = useSpeak()
  const play = (rate?: Rate) => void (rate ? speak(text, { rate }) : speak(text))
  return (
    <Card className="justify-items-center text-center">
      <span className="text-secondary text-muted">{title}</span>
      {children}
      <button
        type="button"
        aria-label={t(answered ? 'common.text.playAgain' : 'common.text.play')}
        onClick={() => play()}
        className="mt-1 grid size-18 place-items-center rounded-full bg-primary-soft text-primary transition-transform duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale)"
      >
        <Volume2 size={30} aria-hidden="true" />
      </button>
      {!answered && (
        <button
          type="button"
          onClick={() => play(0.8)}
          className="flex min-h-11 items-center gap-1.5 font-medium text-primary active:bg-primary-soft"
        >
          <Turtle size={20} aria-hidden="true" />
          {t('lesson.listen.slow')}
        </button>
      )}
      {after}
    </Card>
  )
}
