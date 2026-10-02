// 路由表（docs/verification/2026-10-02-task11-shell-evidence/proposal.md）
import { useEffect } from 'react'
import { authConfigFromEnv } from './auth/config'
import { syncAfterSettle } from './auth/sessionHandle'
import { db } from './data/appDb'
import { navigate, usePathname } from './router'
import { CourseScreen } from './screens/course/CourseScreen'
import { HomeScreen } from './screens/home/HomeScreen'
import { LessonScreen } from './screens/lesson/LessonScreen'
import { ReviewScreen, type ReviewMode } from './screens/review/ReviewScreen'
import { PlacementScreen } from './screens/placement/PlacementScreen'
import { SettingsScreen } from './screens/settings/SettingsScreen'
import { StubScreen } from './screens/StubScreen'
import { WordsScreen } from './screens/words/WordsScreen'

// 尚未開放：授權頁（TASK-21）、OpenRouter（TASK-15）、模型下載（TASK-13／14）
const STUB_PATHS = /^\/(about|openrouter|models)$/
const LESSON_PATH = /^\/lesson\/([a-z0-9-]+)$/

// 小課結算後同步（TASK-18 D2）；沒設定登入時不做事
const authConfig = authConfigFromEnv(import.meta.env)
const onLessonSettle = () => syncAfterSettle(authConfig, db)

// /review：到期複習；?flow=today＝今天的學習（複習完接下一課）；?lesson=＝再複習一次剛學的字（只練習）
function reviewMode(search: string): ReviewMode {
  const q = new URLSearchParams(search)
  const lessonId = q.get('lesson')
  return lessonId
    ? { kind: 'practice', lessonId }
    : { kind: 'due', flow: q.get('flow') === 'today' }
}

function RedirectHome() {
  useEffect(() => navigate('/', { replace: true }), [])
  return null
}

export function AppRoutes() {
  const pathname = usePathname()
  if (pathname === '/') return <HomeScreen />
  if (pathname === '/course') return <CourseScreen />
  if (pathname === '/words') return <WordsScreen />
  if (pathname === '/settings') return <SettingsScreen />
  if (pathname === '/placement') return <PlacementScreen />
  const lesson = LESSON_PATH.exec(pathname)
  if (lesson) return <LessonScreen key={lesson[1]} lessonId={lesson[1]} onSettle={onLessonSettle} />
  if (pathname === '/review')
    return <ReviewScreen key={location.search} mode={reviewMode(location.search)} />
  if (STUB_PATHS.test(pathname)) return <StubScreen />
  return <RedirectHome />
}
