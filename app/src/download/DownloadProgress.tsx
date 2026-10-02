// 下載狀態（components.md §4「模型下載進度」）：未下載＝下載鈕；下載中＝進度條＋百分比；失敗＝錯誤色＋重試；
// 不支援（高音質發音需要 WebGPU，TASK-13）＝灰字說明、不能下載
import { Download } from 'lucide-react'
import { t } from '../i18n/t'
import type { DownloadStatus } from './download'

type Props = { status: DownloadStatus; label: string; onStart: () => void; onRetry: () => void }

export function DownloadProgress({ status, label, onStart, onRetry }: Props) {
  if (status.kind === 'downloaded')
    return (
      <span className="flex-none text-secondary whitespace-nowrap text-muted">
        {t('download.status.done')}
      </span>
    )

  // 說明比「已下載」長：允許折行、最多佔一半寬，窄螢幕特大字級時不把左側名稱擠成直排
  if (status.kind === 'unsupported')
    return (
      <span className="max-w-1/2 min-w-[4em] text-right text-secondary text-muted">
        {t('settings.voice.hqUnsupported')}
      </span>
    )

  if (status.kind === 'notDownloaded')
    return (
      <button
        type="button"
        onClick={onStart}
        aria-label={t('download.action.startNamed', { name: label })}
        className="-mr-2 inline-flex min-h-11 flex-none items-center gap-1 rounded-xl px-2 text-secondary whitespace-nowrap text-muted active:bg-primary-soft"
      >
        <Download size={20} aria-hidden="true" />
        {t('download.action.start')}
      </button>
    )

  const failed = status.kind === 'failed'
  const pct = failed ? 0 : Math.round(status.progress * 100)
  return (
    <span className="flex min-w-28 flex-none flex-col items-end gap-1">
      <span
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={failed ? undefined : pct}
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <span
          className={`block h-full rounded-full ${failed ? 'w-full bg-error' : 'bg-primary'}`}
          style={failed ? undefined : { width: `${pct}%` }}
        />
      </span>
      {failed ? (
        <button
          type="button"
          onClick={onRetry}
          className="-my-2 min-h-11 text-caption text-error active:bg-primary-soft"
        >
          {t('download.status.failedRetry')}
        </button>
      ) : (
        <span className="text-caption text-muted tabular-nums">
          {t('download.status.percent', { n: pct })}
        </span>
      )}
    </span>
  )
}
