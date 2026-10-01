import { t } from '../i18n/t'
import { TOEIC_LISTENING, type Level } from './curriculum'

/** 「B1｜約多益 275+」 */
export const levelLabel = (level: Level) =>
  t('common.level.toeic', { level, score: TOEIC_LISTENING[level] })
