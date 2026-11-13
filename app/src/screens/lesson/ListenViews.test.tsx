// 聽類兩題型畫面（設計 s03）：播放／慢速、檢查停用、判題回饋、聽不出來
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ListenChoiceItem, ListenTypeItem } from '../../lesson/items'
import type { Step } from '../../lesson/queue'
import { ListenChoiceView } from './ListenChoiceView'
import { ListenTypeView } from './ListenTypeView'

const speak = vi.fn()
const cancel = vi.fn()
vi.mock('../../speech/speak', () => ({
  speak: (...args: unknown[]) => speak(...args),
  tts: { cancel: () => cancel() },
}))

const typeItem: ListenTypeItem = {
  id: 'q1',
  type: 'listenType',
  sentenceEn: 'They moved the meeting to Friday.',
  sentenceZh: '他們把會議改到星期五。',
}
const typeStep: Step = { key: 'q1', itemId: 'q1', type: 'listenType', srsWord: null }

const choiceItem: ListenChoiceItem = {
  id: 'q2',
  type: 'listenChoice',
  audioEn: 'They decided to move the meeting to Friday.',
  audioZh: '他們決定把會議改到星期五。',
  questionZh: '他們決定怎麼處理會議？',
  options: ['Cancel it', 'Move it to Friday', 'Hold it online'],
  answer: 1,
}
const choiceStep: Step = {
  key: 'q2',
  itemId: 'q2',
  type: 'listenChoice',
  srsWord: null,
  choice: { options: choiceItem.options, answer: 1 },
}

beforeEach(() => {
  speak.mockReset()
})

function renderType() {
  const onAnswer = vi.fn()
  render(
    <ListenTypeView item={typeItem} step={typeStep} onAnswer={onAnswer} onContinue={vi.fn()} />,
  )
  return onAnswer
}

const field = () => screen.getByRole('textbox', { name: '把聽到的英文打在這裡' })

describe('聽音打字', () => {
  it('播放念整句；慢速播放用 0.8', () => {
    renderType()
    expect(screen.getByText('聽音打字')).toBeInTheDocument()
    expect(screen.getByText('聽句子，把聽到的英文打出來')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '播放' }))
    expect(speak).toHaveBeenLastCalledWith('They moved the meeting to Friday.')
    fireEvent.click(screen.getByRole('button', { name: '慢速播放' }))
    expect(speak).toHaveBeenLastCalledWith('They moved the meeting to Friday.', { rate: 0.8 })
  })

  it('還沒輸入（或只有空白）時「檢查」停用', () => {
    renderType()
    expect(screen.getByRole('button', { name: '檢查' })).toBeDisabled()
    fireEvent.change(field(), { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: '檢查' })).toBeDisabled()
  })

  it('答錯：打錯的字標出來、「差一點：move → moved」＋英中解答；記為答錯', () => {
    const onAnswer = renderType()
    fireEvent.change(field(), { target: { value: 'They move the meeting to Friday' } })
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: false, usedHint: false })
    const marked = screen.getByTestId('listen-typed').querySelectorAll('mark')
    expect([...marked].map((m) => m.textContent)).toEqual(['move'])
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('差一點：move → moved')
    expect(status).toHaveTextContent('They moved the meeting to Friday.')
    expect(status).toHaveTextContent('他們把會議改到星期五。')
    expect(screen.getByRole('button', { name: '再聽一次' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '慢速播放' })).toBeNull()
  })

  it('漏打的字以「＿＿」表示', () => {
    renderType()
    fireEvent.change(field(), { target: { value: 'They moved meeting to Friday' } })
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(screen.getByRole('status')).toHaveTextContent('差一點：＿＿ → the')
  })

  it('答對（大小寫與標點不計）：「正確」＋英中解答', () => {
    const onAnswer = renderType()
    fireEvent.change(field(), { target: { value: 'they moved the meeting to friday' } })
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: true, usedHint: false })
    expect(screen.getByRole('status')).toHaveTextContent('正確')
    expect(screen.getByTestId('listen-typed').querySelectorAll('mark')).toHaveLength(0)
  })

  it('聽不出來：直接看答案、記為答錯（跳過：錯題重做時不再出，創辦人試用 2026-10-04 ⑤）', () => {
    const onAnswer = renderType()
    fireEvent.click(screen.getByRole('button', { name: '聽不出來' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: false, usedHint: false, skipped: true })
    expect(screen.getByRole('status')).toHaveTextContent('答案是')
    expect(screen.getByRole('status')).toHaveTextContent('They moved the meeting to Friday.')
    expect(screen.getByRole('button', { name: '繼續' })).toBeInTheDocument()
  })
})

describe('換下一題時停止發音（TASK-32）', () => {
  it('按了播放後題目卸載（換題、離開）：取消這一句', () => {
    cancel.mockClear()
    renderType()
    fireEvent.click(screen.getByRole('button', { name: '播放' }))
    cleanup()
    expect(cancel).toHaveBeenCalledTimes(1)
  })
})

describe('聽音選答', () => {
  function renderChoice() {
    const onAnswer = vi.fn()
    render(
      <ListenChoiceView
        item={choiceItem}
        step={choiceStep}
        onAnswer={onAnswer}
        onContinue={vi.fn()}
      />,
    )
    return onAnswer
  }

  it('顯示題型與繁中提問；播放念整段', () => {
    renderChoice()
    expect(screen.getByText('聽音選答')).toBeInTheDocument()
    expect(screen.getByText('他們決定怎麼處理會議？')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '播放' }))
    expect(speak).toHaveBeenLastCalledWith('They decided to move the meeting to Friday.')
  })

  it('選了才能檢查；答對顯示「正確」與原句', () => {
    const onAnswer = renderChoice()
    expect(screen.getByRole('button', { name: '檢查' })).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: 'Move it to Friday' }))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: true, usedHint: false })
    expect(screen.getByRole('status')).toHaveTextContent(
      '正確They decided to move the meeting to Friday.',
    )
  })

  it('答錯顯示正解與英中原句', () => {
    const onAnswer = renderChoice()
    fireEvent.click(screen.getByRole('radio', { name: 'Cancel it' }))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: false, usedHint: false })
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('答案是 B：Move it to Friday')
    expect(status).toHaveTextContent('他們決定把會議改到星期五。')
  })
})
