// 題目裡的中文學習內容（題目、選項、翻譯）：夾在中文裡的英文詞（人名等專有名詞）標 lang="en"，讀屏念對、字體用英文字體
const LATIN = /([A-Za-z][A-Za-z'.-]*)/

export function ZhText({ text }: { text: string }) {
  // 外包一層 span：放在 grid 容器裡時整段是同一列
  return (
    <span>
      {text.split(LATIN).map((part, i) =>
        i % 2 ? (
          <span key={i} lang="en">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  )
}
