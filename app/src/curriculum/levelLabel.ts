import { t } from '../i18n/t'
import { TOEIC_TOTAL, type Level } from './curriculum'

/** 「B1｜約多益 550+」（多益總分） */
export const levelLabel = (level: Level) =>
  t('common.level.toeic', { level, score: TOEIC_TOTAL[level] })
