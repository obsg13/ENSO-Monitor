import { useEffect, useState } from 'react'
import { ApiError, fetchObservations } from '../api/client'
import type { Observation, Period } from '../api/types'

interface ObservationsResult {
  key: string
  observations: Observation[]
  error: string | null
}

export function useObservations({ start, end }: Period) {
  const [result, setResult] = useState<ObservationsResult | null>(null)
  const key = `${start}/${end}`

  useEffect(() => {
    let cancelled = false
    const requestKey = `${start}/${end}`

    fetchObservations({ start, end })
      .then((observations) => {
        if (!cancelled)
          setResult({ key: requestKey, observations, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof ApiError ? err.message : 'Erreur inattendue.'
        setResult((previous) => ({
          key: requestKey,
          observations: previous?.observations ?? [],
          error: message,
        }))
      })

    return () => {
      cancelled = true
    }
  }, [start, end])

  return {
    observations: result?.observations ?? [],
    loading: result?.key !== key,
    error: result?.key === key ? result.error : null,
  }
}
