import { useState, type FormEvent } from 'react'
import { ApiError, comparePeriods } from '../api/client'
import type { Comparison } from '../api/types'
import { toPeriod, validateMonths } from '../period'
import { ComparisonResult } from './ComparisonResult'

interface MonthRange {
  start: string
  end: string
}

const DEFAULT_A: MonthRange = { start: '1997-05', end: '1998-04' }
const DEFAULT_B: MonthRange = { start: '2014-10', end: '2016-05' }

interface EpisodeFieldsProps {
  legend: string
  range: MonthRange
  onChange: (range: MonthRange) => void
}

function EpisodeFields({ legend, range, onChange }: EpisodeFieldsProps) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <label>
        Début
        <input
          type="month"
          value={range.start}
          onChange={(event) =>
            onChange({ ...range, start: event.target.value })
          }
        />
      </label>
      <label>
        Fin
        <input
          type="month"
          value={range.end}
          onChange={(event) => onChange({ ...range, end: event.target.value })}
        />
      </label>
    </fieldset>
  )
}

export function EpisodeComparison() {
  const [episodeA, setEpisodeA] = useState(DEFAULT_A)
  const [episodeB, setEpisodeB] = useState(DEFAULT_B)
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errorA = validateMonths(episodeA.start, episodeA.end)
    const errorB = validateMonths(episodeB.start, episodeB.end)
    if (errorA || errorB) {
      setError(errorA ? `Épisode A : ${errorA}` : `Épisode B : ${errorB}`)
      return
    }

    setError(null)
    setLoading(true)
    try {
      const result = await comparePeriods(
        toPeriod(episodeA.start, episodeA.end),
        toPeriod(episodeB.start, episodeB.end),
      )
      setComparison(result)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className="comparison-form" onSubmit={handleSubmit}>
        <EpisodeFields
          legend="Épisode A"
          range={episodeA}
          onChange={setEpisodeA}
        />
        <EpisodeFields
          legend="Épisode B"
          range={episodeB}
          onChange={setEpisodeB}
        />
        <button type="submit">Comparer</button>
      </form>

      <div aria-live="polite">
        {loading && <p>Comparaison en cours…</p>}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {comparison && !error && <ComparisonResult comparison={comparison} />}
      </div>
    </>
  )
}
