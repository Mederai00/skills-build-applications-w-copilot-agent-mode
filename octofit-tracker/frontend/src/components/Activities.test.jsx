/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Activities from './Activities.jsx'

describe('Activities', () => {
  afterEach(() => cleanup())

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        _id: 'activity-1',
        type: 'Running',
        durationMinutes: 30,
        points: 145,
        user: { name: 'Maya Chen' },
      }],
    }))
  })

  it('renders activities returned by the API', async () => {
    render(<Activities />)

    await waitFor(() => expect(screen.getByText('Running')).toBeInTheDocument())
    expect(screen.getByText(/Maya Chen/)).toBeInTheDocument()
    expect(screen.getByText('145 pts')).toBeInTheDocument()
  })

  it('shows the add activity action', () => {
    render(<Activities />)

    expect(screen.getByRole('button', { name: '+ Add activity' })).toBeInTheDocument()
  })
})