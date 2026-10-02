/// <reference types="node" />
// TASK-4 AC#4 守衛：介面文字一律讀 zh-TW.json，程式碼裡不得出現硬寫的中文字串。
// 以 TypeScript 語法樹掃 src 下的 .ts／.tsx（測試檔、測試輔助、題目樣本除外）：
// JSX 文字、JSX 屬性（aria-label、placeholder…）、一般字串與樣板字串只要含中文就報。
// 例外：給開發者看的訊息——`new XxxError(…)`、Error 子類別的 `super(…)`、`console.*(…)`；註解不是語法節點，不受影響。
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const HAN = /\p{Script=Han}/u

function isDeveloperMessage(node: ts.Node): boolean {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isNewExpression(p) && /Error$/.test(p.expression.getText())) return true
    if (ts.isCallExpression(p)) {
      if (p.expression.kind === ts.SyntaxKind.SuperKeyword) return true
      if (
        ts.isPropertyAccessExpression(p.expression) &&
        p.expression.expression.getText() === 'console'
      )
        return true
    }
    if (ts.isStatement(p)) return false
  }
  return false
}

/** 回傳「行號：字串」清單 */
export function findHardcoded(source: string, fileName: string): string[] {
  // .ts 用 TSX 解析會把 <T> 型別斷言誤認成 JSX，必須依副檔名
  const kind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, kind)
  const found: string[] = []
  const report = (node: ts.Node, text: string) => {
    const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
    found.push(`${line}：${text.trim()}`)
  }
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node) && HAN.test(node.text)) report(node, node.text)
    else if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      HAN.test(node.text) &&
      !isDeveloperMessage(node)
    )
      report(node, node.text)
    else if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join('…')
      if (HAN.test(parts) && !isDeveloperMessage(node)) report(node, parts)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return found
}

const SKIP =
  /\.test\.tsx?$|\.d\.ts$|^src[\\/](test|lesson[\\/]fixtures)[\\/]|^src[\\/]lesson[\\/]testFixtures\.ts$/

// 不是介面文字、而是拿來比對資料內容的中文（檔案＋字串完全相符才放行；新增要附理由）
const DATA_MATCH: { file: string; text: string; why: string }[] = [
  {
    file: 'src/dict/lookup.ts',
    text: '…的',
    why: 'TASK-16：在 ECDICT 釋義裡找「原形的…」（如「have的過去式」）判斷是否只是變化形',
  },
]
const isDataMatch = (file: string, hit: string) =>
  DATA_MATCH.some(
    (d) => file.replace(/\\/g, '/') === d.file && hit.slice(hit.indexOf('：') + 1) === d.text,
  )

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return sourceFiles(p)
    return /\.tsx?$/.test(e.name) && !SKIP.test(p) ? [p] : []
  })
}

describe('findHardcoded（守衛本身的鑑別力）', () => {
  it('抓到 JSX 文字、JSX 屬性、三元式裡的字串、樣板字串', () => {
    const src = [
      'export const A = () => (',
      '  <div aria-label="設定">',
      '    <button>開始學習</button>',
      "    {busy ? '處理中…' : t('x.y.z')}",
      '    {`共 ${n} 字`}',
      '  </div>',
      ')',
    ].join('\n')
    expect(findHardcoded(src, 'a.tsx')).toEqual([
      '2：設定',
      '3：開始學習',
      '4：處理中…',
      '5：共 … 字',
    ])
  })

  it('放過 t() 取文案、註解、英文字串、給開發者看的錯誤與 console', () => {
    const src = [
      '// 這是註解',
      '/* 區塊註解 */',
      "export const B = () => <p>{t('home.today.title')}</p> // 行尾註解",
      "const k = 'home.today.title'",
      'function f(id: string) {',
      '  if (!id) throw new Error(`題目載入失敗：${id}`)',
      "  console.info('[lesson] 略過的題目', id)",
      '}',
      "class MismatchError extends Error { constructor() { super('本機資料屬於另一個帳號') } }",
    ].join('\n')
    expect(findHardcoded(src, 'b.tsx')).toEqual([])
  })
})

describe('app/src 沒有硬寫的中文介面字串', () => {
  it('所有介面文字都讀 zh-TW.json', () => {
    const offenders = sourceFiles('src').flatMap((file) =>
      findHardcoded(readFileSync(file, 'utf8'), file)
        .filter((hit) => !isDataMatch(file, hit))
        .map((hit) => `${file}:${hit}`),
    )
    expect(offenders).toEqual([])
  })

  it('資料比對例外清單裡的每一條都還找得到（程式改掉後要從清單移除）', () => {
    const stale = DATA_MATCH.filter(
      (d) =>
        !findHardcoded(readFileSync(d.file, 'utf8'), d.file).some((hit) =>
          isDataMatch(d.file, hit),
        ),
    )
    expect(stale).toEqual([])
  })
})
