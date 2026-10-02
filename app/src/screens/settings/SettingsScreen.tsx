// 設定（設計 s11 預設）＋清除資料確認（s13）；AI 批改區見 AiSection（TASK-15），帳號區為 TASK-20 掛點；
// 語音區：發音選擇與高音質發音下載（TASK-13），語音辨識下載為 TASK-14 掛點
import { ChevronRight, FileDown, Trash2 } from 'lucide-react'
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'
import { currentLevel } from '../../curriculum/curriculum'
import { LevelSheet } from '../../curriculum/LevelSheet'
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
import { stt } from '../../speech/stt'
import { SubScreen } from '../../shell/Screen'
import { hqVoice } from '../../speech/speak'
import type { VoiceChoice } from '../../speech/hqVoice'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { OptionSheet } from '../../ui/OptionSheet'
import { AccountSection } from './AccountSection'
import { AiSection } from './AiSection'
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

type Sheet = 'level' | 'dailyNew' | 'theme' | 'textSize' | 'voice' | null

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

function ModelRow({
  id,
  name,
  note,
  onStart,
  onRetry,
}: {
  id: DownloadId
  name: string
  note: string
  onStart: () => void
  onRetry: () => void
}) {
  const status = useDownloadStatus(id)
  return (
    <div className={rowCls}>
      <span className="grid min-w-0 leading-[1.35]">
        {name}
        <span className="text-caption text-muted">{note}</span>
      </span>
      <DownloadProgress status={status} label={name} onStart={onStart} onRetry={onRetry} />
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
    // 級距以設定為準，無值才依課程進度推導（TASK-17）
    return { settings, level: settings.cefrLevel ?? currentLevel(progress) }
  }, [])
  const [prefs, setPref] = usePrefs()
  const [sheet, setSheet] = useState<Sheet>(null)
  const [confirming, setConfirming] = useState(false)
  // 高音質發音（TASK-13 D5）：下載前告知檔案大小；未下載時選它＝導向下載
  const [confirmHq, setConfirmHq] = useState(false)
  const voice = useSyncExternalStore(hqVoice.subscribe, hqVoice.choice)
  const hqStatus = useDownloadStatus('tts-hq')
  const close = () => setSheet(null)
  const pickVoice = (v: VoiceChoice) => {
    if (v === 'hq' && hqStatus.kind !== 'downloaded') setConfirmHq(true)
    else hqVoice.setChoice(v)
  }
  // 語音辨識（TASK-14）：在這裡直接下載（下載完就釋放，不常駐記憶體）
  const sttStart = () => void stt.load().catch(() => undefined)

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
              onClick={() => setSheet('level')}
            />
            <Row
              label={t('settings.learning.dailyNew')}
              value={data?.settings.dailyNewLimit}
              onClick={() => setSheet('dailyNew')}
            />
          </Group>

          <AiSection />

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
              value={t(voice === 'hq' ? 'settings.voice.ttsHqValue' : 'settings.voice.ttsValue')}
              onClick={() => setSheet('voice')}
            />
            <ModelRow
              id="tts-hq"
              name={t('settings.voice.ttsHq')}
              note={t('settings.voice.ttsHqNote')}
              onStart={() => setConfirmHq(true)}
              onRetry={() => hqVoice.startDownload()}
            />
            <ModelRow
              id="stt"
              name={t('settings.voice.stt')}
              note={t('settings.voice.sttNote')}
              onStart={sttStart}
              onRetry={sttStart}
            />
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

      {sheet === 'level' && data && (
        <LevelSheet
          selected={data.level}
          onSelect={(level) => saveSettings(db, { cefrLevel: level }, Date.now())}
          onClose={close}
        />
      )}
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
      {sheet === 'voice' && (
        <OptionSheet<VoiceChoice>
          label={t('settings.voice.tts')}
          options={[
            { value: 'system', label: t('settings.voice.ttsValue') },
            ...(hqStatus.kind === 'unsupported'
              ? []
              : [{ value: 'hq' as const, label: t('settings.voice.ttsHq') }]),
          ]}
          selected={voice}
          onSelect={pickVoice}
          onClose={close}
        />
      )}
      {confirmHq && (
        <ConfirmDialog
          title={t('download.hq.confirmTitle')}
          body={t('download.hq.confirmBody')}
          safeLabel={t('common.text.later')}
          riskLabel={t('download.action.start')}
          onSafe={() => setConfirmHq(false)}
          onRisk={() => {
            setConfirmHq(false)
            hqVoice.startDownload()
          }}
        />
      )}
      {confirming && <ClearDataDialog onCancel={() => setConfirming(false)} onConfirm={clearNow} />}
    </SubScreen>
  )
}
