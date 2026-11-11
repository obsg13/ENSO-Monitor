import type { Comparison, PeriodStats } from './api/types'

const THRESHOLD = 0.5

function formatValue(value: number): string {
  return `${value.toFixed(1)} °C`
}

function describePhase(label: string, stats: PeriodStats): string {
  if (stats.peak_value >= THRESHOLD) {
    return `L'épisode ${label} dépasse le seuil El Niño (+0,5 °C).`
  }
  if (stats.peak_value <= -THRESHOLD) {
    return `L'épisode ${label} descend sous le seuil La Niña (-0,5 °C).`
  }
  return `L'épisode ${label} reste entre les deux seuils (conditions neutres).`
}

function describePeaks(a: PeriodStats, b: PeriodStats): string {
  const difference = Math.abs(a.peak_value) - Math.abs(b.peak_value)
  if (Math.abs(difference) < 0.05) {
    return `Les deux pics ont une intensité comparable (${formatValue(a.peak_value)} et ${formatValue(b.peak_value)}).`
  }
  const aIsStronger = difference > 0
  const strongest = aIsStronger ? a : b
  const weakest = aIsStronger ? b : a
  const strongLabel = aIsStronger ? 'A' : 'B'
  const weakLabel = aIsStronger ? 'B' : 'A'
  return `Le pic de l'épisode ${strongLabel} (${formatValue(strongest.peak_value)} en ${strongest.peak_season} ${strongest.peak_date.slice(0, 4)}) est plus marqué que celui de l'épisode ${weakLabel} (${formatValue(weakest.peak_value)}).`
}

function describeMeans(a: PeriodStats, b: PeriodStats): string {
  const difference = Math.abs(a.mean_value) - Math.abs(b.mean_value)
  if (Math.abs(difference) < 0.05) {
    return 'Les moyennes des deux épisodes sont proches.'
  }
  const strongLabel = difference > 0 ? 'A' : 'B'
  return `En moyenne, l'épisode ${strongLabel} s'écarte davantage de la normale (${a.mean_value.toFixed(2)} °C pour A, ${b.mean_value.toFixed(2)} °C pour B).`
}

export function describeComparison({
  period_a: a,
  period_b: b,
}: Comparison): string[] {
  return [
    `${describePhase('A', a)} ${describePhase('B', b)}`,
    `L'épisode A couvre ${a.seasons} saisons, l'épisode B ${b.seasons} saisons.`,
    describePeaks(a, b),
    describeMeans(a, b),
    "Ces écarts décrivent uniquement les valeurs mesurées de l'ONI : ils ne suffisent pas à comparer les effets climatiques des deux épisodes.",
  ]
}
