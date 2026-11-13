// 路由表（docs/verification/2026-10-02-task11-shell-evidence/proposal.md）
import { lazy, Suspense, useEffect } from 'react'
import { authConfigFromEnv } from './auth/config'
import { syncAfterSettle } from './auth/sessionHandle'
import { db } from './data/appDb'
import { navigate, usePathname } from './router'
import { AboutScreen } from './screens/about/AboutScreen'
import { LicensesScreen } from './screens/about/LicensesScreen'
import { PrivacyScreen } from './screens/about/PrivacyScreen'
import { CourseScreen } from './screens/course/CourseScreen'
import { HomeScreen } from './screens/home/HomeScreen'
import { LessonScreen } from './screens/lesson/LessonScreen'
import { ReviewScreen, type ReviewMode } from './screens/review/ReviewScreen'
import { OpenRouterCallback } from './screens/settings/OpenRouterCallback'
import { OpenRouterKeyScreen } from './screens/settings/OpenRouterKeyScreen'
import { PlacementScreen } from './screens/placement/PlacementScreen'
import { SettingsScreen } from './screens/settings/SettingsScreen'
import { StubScreen } from './screens/StubScreen'
import { WordsScreen } from './screens/words/WordsScreen'
import { DEMO_SOURCE } from './lesson/demo'

// 即時跟讀原型測試頁（TASK-39）：內部工具，App 內沒有入口，延遲載入不進首屏
const LiveShadowingScreen = lazy(() => import('./screens/debug/LiveShadowingScreen'))

// 尚未開放：模型下載（TASK-13／14）
const STUB_PATHS = /^\/models$/
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
  if (pathname === '/openrouter') return <OpenRouterKeyScreen />
  if (pathname === '/openrouter/callback') return <OpenRouterCallback />
  if (pathname === '/about') return <AboutScreen />
  if (pathname === '/about/privacy') return <PrivacyScreen />
  if (pathname === '/about/licenses') return <LicensesScreen />
  // 示範課（創辦人 2026-10-05 裁示二）：所有題型一課走完、練習模式；不接結算同步；入口只在設定頁「測試課程」（TASK-30）
  if (pathname === '/lesson/demo')
    return (
      <LessonScreen
        key={location.search}
        lessonId={DEMO_SOURCE}
        demo={{ startType: new URLSearchParams(location.search).get('type') }}
      />
    )
  const lesson = LESSON_PATH.exec(pathname)
  if (lesson) return <LessonScreen key={lesson[1]} lessonId={lesson[1]} onSettle={onLessonSettle} />
  if (pathname === '/review')
    return <ReviewScreen key={location.search} mode={reviewMode(location.search)} />
  if (pathname === '/debug/live-shadowing')
    return (
      <Suspense fallback={null}>
        <LiveShadowingScreen />
      </Suspense>
    )
  if (STUB_PATHS.test(pathname)) return <StubScreen />
  return <RedirectHome />
}
