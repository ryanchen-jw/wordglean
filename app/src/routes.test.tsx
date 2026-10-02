// 路由接線：小課結算後要求同步（TASK-18 D2）
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { db } from './data/appDb'

const fake = vi.hoisted(() => ({
  props: null as null | { lessonId: string; onSettle?: () => void },
  syncAfterSettle: vi.fn(),
}))
vi.mock('./screens/lesson/LessonScreen', () => ({
  LessonScreen: (p: { lessonId: string; onSettle?: () => void }) => {
    fake.props = p
    return null
  },
}))
vi.mock('./auth/sessionHandle', () => ({ syncAfterSettle: fake.syncAfterSettle }))

const { AppRoutes } = await import('./routes')

describe('/lesson/:id', () => {
  it('結算後呼叫 syncAfterSettle（App 全域 db）', () => {
    history.replaceState(null, '', '/lesson/a1-u01-l01')
    render(<AppRoutes />)
    expect(fake.props?.lessonId).toBe('a1-u01-l01')
    fake.props!.onSettle!()
    expect(fake.syncAfterSettle).toHaveBeenCalledTimes(1)
    expect(fake.syncAfterSettle.mock.calls[0][1]).toBe(db)
  })
})
