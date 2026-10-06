/** 成長卡佔位：計算模組載入前與資料讀取中，高度與成長卡相近，避免下方內容跳動（首頁靜態引用，須保持極小） */
export function GrowthSkeleton() {
  return (
    <div
      data-testid="growth-skeleton"
      className="grid min-w-0 gap-2.5 rounded-card border border-line bg-surface p-5"
    >
      <div className="h-6 w-24 rounded-md bg-line" />
      <div className="h-5 w-40 rounded-md bg-line" />
      <div className="h-2 rounded-full bg-line" />
      <div className="h-12 rounded-md bg-line" />
    </div>
  )
}
