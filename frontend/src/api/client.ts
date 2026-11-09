import type { ClimateIndex, Comparison, Observation, Period } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

export class ApiError extends Error {}

async function getJson<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const query = new URLSearchParams(params).toString()
  const url = query ? `${API_URL}${path}?${query}` : `${API_URL}${path}`

  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new ApiError("L'API ne répond pas. Réessayez plus tard.")
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail =
      typeof body?.detail === 'string' ? body.detail : 'Requête invalide.'
    throw new ApiError(detail)
  }
  return (await response.json()) as T
}

export function fetchIndices(): Promise<ClimateIndex[]> {
  return getJson('/indices')
}

export function fetchObservations(period: Period): Promise<Observation[]> {
  return getJson('/observations', { start: period.start, end: period.end })
}

export function comparePeriods(a: Period, b: Period): Promise<Comparison> {
  return getJson('/compare', {
    a_start: a.start,
    a_end: a.end,
    b_start: b.start,
    b_end: b.end,
  })
}
