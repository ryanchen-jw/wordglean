// 發音服務（TASK-13，TASK-35 改版）：優先播預先產生的音檔（clips.ts）；這段文字沒有音檔、音檔載入或播放失敗時，
// 這一句改用手機內建聲音。逐句判斷，不會因一次失敗就整段時間不用音檔
export type Rate = 1 | 0.8
export type EngineId = 'clip' | 'system'

export interface VoiceEngine {
  /** 念完（或失敗被吞掉）才 resolve */
  speak(text: string, rate: Rate): Promise<void>
  cancel(): void
}

/** 預先產生的音檔（clips.ts 的 ClipEngine 實作） */
export interface ClipSource<C = unknown> {
  /** 找這段文字的音檔；沒有＝null */
  find(text: string): Promise<C | null>
  /** 播完才 resolve；被 stop() 停下也 resolve；無法播放時 reject */
  play(clip: C, rate: Rate): Promise<void>
  stop(): void
}

export interface TtsDeps {
  /** null＝瀏覽器沒有內建聲音 */
  system: VoiceEngine | null
  /** null＝這個瀏覽器不能播預產音檔 */
  clips: ClipSource | null
}

export interface Tts {
  /** 以最後一次呼叫為準（TASK-31）：等待中被後來的呼叫取代的不出聲，正常結束並回 'superseded' */
  speak(text: string, opts?: { rate?: Rate }): Promise<EngineId | 'none' | 'superseded'>
  /** 取消（離開畫面用，TASK-32）：等待中的請求都不出聲、回 'superseded'，正在念的立即停止 */
  cancel(): void
}

export function createTts({ system, clips }: TtsDeps): Tts {
  let latest = 0

  async function viaSystem(text: string, rate: Rate) {
    if (!system) return 'none' as const
    await system.speak(text, rate)
    return 'system' as const
  }

  return {
    async speak(text, { rate = 1 } = {}) {
      const request = ++latest
      system?.cancel()
      clips?.stop()
      if (clips) {
        try {
          const clip = await clips.find(text)
          if (request !== latest) return 'superseded'
          if (clip !== null) {
            await clips.play(clip, rate)
            return request === latest ? 'clip' : 'superseded'
          }
        } catch {
          // 找不到或播不出來：這一句改用內建聲音；已被取代的就不出聲
          if (request !== latest) return 'superseded'
        }
      }
      return viaSystem(text, rate)
    },
    cancel() {
      latest++
      system?.cancel()
      clips?.stop()
    },
  }
}
