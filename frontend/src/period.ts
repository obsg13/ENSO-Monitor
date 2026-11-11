import type { Period } from './api/types'

const MONTH_PATTERN = /^\d{4}-\d{2}$/

export function validateMonths(start: string, end: string): string | null {
  if (!MONTH_PATTERN.test(start) || !MONTH_PATTERN.test(end)) {
    return 'Saisissez les dates au format AAAA-MM.'
  }
  if (start > end) {
    return 'La date de début doit précéder la date de fin.'
  }
  return null
}

export function toPeriod(start: string, end: string): Period {
  return { start: `${start}-01`, end: `${end}-01` }
}
