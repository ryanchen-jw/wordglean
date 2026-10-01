// 設定（設計 s11 預設）＋清除資料確認（s13）；AI 批改為佔位（TASK-15），帳號區為 TASK-20 掛點
import { ChevronRight, FileDown, KeyRound, Lock, Trash2 } from 'lucide-react'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { currentLevel } from '../../curriculum/curriculum'
import { levelLabel } from '../../curriculum/levelLabel'
import { db } from '../../data/appDb'
import { clearLocalData, exportData } from '../../data/localData'
import { getSettings, saveSettings } from '../../data/repo'
import { useLiveQuery } from '../../data/useLiveQuery'
import { DownloadProgress } from '../../download/DownloadProgress'
import { useDownloadStatus, type DownloadId } from '../../download/download'
import { t, type MessageKey } from '../../i18n/t'
import { navigate } from '../../router'
import { clearPrefs, usePrefs, type Prefs } from '../../shell/prefs'
import { SubScreen } from '../../shell/Screen'
import { Button } from '../../ui/Button'
import { OptionSheet } from '../../ui/OptionSheet'
import { AccountSection } from './AccountSection'
import { ClearDataDialog } from './ClearDataDialog'

const DAILY_NEW_OPTIONS = [5, 10, 15, 20, 30] as const

const THEMES: { value: Prefs['theme']; label: MessageKey }[] = [
  { value: 'system', label: 'settings.appearance.themeSystem' },
  { value: 'light', label: 'settings.appearance.themeLight' },
  { value: 'dark', label: 'settings.appearance.themeDark' },
]
const TEXT_SIZES: { value: Prefs['textSize']; label: MessageKey }[] = [
  { value: 'md', label: 'settings.appearance.textSizeMd' },
  { value: 'lg', label: 'settings.appearance.textSizeLg' },
  { value: 'xl', label: 'settings.appearance.textSizeXl' },
]

type Sheet = 'dailyNew' | 'theme' | 'textSize' | null

const rowCls =
  'flex min-h-13 w-full items-center justify-between gap-3 border border-t-0 border-line bg-surface px-4 text-left first:rounded-t-2xl first:border-t last:rounded-b-2xl'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid">
      <h2 className="px-1 pb-1.5 text-caption tracking-[0.04em] text-muted">{title}</h2>
      <div className="grid">{children}</div>
    </section>
  )
}

// 大／特大字級時設定列允許折行（量測豁免 data-multiline）；標準字級仍必須單行，折行即回歸
const RowWrapContext = createContext(false)

function Row({
  label,
  value,
  onClick,
  danger,
  icon,
}: {
  label: ReactNode
  value?: ReactNode
  onClick: () => void
  danger?: boolean
  icon?: ReactNode
}) {
  const wrap = useContext(RowWrapContext)
  return (
    // 值可收縮、靠右，箭頭不縮
    <button
      type="button"
      onClick={onClick}
      data-multiline={wrap || undefined}
      className={`${rowCls} py-1.5 active:bg-primary-soft`}
    >
      {/* 標籤至少保留 3 字寬，避免被長的值擠成直排；圖示不縮 */}
      <span className={`flex min-w-[3em] items-center gap-2 ${danger ? 'text-error' : ''}`}>
        {icon && <span className="flex flex-none">{icon}</span>}
        {label}
      </span>
      <span className="inline-flex min-w-0 items-center gap-1 text-right text-secondary text-muted">
        {value}
        <ChevronRight size={20} aria-hidden="true" className="flex-none" />
      </span>
    </button>
  )
}

function ModelRow({ id, name, note }: { id: DownloadId; name: string; note: string }) {
  const status = useDownloadStatus(id)
  // 真下載由 TASK-13／14 接上；骨架階段導到「尚未開放」
  const start = () => navigate('/models')
  return (
    <div className={rowCls}>
      <span className="grid min-w-0 leading-[1.35]">
        {name}
        <span className="text-caption text-muted">{note}</span>
      </span>
      <DownloadProgress status={status} label={name} onStart={start} onRetry={start} />
    </div>
  )
}

