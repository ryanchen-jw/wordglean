// 發音服務（TASK-13）：預設手機內建聲音；使用者選了高音質（Kokoro 選配，Stage 4 接上）才載入，
// 載入或合成失敗就這一句改用內建聲音、提示一次，本次開啟不再重試（規格 §2、voice-poc §5）
export type Rate = 1 | 0.8
export type EngineId = 'system' | 'hq'

export interface VoiceEngine {
  /** 念完（或失敗被吞掉）才 resolve；高音質引擎失敗時 reject 以觸發退回 */
  speak(text: string, rate: Rate): Promise<void>
  cancel(): void
}

export type TtsNotice = { kind: 'hqFailed' }

export interface TtsDeps {
  /** null＝瀏覽器沒有內建聲音 */
  system: VoiceEngine | null
  loadHq?: () => Promise<VoiceEngine>
  /** 使用者在設定選了高音質發音（且已下載） */
  wantHq: () => boolean
}

export interface Tts {
  speak(text: string, opts?: { rate?: Rate }): Promise<EngineId | 'none'>
  /** 目前會用哪個引擎（題目卡顯示「手機內建聲音」用） */
  engine(): EngineId
  /** 高音質這次開啟內已失敗、改用內建聲音 */
  hqFailed(): boolean
  onNotice(listener: (n: TtsNotice) => void): () => void
}

export function createTts({ system, loadHq, wantHq }: TtsDeps): Tts {
  let hq: Promise<VoiceEngine> | null = null
  let hqBroken = false
  const listeners = new Set<(n: TtsNotice) => void>()

  const hqOn = () => !hqBroken && !!loadHq && wantHq()

  const fallBack = () => {
    hqBroken = true
    listeners.forEach((l) => l({ kind: 'hqFailed' }))
  }

  async function viaSystem(text: string, rate: Rate) {
    if (!system) return 'none' as const
    await system.speak(text, rate)
    return 'system' as const
  }

  return {
    async speak(text, { rate = 1 } = {}) {
      system?.cancel()
      if (hqOn()) {
        try {
          hq ??= loadHq!()
          const engine = await hq
          engine.cancel()
          await engine.speak(text, rate)
          return 'hq'
        } catch {
          if (!hqBroken) fallBack()
        }
      }
      return viaSystem(text, rate)
    },
    engine: () => (hqOn() ? 'hq' : 'system'),
    hqFailed: () => hqBroken,
    onNotice(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
