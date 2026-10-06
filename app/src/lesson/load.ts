// 題目檔與課綱同一套做法：?url 產出獨立 json 資產（不併進程式碼 bundle）、執行期 fetch、PWA 預快取
// 對照表（itemUrls.ts）第一次需要時才以 import() 取得：不進首屏 index chunk；其 chunk 一樣預快取，離線可用
import type { LessonItemsDoc } from './items'

/** 取一課的題目；沒有這課的題目檔時為 null */
export async function loadLessonItems(lessonId: string): Promise<LessonItemsDoc | null> {
  const { itemUrls } = await import('./itemUrls')
  const key = Object.keys(itemUrls).find((k) => k.endsWith(`/${lessonId}.json`))
  if (!key) return null
  const res = await fetch(await itemUrls[key]())
  if (!res.ok) throw new Error(`題目載入失敗：${lessonId} ${res.status}`)
  return (await res.json()) as LessonItemsDoc
}
