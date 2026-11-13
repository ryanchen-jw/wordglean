// 預先產生的發音（TASK-35）：已提交的音檔包與題目檔、字典一致（不需模型；不符時以 content/audio-gen 的 build-audio.mjs 補產生）
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { listDictPacks, listLessons, packStatus } from '../audio-gen/build-audio.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const AUDIO = join(ROOT, 'audio')

const stale = (units) => units.map((u) => [u.id, packStatus(u).status]).filter(([, s]) => s !== 'ok')

test('每課都有最新的音檔包（文字、順序與產生參數都對得上）', () => {
  const lessons = listLessons(join(ROOT, 'items'), AUDIO)
  assert.equal(lessons.length, 1052)
  assert.deepEqual(stale(lessons), [])
})

test('字典含連字號的字都有最新的字典專用包', () => {
  assert.deepEqual(stale(listDictPacks(join(ROOT, '../data/dict'), join(AUDIO, 'dict'))), [])
})

test('沒有多餘的音檔包（題目檔刪掉或改名後要一起刪）', () => {
  const want = new Set([
    ...listLessons(join(ROOT, 'items'), AUDIO).map((l) => l.out),
    ...listDictPacks(join(ROOT, '../data/dict'), join(AUDIO, 'dict')).map((l) => l.out),
  ])
  const have = readdirSync(AUDIO, { recursive: true })
    .filter((f) => f.endsWith('.lga'))
    .map((f) => join(AUDIO, f))
  assert.deepEqual(have.filter((f) => !want.has(f)), [])
})
