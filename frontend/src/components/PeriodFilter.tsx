import { useState, type FormEvent } from 'react'
import type { Period } from '../api/types'

interface PeriodFilterProps {
  period: Period
  onApply: (period: Period) => void
}

const MONTH_PATTERN = /^\d{4}-\d{2}$/

export function PeriodFilter({ period, onApply }: PeriodFilterProps) {
  const [start, setStart] = useState(period.start.slice(0, 7))
  const [end, setEnd] = useState(period.end.slice(0, 7))
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!MONTH_PATTERN.test(start) || !MONTH_PATTERN.test(end)) {
      setError('Saisissez les dates au format AAAA-MM.')
      return
    }
    if (start > end) {
      setError('La date de début doit précéder la date de fin.')
      return
    }
    setError(null)
    onApply({ start: `${start}-01`, end: `${end}-01` })
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
