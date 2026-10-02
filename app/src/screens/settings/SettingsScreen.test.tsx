import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getSettings } from '../../data/repo'
import { SettingsScreen } from './SettingsScreen'

beforeEach(async () => {
  history.replaceState(null, '', '/settings')
  localStorage.clear()
  delete document.documentElement.dataset.theme
  await db.delete()
  await db.open()
})
afterEach(() => vi.restoreAllMocks())

// 期望文案取自設計 s11／s13 與 zh-TW.json
describe('設定（s11）', () => {
  it('設定列只在大／特大字級才允許折行（標準字級的折行回歸不被豁免）', async () => {
    render(<SettingsScreen />)
    const row = await screen.findByRole('button', { name: /每日新字數/ })
    expect(row).not.toHaveAttribute('data-multiline')
    fireEvent.click(screen.getByRole('button', { name: /字級大小/ }))
    fireEvent.click(screen.getByRole('option', { name: '特大' }))
    expect(screen.getByRole('button', { name: /每日新字數/ })).toHaveAttribute('data-multiline')
  })

  it('預設：未分級、每日新字數 10、外觀跟隨系統、AI 未設定、帳號掛點', async () => {
    render(<SettingsScreen />)
    expect(await screen.findByRole('button', { name: /每日新字數\s*10/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /目前級距\s*還沒有分級/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /外觀\s*跟隨系統/ })).toBeInTheDocument()
    expect(screen.getByText('狀態：未設定')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '下載高音質發音（選配）' })).toBeInTheDocument()
    expect(screen.getByTestId('settings-account-slot')).toHaveTextContent(
      '未登入：進度只存在這支手機',
    )
  })

  it('有進度時顯示目前級距', async () => {
    await db.courseProgress.put({ lessonId: 'b2-u01-l01', completedAt: 1, updatedAt: 0 })
    render(<SettingsScreen />)
    expect(
      await screen.findByRole('button', { name: /目前級距\s*B2｜約多益 400\+/ }),
    ).toBeInTheDocument()
  })

  it('每日新字數：底部彈層選 20 → 寫入資料庫', async () => {
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: /每日新字數\s*10/ }))
    const sheet = screen.getByRole('dialog', { name: '每日新字數' })
    expect(
      within(sheet)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['5', '10', '15', '20', '30'])
    fireEvent.click(within(sheet).getByRole('option', { name: '20' }))
    await waitFor(async () => expect((await getSettings(db)).dailyNewLimit).toBe(20))
    expect(await screen.findByRole('button', { name: /每日新字數\s*20/ })).toBeInTheDocument()
  })

  it('外觀選深色：套到 <html data-theme> 並存起來', async () => {
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: /外觀\s*跟隨系統/ }))
    fireEvent.click(screen.getByRole('option', { name: '深色' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('lg.theme')).toBe('dark')
    expect(screen.getByRole('button', { name: /外觀\s*深色/ })).toBeInTheDocument()
  })

  it('匯出學習紀錄：下載 json 檔', async () => {
    const createUrl = vi.fn(() => 'blob:x')
    vi.stubGlobal(
      'URL',
      Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() }),
    )
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '匯出學習紀錄' }))
    await waitFor(() => expect(click).toHaveBeenCalledOnce())
    const blob = (createUrl.mock.calls[0] as unknown as [Blob])[0]
    expect(blob.type).toBe('application/json')
    expect(JSON.parse(await blob.text())).toMatchObject({ app: 'linguaapp', schemaVersion: 3 })
  })
})

describe('清除資料確認（s13）', () => {
  it('未勾選時清除鈕停用；焦點在取消；Esc 等於取消', async () => {
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '清除這支手機上的資料' }))
    const dialog = screen.getByRole('alertdialog', { name: '清除這支手機上的所有學習資料？' })
    const clearBtn = within(dialog).getByRole('button', { name: '清除資料' })
    expect(clearBtn).toBeDisabled()
    // 設計 s13（review.src.html:884）：停用時沒有垃圾桶圖示；勾選後才出現
    expect(clearBtn.querySelector('svg')).toBeNull()
    fireEvent.click(within(dialog).getByRole('checkbox', { name: '我了解資料無法復原' }))
    expect(
      within(dialog).getByRole('button', { name: '清除資料' }).querySelector('svg'),
    ).not.toBeNull()
    expect(within(dialog).getByRole('button', { name: '取消' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('勾選後可清除：刪除資料庫、清偏好、回首頁重新載入', async () => {
    await db.courseProgress.put({ lessonId: 'a1-u01-l01', completedAt: 1, updatedAt: 0 })
    localStorage.setItem('lg.theme', 'dark')
    const assign = vi.fn()
    vi.stubGlobal('location', { ...location, assign })
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '清除這支手機上的資料' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '我了解資料無法復原' }))
    const confirm = screen.getByRole('button', { name: '清除資料' })
    expect(confirm).toBeEnabled()
    fireEvent.click(confirm)
    await waitFor(() => expect(assign).toHaveBeenCalledWith('/'))
    expect(localStorage.getItem('lg.theme')).toBeNull()
    vi.unstubAllGlobals()
    expect(await Dexie.exists(db.name)).toBe(false)
  })

  it('清除失敗：顯示通用失敗文案（原始錯誤只進 console）、按鈕恢復可按', async () => {
    // 原始錯誤常是 Dexie 的英文訊息，不能直接給使用者看
    const raw = new Error('DatabaseClosedError: Database has been closed')
    vi.spyOn(db, 'delete').mockRejectedValueOnce(raw)
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '清除這支手機上的資料' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '我了解資料無法復原' }))
    fireEvent.click(screen.getByRole('button', { name: '清除資料' }))
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('清除失敗，請關閉其他分頁後再試一次')
    expect(alert).not.toHaveTextContent('Database')
    expect(logged).toHaveBeenCalledWith(raw)
    expect(screen.getByRole('button', { name: '清除資料' })).toBeEnabled()
  })
})
