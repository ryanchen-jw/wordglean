// 清除資料二次確認（設計 s13、components.md §13）：勾選後危險鈕才可按；安全選項在上、開啟時取得焦點
import { Check, CircleX, LoaderCircle, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { t } from '../../i18n/t'
import { Button } from '../../ui/Button'

type Props = { onCancel: () => void; onConfirm: () => Promise<void> }

export function ClearDataDialog({ onCancel, onConfirm }: Props) {
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const cancelBtn = useRef<HTMLButtonElement>(null)
  const state = useRef({ busy, onCancel })
  useEffect(() => {
    state.current = { busy, onCancel }
  })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    cancelBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !state.current.busy) state.current.onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [])

  const confirm = async () => {
    setBusy(true)
    setFailed(false)
    try {
      await onConfirm()
    } catch (e) {
      // 原始錯誤（常是 Dexie 的英文訊息）只進 console，畫面顯示通用文案
      console.error(e)
      setFailed(true)
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center px-5">
      <div
        data-testid="dialog-scrim"
        className="absolute inset-0 animate-[lg-fade-in_var(--lg-duration-feedback)_var(--lg-ease)] bg-scrim"
        onClick={() => !busy && onCancel()}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="clear-title"
        aria-describedby="clear-desc"
        className="relative grid max-h-[calc(100dvh-40px)] w-full gap-3 overflow-y-auto overscroll-contain rounded-card bg-surface px-5 pt-6 pb-5 shadow-sheet"
      >
        <h2 id="clear-title" className="font-heading text-title-sm font-bold text-balance">
          {t('clearData.dialog.title')}
        </h2>
        <p id="clear-desc" className="text-secondary text-muted">
          {t('clearData.dialog.body')}
        </p>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-secondary">
          <input
            type="checkbox"
            checked={checked}
            disabled={busy}
            onChange={(e) => setChecked(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={`grid size-5.5 flex-none place-items-center rounded-md border-2 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus ${
              checked ? 'border-primary bg-primary text-on-primary' : 'border-border'
            }`}
          >
            {checked && <Check size={16} />}
          </span>
          {t('clearData.dialog.confirmCheck')}
        </label>
        {failed && (
          <p role="alert" className="flex items-start gap-1.5 text-secondary text-error">
            {/* 圖示對齊第一行文字（行高 1.7×15px ≈ 26px，圖示 20px） */}
            <CircleX size={20} aria-hidden="true" className="mt-[3px] flex-none" />
            {t('clearData.dialog.failed')}
          </p>
        )}
        <Button ref={cancelBtn} disabled={busy} onClick={onCancel}>
          {t('clearData.dialog.cancel')}
        </Button>
        <Button variant="danger" disabled={!checked || busy} aria-busy={busy} onClick={confirm}>
          {busy ? (
            <>
              <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />
              {t('clearData.dialog.busy')}
            </>
          ) : (
            <>
              {/* 設計 s13：停用時不顯示圖示，勾選後才出現 */}
              {checked && <Trash2 size={20} aria-hidden="true" />}
              {t('clearData.dialog.confirm')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
