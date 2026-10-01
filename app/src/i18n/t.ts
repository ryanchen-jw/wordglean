// 介面文案讀取：字串一律放 zh-TW.json（草稿，待 TASK-4 G3 定稿回寫）；key 由 json 型別推導，寫錯編譯失敗
import messages from './zh-TW.json'

type Messages = Omit<typeof messages, '_status'>

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

export type MessageKey = Leaves<Messages>

/** 取文案；`{name}` 以 params 對應值替換 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  let node: unknown = messages
  for (const part of key.split('.')) node = (node as Record<string, unknown>)[part]
  const text = node as string
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole,
  )
}
