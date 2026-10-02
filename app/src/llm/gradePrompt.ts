// 寫作批改 prompt（規格 §6：LLM 改錯並以繁中解釋語法）；輸出 JSON 欄位見 parseGrade.ts
// 版本號隨 prompt 改動遞增，評測報告（docs/research/llm-eval.md）引用同一版
import type { ChatMessage } from './client'

export const GRADE_PROMPT_VERSION = 'grade-writing.v2'

export interface GradeTask {
  kind: 'translate' | 'makeSentence'
  /** 中翻英的中文題目，或造句的中文說明 */
  promptZh: string
  /** 中翻英的提示字，或造句的指定字 */
  words: string[]
  referenceEn: string[]
  rubricZh: string[]
  /** CEFR 級距（A1–C1）；不明時為 null */
  level: string | null
  answer: string
}

const SYSTEM = `You are an English writing tutor for adult learners in Taiwan.
Grade ONE learner sentence and reply with ONE JSON object only — no markdown, no code fences, no extra text.

JSON keys:
- "isCorrect": boolean — true only if the sentence is grammatical, natural, and expresses the required meaning. Small wording differences from the reference are fine.
- "corrected": string — the learner's sentence with the minimum edits needed. If isCorrect is true, repeat the learner's sentence unchanged.
- "errors": array of { "original": string, "corrected": string, "explanationZh": string } — one entry per mistake, quoting the learner's exact words. Empty array if isCorrect is true.
- "explanationZh": string — 1 to 3 short sentences explaining the key grammar point, written in Traditional Chinese with Taiwan vocabulary and phrasing (never Simplified Chinese, never mainland-China wording). Keep English words in English.
- "levelOk": boolean — whether the learner's sentence suits the target CEFR level (not far too simple, not relying on words far above the level).

Do not judge spelling of proper names. Do not invent errors.`

export function gradeMessages(task: GradeTask): ChatMessage[] {
  const lines = [
    `Task type: ${task.kind === 'translate' ? 'Translate the Chinese into English' : 'Write one English sentence as instructed'}`,
    `${task.kind === 'translate' ? 'Chinese sentence' : 'Instruction (Chinese)'}: ${task.promptZh}`,
    task.words.length > 0 &&
      `${task.kind === 'translate' ? 'Hint words' : 'Must use the word'}: ${task.words.join(', ')}`,
    `Target CEFR level: ${task.level ?? 'unknown'}`,
    `Reference answers: ${task.referenceEn.map((r) => `"${r}"`).join(' / ')}`,
    `Grading points (Chinese): ${task.rubricZh.join('；')}`,
    `Learner's sentence: """${task.answer}"""`,
  ].filter(Boolean) as string[]
  return [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: lines.join('\n') },
  ]
}
