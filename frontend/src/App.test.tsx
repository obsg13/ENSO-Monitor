import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Period } from './api/types'
import App from './App'

vi.mock('./components/OniChart', () => ({ OniChart: () => null }))

vi.mock('./api/client', () => ({
  ApiError: class ApiError extends Error {},
  fetchIndices: () => Promise.resolve([]),
  fetchObservations: ({ start }: Period) =>
    Promise.resolve(
      start === '1997-01-01'
        ? [
            { season: 'DJF', period_date: '1997-01-01', value: -0.4 },
            { season: 'JFM', period_date: '1997-02-01', value: -0.3 },
          ]
        : [
            { season: 'DJF', period_date: '1950-01-01', value: -1.3 },
            { season: 'JFM', period_date: '1950-02-01', value: -1.2 },
            { season: 'FMA', period_date: '1950-03-01', value: -1.1 },
          ],
    ),
  comparePeriods: () => Promise.reject(new Error('Non utilisé dans ce test')),
}))

describe('App', () => {
  it('met à jour les valeurs affichées quand la période change', async () => {
    render(<App />)
    expect(await screen.findByText('3 valeurs affichées.')).toBeTruthy()

    const filter = within(
      screen.getByRole('form', { name: 'Filtre de période' }),
    )
    fireEvent.change(filter.getByLabelText('Début'), {
      target: { value: '1997-01' },
    })
    fireEvent.change(filter.getByLabelText('Fin'), {
      target: { value: '1997-02' },
    })
    fireEvent.click(filter.getByRole('button', { name: 'Appliquer' }))

    expect(await screen.findByText('2 valeurs affichées.')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Afficher le tableau des valeurs' }),
    )
    expect(screen.getByText('1997-01')).toBeTruthy()
    expect(screen.queryByText('1950-01')).toBeNull()
  })
})
