// 題目檔對照表（lessonId 檔名 → json 資產網址）：約 1000 課，只由 load.ts 以 import() 延遲載入，
// 不進首屏 index chunk（TASK-22 效能預算；建置後由 scripts/check-entry-lazy.mjs 守住）。其他檔不可靜態 import 本檔
// E2E 建置（VITE_ITEM_FIXTURES=true）改讀樣本課 fixture；正式建置只讀 content/items（TASK-8 產出）
export const itemUrls =
  import.meta.env.VITE_ITEM_FIXTURES === 'true'
    ? import.meta.glob<string>('./fixtures/items/*.json', { query: '?url', import: 'default' })
    : import.meta.glob<string>('../../../content/items/{a1,a2,b1,b2,c1}/*.json', {
        query: '?url',
        import: 'default',
      })
