import { useState, type FormEvent } from 'react'
import type { Period } from '../api/types'
import { toPeriod, validateMonths } from '../period'

interface PeriodFilterProps {
  period: Period
  onApply: (period: Period) => void
}

export function PeriodFilter({ period, onApply }: PeriodFilterProps) {
  const [start, setStart] = useState(period.start.slice(0, 7))
  const [end, setEnd] = useState(period.end.slice(0, 7))
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = validateMonths(start, end)
    setError(message)
    if (!message) {
      onApply(toPeriod(start, end))
    }
  }

  return (
    <form className="period-filter" onSubmit={handleSubmit}>
      <label>
        Début
        <input
          type="month"
          value={start}
          onChange={(event) => setStart(event.target.value)}
        />
      </label>
      <label>
        Fin
        <input
          type="month"
          value={end}
          onChange={(event) => setEnd(event.target.value)}
        />
      </label>
      <button type="submit">Appliquer</button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </form>
  )
}
