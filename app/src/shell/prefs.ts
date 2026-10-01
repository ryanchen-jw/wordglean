// 外觀與字級（D7）：每台裝置各自的偏好，存 localStorage、不進同步表；讀寫失敗（私密模式等）時用預設值
import { useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'
export type TextSize = 'md' | 'lg' | 'xl'
export interface Prefs {
  theme: Theme
  textSize: TextSize
}

export const DEFAULT_PREFS: Prefs = { theme: 'system', textSize: 'md' }
const KEYS = { theme: 'lg.theme', textSize: 'lg.textSize' } as const
const VALID = { theme: ['system', 'light', 'dark'], textSize: ['md', 'lg', 'xl'] }

function read<K extends keyof Prefs>(key: K): Prefs[K] {
  try {
    const v = localStorage.getItem(KEYS[key])
    if (v && VALID[key].includes(v)) return v as Prefs[K]
  } catch {
    // 儲存區不可用：用預設值
  }
  return DEFAULT_PREFS[key]
}

export const readPrefs = (): Prefs => ({ theme: read('theme'), textSize: read('textSize') })

/** 套到 <html>：data-theme（不設＝跟隨系統）、data-text-size（不設＝標準），見 tokens.css */
export function applyPrefs(p: Prefs, root = document.documentElement) {
  if (p.theme === 'system') delete root.dataset.theme
  else root.dataset.theme = p.theme
  if (p.textSize === 'md') delete root.dataset.textSize
  else root.dataset.textSize = p.textSize
}

export function savePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  try {
    localStorage.setItem(KEYS[key], value)
  } catch {
    // 存不下就只在這次開啟期間生效
  }
}

export function clearPrefs() {
  try {
    for (const k of Object.values(KEYS)) localStorage.removeItem(k)
  } catch {
    // 同上
  }
}

export function usePrefs(): [Prefs, <K extends keyof Prefs>(key: K, value: Prefs[K]) => void] {
  const [prefs, setPrefs] = useState(readPrefs)
  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const next = { ...prefs, [key]: value }
    savePref(key, value)
    applyPrefs(next)
    setPrefs(next)
  }
  return [prefs, set]
}
