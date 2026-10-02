// 題目檔與課綱同一套做法：?url 產出獨立 json 資產（不併進程式碼 bundle）、執行期 fetch、PWA 預快取
// E2E 建置（VITE_ITEM_FIXTURES=true）改讀樣本課 fixture；正式建置只讀 content/items（TASK-8 產出）
import type { LessonItemsDoc } from './items'

const urls =
  import.meta.env.VITE_ITEM_FIXTURES === 'true'
    ? import.meta.glob<string>('./fixtures/items/*.json', { query: '?url', import: 'default' })
    : import.meta.glob<string>('../../../content/items/{a1,a2,b1,b2,c1}/*.json', {
        query: '?url',
        import: 'default',
      })

/** 取一課的題目；沒有這課的題目檔時為 null */
export async function loadLessonItems(lessonId: string): Promise<LessonItemsDoc | null> {
  const key = Object.keys(urls).find((k) => k.endsWith(`/${lessonId}.json`))
  if (!key) return null
  const res = await fetch(await urls[key]())
  if (!res.ok) throw new Error(`題目載入失敗：${lessonId} ${res.status}`)
  return (await res.json()) as LessonItemsDoc
}
