// 預產音檔包對照表（TASK-35；檔名 → 帶雜湊的資產網址）：約 1,500 包，只由 speak.ts 以 import() 延遲載入，
// 不進首屏 index chunk（建置後由 scripts/check-entry-lazy.mjs 守住）。其他檔不可靜態 import 本檔
// E2E 建置（VITE_ITEM_FIXTURES=true）的課程音檔改讀樣本課 fixture（與題目檔同一組課）；字典專用包兩者相同
export const lessonAudioUrls =
  import.meta.env.VITE_ITEM_FIXTURES === 'true'
    ? import.meta.glob<string>('../lesson/fixtures/audio/*.lga', {
        query: '?url',
        import: 'default',
      })
    : import.meta.glob<string>('../../../content/audio/{a1,a2,b1,b2,c1}/*.lga', {
        query: '?url',
        import: 'default',
      })

export const dictAudioUrls = import.meta.glob<string>('../../../content/audio/dict/*.lga', {
  query: '?url',
  import: 'default',
})
