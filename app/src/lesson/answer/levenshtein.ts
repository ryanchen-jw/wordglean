// 編輯距離與對齊：字串比字元（UTF-16 碼元，與 js-levenshtein 相同）、字陣列比整字
type Seq = ArrayLike<string>

export type AlignOp =
  | { kind: 'equal' | 'sub'; a: number; b: number }
  | { kind: 'del'; a: number }
  | { kind: 'ins'; b: number }

function table(a: Seq, b: Seq): number[][] {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
  return d
}

export function distance(a: Seq, b: Seq): number {
  return table(a, b)[a.length][b.length]
}

/** a → b 的最少編輯步驟（依序）；同分時優先替換，讓錯字落在使用者打的字上 */
export function align(a: Seq, b: Seq): AlignOp[] {
  const d = table(a, b)
  const ops: AlignOp[] = []
  let i = a.length
  let j = b.length
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      ops.push({ kind: a[i - 1] === b[j - 1] ? 'equal' : 'sub', a: i - 1, b: j - 1 })
      i--
      j--
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.push({ kind: 'del', a: i - 1 })
      i--
    } else {
      ops.push({ kind: 'ins', b: j - 1 })
      j--
    }
  }
  return ops.reverse()
}
