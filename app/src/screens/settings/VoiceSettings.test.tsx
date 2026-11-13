// 設定的語音區（TASK-35 起）：發音一律先播預先產生的音檔、沒有才用手機內建聲音，不需設定；
// 語音區只剩音效開關與語音辨識模型下載，沒有高音質發音的選項與下載列
import 'fake-indexeddb/auto'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/appDb'
import { SettingsScreen } from './SettingsScreen'

beforeEach(async () => {
  localStorage.clear()
  await db.delete()
  await db.open()
})

describe('設定・語音（s11）', () => {
  it('語音區只有音效與語音辨識模型', async () => {
    render(<SettingsScreen />)
    const group = (await screen.findByText('語音')).closest('section') ?? document.body
    expect(group).toHaveTextContent('音效')
    expect(group).toHaveTextContent('語音辨識模型')
    expect(group).toHaveTextContent('跟讀用・約 50–80MB')
  })

  it('沒有發音選單、高音質發音與其下載', async () => {
    render(<SettingsScreen />)
    await screen.findByText('語音辨識模型')
    expect(screen.queryByRole('button', { name: /^發音/ })).toBeNull()
    expect(screen.queryByText(/高音質/)).toBeNull()
    expect(screen.queryByText(/310MB/)).toBeNull()
  })
})
