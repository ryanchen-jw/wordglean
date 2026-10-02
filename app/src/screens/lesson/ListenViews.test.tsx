// 聽類兩題型畫面（設計 s03）：播放／慢速、檢查停用、判題回饋、聽不出來、第一次的高音質提示
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ListenChoiceItem, ListenTypeItem } from '../../lesson/items'
import type { Step } from '../../lesson/queue'
import { ListenChoiceView } from './ListenChoiceView'
import { ListenTypeView } from './ListenTypeView'

const speak = vi.fn()
let hqFailed = false
let engine: 'system' | 'hq' = 'system'
let hqStatus: { kind: string } = { kind: 'notDownloaded' }
const noticeListeners = new Set<() => void>()
const notice = () => noticeListeners.forEach((l) => l())
vi.mock('../../speech/speak', () => ({
  speak: (...args: unknown[]) => speak(...args),
  hqVoice: { status: () => hqStatus },
  tts: {
    engine: () => engine,
    hqFailed: () => hqFailed,
    onNotice: (l: () => void) => {
      noticeListeners.add(l)
      return () => noticeListeners.delete(l)
    },
  },
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
  speak.mockClear()
  hqFailed = false
  engine = 'system'
  hqStatus = { kind: 'notDownloaded' }
  speak.mockReset()
  localStorage.clear()
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
  it('播放念整句；慢速播放用 0.8；顯示「手機內建聲音」', () => {
    renderType()
    expect(screen.getByText('聽音打字')).toBeInTheDocument()
    expect(screen.getByText('聽句子，把聽到的英文打出來')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '播放' }))
    expect(speak).toHaveBeenLastCalledWith('They moved the meeting to Friday.')
    fireEvent.click(screen.getByRole('button', { name: '慢速播放' }))
    expect(speak).toHaveBeenLastCalledWith('They moved the meeting to Friday.', { rate: 0.8 })
    expect(screen.getByText('手機內建聲音')).toBeInTheDocument()
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

  it('聽不出來：直接看答案、記為答錯', () => {
    const onAnswer = renderType()
    fireEvent.click(screen.getByRole('button', { name: '聽不出來' }))
    expect(onAnswer).toHaveBeenCalledWith({ correct: false, usedHint: false })
    expect(screen.getByRole('status')).toHaveTextContent('這一句是')
    expect(screen.getByRole('status')).toHaveTextContent('They moved the meeting to Friday.')
    expect(screen.getByRole('button', { name: '繼續' })).toBeInTheDocument()
  })

  it('高音質提示條只在第一次出現', () => {
    renderType()
    expect(screen.getByTestId('hq-voice-hint')).toHaveTextContent(
      '想要更自然的發音，可以到設定開啟「高音質發音」（選配）',
    )
    cleanup()
    renderType()
    expect(screen.queryByTestId('hq-voice-hint')).toBeNull()
  })
})

describe('無障礙與裝置能力（驗收 P2）', () => {
  it('沒有 WebGPU 的手機不顯示「到設定開啟高音質」的首次提示', () => {
    hqStatus = { kind: 'unsupported' }
    renderType()
    expect(screen.queryByTestId('hq-voice-hint')).toBeNull()
  })

  it('失敗提示的 aria-live 容器一開始就在，失敗後文字出現在同一個容器（報讀器念得到）', () => {
    renderType()
    const live = document.querySelector('[aria-live="polite"]')!
    expect(live).toBeInTheDocument()
    expect(live).toHaveTextContent('')
    act(() => notice())
    expect(live).toHaveTextContent('高音質發音無法使用，已改用手機內建聲音')
  })

  it('用高音質時按播放：念完前播放鈕標示忙碌（aria-busy）', async () => {
    engine = 'hq'
    let done = () => {}
    speak.mockReturnValue(new Promise<void>((r) => (done = r)))
    renderType()
    const play = screen.getByRole('button', { name: '播放' })
    expect(play).not.toHaveAttribute('aria-busy', 'true')
    fireEvent.click(play)
    expect(play).toHaveAttribute('aria-busy', 'true')
    await act(async () => done())
    expect(play).not.toHaveAttribute('aria-busy', 'true')
  })

  it('用內建聲音時不標示忙碌（立即開始念）', () => {
    speak.mockReturnValue(new Promise<void>(() => {}))
    renderType()
    const play = screen.getByRole('button', { name: '播放' })
    fireEvent.click(play)
    expect(play).not.toHaveAttribute('aria-busy', 'true')
  })
})

describe('高音質發音失敗的提示（AC#2）', () => {
  it('收到失敗通知時出現「已改用手機內建聲音」', () => {
    renderType()
    expect(screen.queryByTestId('hq-failed')).toBeNull()
    act(() => notice())
    expect(screen.getByTestId('hq-failed')).toHaveTextContent(
      '高音質發音無法使用，已改用手機內建聲音',
    )
  })

  it('用高音質時不顯示「手機內建聲音」；失敗退回後改顯示', () => {
    engine = 'hq'
    renderType()
    expect(screen.queryByText('手機內建聲音')).toBeNull()
    engine = 'system'
    act(() => notice())
    expect(screen.getByText('手機內建聲音')).toBeInTheDocument()
  })

  it('這次開啟內已失敗過：下一題一出現就顯示', () => {
    hqFailed = true
    renderType()
    expect(screen.getByTestId('hq-failed')).toBeInTheDocument()
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
