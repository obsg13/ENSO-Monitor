import { describe, expect, it } from 'vitest'
import type { PeriodStats } from './api/types'
import { describeComparison } from './interpretation'

const ELNINO_THEN_LANINA: PeriodStats = {
  start: '1997-01-01',
  end: '1998-12-01',
  seasons: 24,
  peak_value: 2.4,
  peak_season: 'NDJ',
  peak_date: '1997-12-01',
  mean_value: 0.59,
  min_value: -1.5,
  max_value: 2.4,
}

describe('describeComparison', () => {
  it('signale les deux seuils quand une période les franchit tous les deux', () => {
    const [phases] = describeComparison({
      index: 'ONI',
      unit: '°C',
      period_a: ELNINO_THEN_LANINA,
      period_b: ELNINO_THEN_LANINA,
    })

    expect(phases).toContain('seuil El Niño')
    expect(phases).toContain('seuil La Niña')
  })
})
