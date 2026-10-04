// App 批改解釋繁中防護的資料（app/src/llm/zhTw.json）與 zh-guard 核對：
// keep（twp 會改、台灣本來就通行的詞）必須與 zh-guard 的 TWP_ACCEPTED 一致（兩處維護）
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { checkZh, TWP_ACCEPTED } from '../scripts/lib/zh-guard.mjs'

const data = JSON.parse(readFileSync(new URL('../../app/src/llm/zhTw.json', import.meta.url), 'utf8'))

describe('App 繁中防護資料', () => {
  it('keep ＝ zh-guard TWP_ACCEPTED', () => {
    assert.deepEqual([...data.keep].sort(), [...TWP_ACCEPTED].sort())
  })

  it('術語替換後的台灣用語通過 zh-guard（無簡體、無大陸用語、twp 不變）', () => {
    for (const [, tw] of data.terms) assert.deepEqual(checkZh(tw), [], tw)
  })
})
