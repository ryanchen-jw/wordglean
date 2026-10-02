// 全 App 共用一個字典彈層：<DictionaryProvider> 掛在 App 根層，<EnglishText> 透過本 context 開彈層
import { createContext, useContext } from 'react'
import type { LookupDeps } from './lookup'

export interface OpenRequest {
  token: string
  sentenceStart: boolean
  /** 被點的字；彈層開啟期間標示、關閉後焦點還給它 */
  el: HTMLElement
}

export interface DictionaryApi {
  open(req: OpenRequest): void
  /** 字典來源（單字庫的中文釋義也用這份） */
  deps(): Promise<LookupDeps>
}

export const DictionaryContext = createContext<DictionaryApi | null>(null)

/** 沒有 Provider（例：個別元件的單元測試）時為 null，<EnglishText> 退回純文字 */
export const useDictionary = () => useContext(DictionaryContext)
