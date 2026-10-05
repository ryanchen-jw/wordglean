// 配對題（創辦人 2026-10-05 裁示一）：左欄英文、右欄中文第一義，兩邊各點一個配成一對；
// 配對成功兩邊鎖定變灰、配錯短暫標紅；點英文時發音；4 對都配完才算完成（配錯過＝答錯，進錯題重做）
import { useEffect, useMemo, useRef, useState } from 'react'
import { displayWord } from '../../dict/displayCase'
import { t } from '../../i18n/t'
import { matchingOrder } from '../../lesson/matching'
import { playSfx } from '../../sound/sfx'
import { speak, ttsAvailable } from '../../speech/speak'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { LessonFoot, LessonMain } from './frame'
import type { QuestionProps } from './types'

/** 配錯標紅的時間（ms） */
export const WRONG_FLASH_MS = 700

type MatchState = 'idle' | 'selected' | 'wrong' | 'locked'

const tileBy: Record<MatchState, string> = {
  idle: 'border border-border bg-surface px-3 py-2',
  selected: 'border-2 border-primary bg-primary-soft px-[11px] py-[7px]',
  wrong: 'border-2 border-error bg-error-bg px-[11px] py-[7px]',
  locked: 'border border-transparent bg-disabled-bg px-3 py-2 text-disabled-text',
}

function Tile({
  state,
  en,
  onClick,
  children,
}: {
  state: MatchState
  en?: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      lang={en ? 'en' : undefined}
      data-match={state}
      data-multiline
      aria-pressed={state === 'selected'}
      disabled={state === 'locked'}
      onClick={onClick}
      className={`flex min-h-14 w-full min-w-0 items-center justify-center rounded-control text-center text-body break-words [overflow-wrap:anywhere] transition-[transform,background-color] duration-(--lg-duration-press) ease-standard enabled:active:scale-(--lg-press-scale) ${en ? 'font-en font-semibold' : ''} ${tileBy[state]}`}
    >
      {children}
    </button>
  )
}

/** 不用 item（字都在 step.pairs）：複習也直接用 */
export function MatchingView({
  step,
  onAnswer,
  onContinue,
}: Pick<QuestionProps, 'step' | 'onAnswer' | 'onContinue'>) {
  const pairs = step.pairs!
  const zhOrder = useMemo(() => matchingOrder(step), [step])
  const [selEn, setSelEn] = useState<number | null>(null)
  const [selZh, setSelZh] = useState<number | null>(null)
  // 已配好的英文（pairs 索引）與中文（右欄位置）
  const [doneEn, setDoneEn] = useState<number[]>([])
  const [doneZh, setDoneZh] = useState<number[]>([])
  const [wrong, setWrong] = useState<{ en: number; zh: number } | null>(null)
  const missed = useRef(false)
  const flash = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(flash.current), [])
  const finished = doneEn.length === pairs.length

  const tryPair = (en: number | null, zh: number | null) => {
    setSelEn(en)
    setSelZh(zh)
    if (en === null || zh === null) return
    setSelEn(null)
    setSelZh(null)
    // 以中文比對（不同字的第一義相同時，哪個配都算對）
    if (pairs[zhOrder[zh]].gloss === pairs[en].gloss) {
      const nextEn = [...doneEn, en]
      setDoneEn(nextEn)
      setDoneZh([...doneZh, zh])
      setWrong(null)
      playSfx('correct')
      if (nextEn.length === pairs.length)
        onAnswer({ correct: !missed.current, usedHint: false, silent: true })
      return
    }
    missed.current = true
    playSfx('wrong')
    setWrong({ en, zh })
    clearTimeout(flash.current)
    flash.current = setTimeout(() => setWrong(null), WRONG_FLASH_MS)
  }

  const pickEn = (i: number) => {
    if (ttsAvailable()) void speak(pairs[i].word)
    tryPair(i, selZh)
  }

  const stateOf = (done: number[], sel: number | null, i: number, w?: number): MatchState =>
    done.includes(i) ? 'locked' : sel === i ? 'selected' : w === i ? 'wrong' : 'idle'

  return (
    <>
      <LessonMain>
        <Card>
          <span className="text-secondary text-muted">{t('lesson.matching.title')}</span>
          <p>{t('lesson.matching.prompt')}</p>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid min-w-0 auto-rows-fr gap-3">
            {pairs.map((p, i) => (
              <Tile
                key={i}
                en
                state={stateOf(doneEn, selEn, i, wrong?.en)}
                onClick={() => pickEn(i)}
              >
                {displayWord(p.word)}
              </Tile>
            ))}
          </div>
          <div className="grid min-w-0 auto-rows-fr gap-3">
            {zhOrder.map((p, j) => (
              <Tile
                key={j}
                state={stateOf(doneZh, selZh, j, wrong?.zh)}
                onClick={() => tryPair(selEn, j)}
              >
                {pairs[p].gloss}
              </Tile>
            ))}
          </div>
        </div>
      </LessonMain>
      {finished && (
        <LessonFoot>
          <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
        </LessonFoot>
      )}
    </>
  )
}
