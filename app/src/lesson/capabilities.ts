// 能力偵測與替代規則：手機不能播音（TTS）、不能辨識語音（STT）、沒有 OpenRouter 金鑰時，題目換題型、改自評或略過，
// 不讓使用者卡住。規則見 docs/verification/2026-10-02-task18-daily-flow-evidence/proposal.md
import type { ItemType, LessonItem, LessonItemsDoc } from './items'

export interface Capabilities {
  tts: boolean
  stt: boolean
  llmKey: boolean
}

type Fallback = 'skip' | 'selfCheck' | { to: ItemType }

/** 替代規則設定：各題型需要的能力與不可用時的處理；未列出的題型（讀類）不需任何能力 */
export const CAPABILITY_RULES: Partial<
  Record<ItemType, { needs: keyof Capabilities; fallback: Fallback }>
> = {
  listenType: { needs: 'tts', fallback: 'skip' },
  listenChoice: { needs: 'tts', fallback: 'skip' },
  // 跟讀與聽音打字欄位相同（sentenceEn／sentenceZh），換題型後再套聽音打字的規則
  shadowing: { needs: 'stt', fallback: { to: 'listenType' } },
  // 規格 §6：沒有金鑰時寫作題對照參考答案、自己判斷對錯（畫面屬 TASK-15）
  translate: { needs: 'llmKey', fallback: 'selfCheck' },
  makeSentence: { needs: 'llmKey', fallback: 'selfCheck' },
}

export interface CapabilityChange {
  itemId: string
  from: ItemType
  to: ItemType | 'skip' | 'selfCheck'
}

/** 依能力套用替代規則；略過的題目從題目檔移除，自評的題目加上 selfCheck: true */
export function applyCapabilities(
  doc: LessonItemsDoc,
  caps: Capabilities,
): { doc: LessonItemsDoc; changes: CapabilityChange[] } {
  const changes: CapabilityChange[] = []
  const items: LessonItem[] = []
  for (const original of doc.items) {
    let item = original
    let outcome: CapabilityChange['to'] | null = null
    for (let rule = CAPABILITY_RULES[item.type]; rule && !caps[rule.needs];) {
      const fb = rule.fallback
      if (fb === 'skip' || fb === 'selfCheck') {
        outcome = fb
        break
      }
      item = { ...item, type: fb.to } as LessonItem
      outcome = fb.to
      rule = CAPABILITY_RULES[fb.to]
    }
    if (outcome !== null) changes.push({ itemId: item.id, from: original.type, to: outcome })
    if (outcome === 'skip') continue
    items.push(
      outcome === 'selfCheck' ? Object.assign({}, item, { selfCheck: true as const }) : item,
    )
  }
  return { doc: { ...doc, items }, changes }
}

/**
 * 目前裝置的能力；金鑰（TASK-15）併入前固定不可用。
 * TTS、STT 由呼叫端傳入服務的判斷（speech/speak.ts ttsAvailable：內建聲音或已下載的高音質，TASK-13；
 * speech/services.ts sttUsable：能錄音且能跑本機辨識、或已同意瀏覽器語音辨識，TASK-14）；
 * 本檔不直接 import 語音服務，保持純邏輯（node 環境的單元測試也能載入）
 */
export function detectCapabilities(
  ttsAvailable: () => boolean = () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  sttUsable: () => boolean = () => false,
): Capabilities {
  return {
    tts: ttsAvailable(),
    stt: sttUsable(),
    llmKey: false,
  }
}
