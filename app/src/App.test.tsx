import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App 佔位頁', () => {
  it('顯示骨架識別字串', () => {
    render(<App />)
    expect(screen.getByTestId('app-placeholder')).toHaveTextContent('LinguaApp 骨架建置中')
  })
})
