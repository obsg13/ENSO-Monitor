import type { Comparison, PeriodStats } from '../api/types'
import { describeComparison } from '../interpretation'

interface Indicator {
  label: string
  format: (stats: PeriodStats) => string
}

const INDICATORS: Indicator[] = [
  { label: 'Durée', format: (stats) => `${stats.seasons} saisons` },
  { label: 'Pic', format: (stats) => `${stats.peak_value.toFixed(1)} °C` },
  {
    label: 'Saison du pic',
    format: (stats) => `${stats.peak_season} ${stats.peak_date.slice(0, 4)}`,
  },
  { label: 'Moyenne', format: (stats) => `${stats.mean_value.toFixed(2)} °C` },
]

function periodLabel(stats: PeriodStats): string {
  return `${stats.start.slice(0, 7)} → ${stats.end.slice(0, 7)}`
}

interface ComparisonResultProps {
  comparison: Comparison
}

export function ComparisonResult({ comparison }: ComparisonResultProps) {
  const { period_a: a, period_b: b } = comparison

  return (
    <>
      <table>
        <caption>
          Indicateurs de l'indice {comparison.index} ({comparison.unit})
        </caption>
        <thead>
          <tr>
            <th scope="col">Indicateur</th>
            <th scope="col">Épisode A ({periodLabel(a)})</th>
            <th scope="col">Épisode B ({periodLabel(b)})</th>
          </tr>
        </thead>
        <tbody>
          {INDICATORS.map((indicator) => (
            <tr key={indicator.label}>
              <th scope="row">{indicator.label}</th>
              <td>{indicator.format(a)}</td>
              <td>{indicator.format(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Interprétation</h3>
      {describeComparison(comparison).map((sentence) => (
        <p key={sentence}>{sentence}</p>
      ))}

      <aside className="limits" aria-labelledby="limits-title">
        <h3 id="limits-title">Limites</h3>
        <ul>
          <li>
            Un seul indice : l'ONI mesure la température de surface de la région
            Niño 3.4, pas les effets régionaux ni la composante atmosphérique
            d'ENSO.
          </li>
          <li>
            Les valeurs récentes peuvent être révisées par la NOAA pendant deux
            mois après leur publication.
          </li>
          <li>
            Le seuil de ±0,5 °C et la durée minimale de 5 saisons sont des
            conventions de la NOAA ; aucune classe « Super El Niño » n'est
            utilisée.
          </li>
          <li>
            Cette comparaison décrit des mesures passées et ne constitue pas une
            prévision.
          </li>
        </ul>
      </aside>
    </>
  )
}
