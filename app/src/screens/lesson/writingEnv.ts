// 寫作題需要的環境（TASK-15）：OpenRouter 連結、本課級距、批改函式；由 LessonScreen 提供，測試可替換
import { createContext } from 'react'
import { gradeWriting, type GradeOutcome } from '../../llm/grade'
import type { GradeTask } from '../../llm/gradePrompt'
import type { OpenRouterLink } from '../../llm/keyStore'

/** signal：離開題目時中止批改請求 */
export type GradeFn = (
  link: OpenRouterLink,
  task: GradeTask,
  signal?: AbortSignal,
) => Promise<GradeOutcome>

export interface WritingEnv {
  /** undefined＝讀取中；null＝沒有金鑰 */
  link: OpenRouterLink | null | undefined
  level: string | null
  grade: GradeFn
}

export const WritingEnvContext = createContext<WritingEnv>({
  link: null,
  level: null,
  grade: (link, task, signal) => gradeWriting(link, task, fetch, { signal }),
})
