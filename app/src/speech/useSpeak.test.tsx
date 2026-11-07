// TASK-32：發起發音的元件卸載時，若最後一次發音仍是它發起的就取消；已被別處新請求取代的不影響
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { speak, tts } from './speak'
import { useSpeak } from './useSpeak'

vi.mock('./speak', () => ({
  speak: vi.fn(async () => {}),
  tts: { cancel: vi.fn() },
}))

function Speaker({ name }: { name: string }) {
  const say = useSpeak()
  return (
    <button type="button" onClick={() => void say(name, { rate: 0.8 })}>
      {name}
    </button>
  )
}

beforeEach(() => {
  vi.mocked(speak).mockClear()
  vi.mocked(tts.cancel).mockClear()
})

describe('useSpeak', () => {
  it('走同一個發音入口（文字與語速照傳）', () => {
    render(<Speaker name="A" />)
    fireEvent.click(screen.getByText('A'))
    expect(vi.mocked(speak).mock.calls).toEqual([['A', { rate: 0.8 }]])
  })

  it('最後一次發音是自己發起的：卸載時取消', () => {
    const { unmount } = render(<Speaker name="A" />)
    fireEvent.click(screen.getByText('A'))
    unmount()
    expect(tts.cancel).toHaveBeenCalledTimes(1)
  })

  it('沒發過音就卸載：不取消', () => {
    const { unmount } = render(<Speaker name="A" />)
    unmount()
    expect(tts.cancel).not.toHaveBeenCalled()
  })

  it('最後一次發音是別的元件發起的：卸載時不取消（不誤殺下一個畫面的發音）', () => {
    const a = render(<Speaker name="A" />)
    render(<Speaker name="B" />)
    fireEvent.click(screen.getByText('A'))
    fireEvent.click(screen.getByText('B'))
    a.unmount()
    expect(tts.cancel).not.toHaveBeenCalled()
  })

  it('取消過一次後，另一個沒發音的元件卸載不再取消', () => {
    const a = render(<Speaker name="A" />)
    const b = render(<Speaker name="B" />)
    fireEvent.click(screen.getByText('A'))
    a.unmount()
    b.unmount()
    expect(tts.cancel).toHaveBeenCalledTimes(1)
  })
})
