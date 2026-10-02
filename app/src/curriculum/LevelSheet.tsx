// 選級距彈層（TASK-17）：設定頁「目前級距」與分級結果頁「想自己選級距」共用
import { t } from '../i18n/t'
import { OptionSheet } from '../ui/OptionSheet'
import { LEVELS, type Level } from './curriculum'
import { levelLabel } from './levelLabel'

export function LevelSheet({
  selected,
  onSelect,
  onClose,
}: {
  selected: Level | null
  onSelect: (level: Level) => void
  onClose: () => void
}) {
  return (
    <OptionSheet
      label={t('settings.learning.level')}
      options={LEVELS.map((level) => ({ value: level, label: levelLabel(level) }))}
      selected={selected}
      onSelect={onSelect}
      onClose={onClose}
    />
  )
}
