// 各級進度明細（TASK-26）：A1–C1 記得字數／該級總數，進度條 70% 處畫刻度線；點成長卡才載入
import { Info } from 'lucide-react'
import { t } from '../i18n/t'
import { BottomSheet } from '../ui/BottomSheet'
import { cardTitleCls } from '../ui/Card'
import type { LevelProgress } from './growth'
import { GrowthBar } from './GrowthCard'

export default function GrowthSheet({
  levels,
  onClose,
}: {
  levels: LevelProgress[]
  onClose: () => void
}) {
  return (
    <BottomSheet label={t('home.growth.detailTitle')} onClose={onClose}>
      <h2 className={cardTitleCls}>{t('home.growth.detailTitle')}</h2>
      <p className="flex gap-1.5 text-secondary text-muted">
        <Info size={20} aria-hidden="true" className="shrink-0" />
        {t('home.growth.rememberedInfo')}
      </p>
      <ul className="grid gap-4">
        {levels.map((l) => (
          <li key={l.level} data-testid={`growth-level-${l.level}`} className="grid gap-1.5">
            <span className="flex justify-between font-bold tabular-nums">
              <span>{l.level}</span>
              <span>{`${l.remembered}／${l.total}`}</span>
            </span>
            <GrowthBar ratio={l.total ? l.remembered / l.total : 0} />
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}