function downloadJson(data: unknown, fileName: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function SettingsScreen() {
  const data = useLiveQuery(async () => {
    const [settings, progress] = await Promise.all([getSettings(db), db.courseProgress.toArray()])
    return { settings, level: currentLevel(progress) }
  }, [])
  const [prefs, setPref] = usePrefs()
  const [sheet, setSheet] = useState<Sheet>(null)
  const [confirming, setConfirming] = useState(false)
  const close = () => setSheet(null)

  const exportNow = async () => {
    const nowMs = Date.now()
    const file = await exportData(db, nowMs)
    downloadJson(file, `linguaapp-${new Date(nowMs).toISOString().slice(0, 10)}.json`)
  }

  const clearNow = async () => {
    await clearLocalData(db)
    clearPrefs()
    // 資料庫已刪，整個 App 重新載入回到首次開啟狀態
    location.assign('/')
  }

  return (
    <SubScreen title={t('settings.header.title')}>
      <RowWrapContext value={prefs.textSize !== 'md'}>
        <div data-testid="screen-settings" className="contents">
          <Group title={t('settings.learning.title')}>
            <Row
              label={t('settings.learning.level')}
              value={
                data && (data.level ? levelLabel(data.level) : t('settings.learning.unplaced'))
              }
              onClick={() => navigate(data?.level ? `/course?level=${data.level}` : '/course')}
            />
            <Row
              label={t('settings.learning.dailyNew')}
              value={data?.settings.dailyNewLimit}
              onClick={() => setSheet('dailyNew')}
            />
          </Group>

          <section className="grid gap-2.5 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-caption tracking-[0.04em] text-muted">{t('settings.ai.title')}</h2>
            <span className="text-secondary text-muted">{t('settings.ai.status')}</span>
            {/* 文案待 G3；窄螢幕特大字級允許折兩行、置中（走查 P1-2） */}
            <Button
              data-multiline
              className="py-2 text-center"
              onClick={() => navigate('/openrouter')}
            >
              {/* 圖示與文字同一段行內內容：折行時圖示跟著第一行、整段置中 */}
              <span className="text-balance">
                <KeyRound size={20} aria-hidden="true" className="mr-2 inline align-[-0.2em]" />
                {t('settings.ai.oauthButton')}
              </span>
            </Button>
            <Button variant="text" onClick={() => navigate('/openrouter')}>
              {t('settings.ai.pasteKey')}
              <ChevronRight size={20} aria-hidden="true" />
            </Button>
            <span className="flex gap-1.5 text-caption text-muted">
              <Lock size={20} aria-hidden="true" className="flex-none" />
              {t('settings.ai.privacy')}
            </span>
          </section>

          <Group title={t('settings.appearance.title')}>
            <Row
              label={t('settings.appearance.theme')}
              value={t(THEMES.find((x) => x.value === prefs.theme)!.label)}
              onClick={() => setSheet('theme')}
            />
            <Row
              label={t('settings.appearance.textSize')}
              value={t(TEXT_SIZES.find((x) => x.value === prefs.textSize)!.label)}
              onClick={() => setSheet('textSize')}
            />
          </Group>

          <Group title={t('settings.voice.title')}>
            <Row
              label={t('settings.voice.tts')}
              value={t('settings.voice.ttsValue')}
              onClick={() => navigate('/models')}
            />
            <ModelRow
              id="tts-hq"
              name={t('settings.voice.ttsHq')}
              note={t('settings.voice.ttsHqNote')}
            />
            <ModelRow id="stt" name={t('settings.voice.stt')} note={t('settings.voice.sttNote')} />
          </Group>

          <Group title={t('settings.data.title')}>
            <Row
              label={t('settings.data.export')}
              icon={<FileDown size={20} aria-hidden="true" />}
              onClick={exportNow}
            />
            <Row
              label={t('settings.data.clear')}
              icon={<Trash2 size={20} aria-hidden="true" />}
              danger
              onClick={() => setConfirming(true)}
            />
          </Group>

          <section className="grid">
            <h2 className="px-1 pb-1.5 text-caption tracking-[0.04em] text-muted">
              {t('settings.account.title')}
            </h2>
            <AccountSection />
          </section>

          <Group title={t('settings.other.title')}>
            <Row label={t('settings.other.about')} onClick={() => navigate('/about')} />
          </Group>
        </div>
      </RowWrapContext>

      {sheet === 'dailyNew' && data && (
        <OptionSheet
          label={t('settings.learning.dailyNewSheet')}
          options={DAILY_NEW_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
          selected={data.settings.dailyNewLimit}
          onSelect={(n) => saveSettings(db, { dailyNewLimit: n }, Date.now())}
          onClose={close}
        />
      )}
      {sheet === 'theme' && (
        <OptionSheet
          label={t('settings.appearance.theme')}
          options={THEMES.map((x) => ({ value: x.value, label: t(x.label) }))}
          selected={prefs.theme}
          onSelect={(v) => setPref('theme', v)}
          onClose={close}
        />
      )}
      {sheet === 'textSize' && (
        <OptionSheet
          label={t('settings.appearance.textSize')}
          options={TEXT_SIZES.map((x) => ({ value: x.value, label: t(x.label) }))}
          selected={prefs.textSize}
          onSelect={(v) => setPref('textSize', v)}
          onClose={close}
        />
      )}
      {confirming && <ClearDataDialog onCancel={() => setConfirming(false)} onConfirm={clearNow} />}
    </SubScreen>
  )
}
