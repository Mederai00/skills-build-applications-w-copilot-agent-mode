/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App navigation', () => {
  it('renders the dashboard navigation', () => {
    render(<BrowserRouter><App /></BrowserRouter>)

    expect(screen.getByRole('link', { name: 'Activities' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Leaderboard' })).toBeInTheDocument()
    expect(screen.getByText('Train with your team. Stay in motion.')).toBeInTheDocument()
  })
})