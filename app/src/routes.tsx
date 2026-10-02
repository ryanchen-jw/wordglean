// 路由表（docs/verification/2026-10-02-task11-shell-evidence/proposal.md）
import { useEffect } from 'react'
import { navigate, usePathname } from './router'
import { CourseScreen } from './screens/course/CourseScreen'
import { HomeScreen } from './screens/home/HomeScreen'
import { LessonScreen } from './screens/lesson/LessonScreen'
import { SettingsScreen } from './screens/settings/SettingsScreen'
import { StubScreen } from './screens/StubScreen'
import { WordsScreen } from './screens/words/WordsScreen'

// 尚未開放：複習（TASK-18）、分級（TASK-17）、授權頁（TASK-21）、OpenRouter（TASK-15）、模型下載（TASK-13／14）
const STUB_PATHS = /^\/(review|placement|about|openrouter|models)$/
const LESSON_PATH = /^\/lesson\/([a-z0-9-]+)$/

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
  const lesson = LESSON_PATH.exec(pathname)
  if (lesson) return <LessonScreen key={lesson[1]} lessonId={lesson[1]} />
  if (STUB_PATHS.test(pathname)) return <StubScreen />
  return <RedirectHome />
}
