// 跟讀用到的瀏覽器能力（辨識、麥克風）；畫面經 context 取用，單元測試與 e2e 可換成假的
import { createContext, useContext } from 'react'
import {
  micPermission,
  micSupported,
  requestMic,
  startRecording,
  type MicPermission,
  type Recording,
} from './mic'
import { e2eSpeechServices } from './e2eSpeech'
import { stt, type SttClient } from './stt'
import { isSttUsable } from './usable'
import { webSpeech, type WebSpeech } from './webSpeech'

export interface SpeechServices {
  stt: SttClient
  /** 本機辨識需要 WebAssembly；沒有就只能用瀏覽器語音辨識後備 */
  moonshineAvailable(): boolean
  micPermission(): Promise<MicPermission>
  requestMic(): Promise<boolean>
  startRecording(onLevel?: (level: number) => void): Promise<Recording>
  webSpeech: WebSpeech
  /** 這支手機能不能做跟讀（題型替代規則用，TASK-18 capabilities） */
  sttUsable(): boolean
}

const wasmAvailable = () => typeof WebAssembly === 'object'

const realSpeechServices: SpeechServices = {
  stt,
  moonshineAvailable: wasmAvailable,
  // e2e 主套件（playwright.config 設 VITE_E2E_STT=off）固定不可用：兩引擎都走「無 STT」替代路徑，題數一致；
  // 跟讀本身由 playwright.speech.config.ts 驗。一般建置此判斷為常數，整段移除
  sttUsable: () =>
    import.meta.env.VITE_E2E_STT !== 'off' &&
    isSttUsable(micSupported(), wasmAvailable(), webSpeech.consented()),
  micPermission,
  requestMic,
  startRecording,
  webSpeech,
}

// e2e 建置（VITE_E2E_SPEECH）才可換成假的；一般建置此判斷為常數 false，e2eSpeech 整個被移除
export const defaultSpeechServices: SpeechServices =
  import.meta.env.VITE_E2E_SPEECH === 'true'
    ? e2eSpeechServices(realSpeechServices)
    : realSpeechServices

export const SpeechContext = createContext<SpeechServices>(defaultSpeechServices)

export const useSpeech = () => useContext(SpeechContext)
