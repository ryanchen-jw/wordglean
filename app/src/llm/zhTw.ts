// 批改解釋的繁中防護（創辦人 2026-10-04 裁示 2）：模型夾帶的簡體字與大陸用語轉成台灣繁體與台灣文法術語。
// 用 opencc-js 詞級轉換 cn→twp（頭發／頭髮、恢復、合併等一簡對多繁由詞決定）；字典約 1MB，
// 只在批改回應到達時動態載入，不進首屏 chunk。資料放 JSON：中文字串寫在 .ts 會被硬寫字串守衛擋下。
// - 只有含「簡體專用字」的文字才做 cn→twp：純繁體輸入原樣返回（cn→twp 會把 里長→裡長、余先生→餘先生）。
//   簡體專用字＝opencc 字級簡→繁表（STCharacters）會改的字，扣掉 Big5 常用字（A440–C67E，台灣通行繁體字；
//   里、余、于、丑、么、台、后、干 都在內），再加 Big5 收錄但非台灣標準用字的 并、着（data.simplifiedAlso）
// - keep：twp 會改、但在台灣本來就通行的詞（干擾→幹擾、了解→瞭解…），轉換時原樣保留；
//   抄自 content/scripts/lib/zh-guard.mjs 的 TWP_ACCEPTED，content/test/zh-tw-map.test.mjs 核對兩份一致
// - terms：opencc 不處理的大陸文法術語（介詞、賓語、定語從句…），不論是否轉換都套用；批改 prompt 也引用同一份
import data from './zhTw.json' with { type: 'json' }
import type { GradeResult } from './parseGrade'

/** 大陸用語 → 台灣用語的文法術語（繁體字形；長詞在前） */
export const TW_GRAMMAR_TERMS: readonly (readonly [mainland: string, taiwan: string])[] =
  data.terms as [string, string][]
/** 兩岸寫法相同、prompt 用來示範台灣術語的例子 */
export const TW_GRAMMAR_EXAMPLES: readonly string[] = data.examples

const KEEP = new RegExp(`(${data.keep.join('|')})`)

/** Big5 常用字區（第一位元組 A4–C6，C6 只到 7E）解碼成字 */
function big5Common(): Set<string> {
  const decoder = new TextDecoder('big5')
  const chars = new Set<string>()
  const add = (lead: number, lo: number, hi: number) => {
    for (let trail = lo; trail <= hi; trail++)
      chars.add(decoder.decode(new Uint8Array([lead, trail])))
  }
  for (let lead = 0xa4; lead <= 0xc6; lead++) {
    add(lead, 0x40, 0x7e)
    if (lead !== 0xc6) add(lead, 0xa1, 0xfe)
  }
  return chars
}

type Convert = (text: string) => string
let loading: Promise<Convert> | null = null

// 載入失敗（離線、chunk 抓不到）不擋批改：退回原文（術語仍換），下次再試載入
function converter(): Promise<Convert> {
  loading ??= Promise.all([import('opencc-js/core'), import('opencc-js/preset/cn2t')])
    .then(([{ ConverterBuilder }, preset]): Convert => {
      const cnToTw = ConverterBuilder(preset)({ from: 'cn', to: 'twp' })
      // from.cn＝[[STPhrases, STCharacters]]；STCharacters 為「簡 繁|簡 繁…」
      const stCharacters = preset.from.cn[0][1] as string
      const traditional = big5Common()
      const simplifiedOnly = new Set([
        ...stCharacters
          .split('|')
          .map((pair) => pair.split(' ')[0])
          .filter((ch) => !traditional.has(ch)),
        ...data.simplifiedAlso,
      ])
      return (text) =>
        [...text].some((ch) => simplifiedOnly.has(ch))
          ? text
              .split(KEEP)
              .map((part, i) => (i % 2 === 1 ? part : cnToTw(part)))
              .join('')
          : text
    })
    .catch(() => {
      loading = null
      return (text: string) => text
    })
  return loading
}

const replaceTerms = (text: string) =>
  TW_GRAMMAR_TERMS.reduce((s, [from, to]) => s.replaceAll(from, to), text)

export async function toTaiwanZh(text: string): Promise<string> {
  return replaceTerms((await converter())(text))
}

/** 批改結果的解釋欄位（整體與各錯誤點）轉台灣繁體；英文欄位不動 */
export async function localizeGrade(result: GradeResult): Promise<GradeResult> {
  const [explanationZh, ...errorExplanations] = await Promise.all(
    [result.explanationZh, ...result.errors.map((e) => e.explanationZh)].map(toTaiwanZh),
  )
  return {
    ...result,
    explanationZh,
    errors: result.errors.map((e, i) => ({ ...e, explanationZh: errorExplanations[i] })),
  }
}
