import { useState } from 'react'
import type { Period } from './api/types'
import { ObservationsTable } from './components/ObservationsTable'
import { PeriodFilter } from './components/PeriodFilter'
import { SourceInfo } from './components/SourceInfo'
import { useObservations } from './hooks/useObservations'
import { OniChart } from './components/OniChart'

const ONI_PAGE_URL =
  'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/oni/v6/index.php'

const FULL_PERIOD: Period = {
  start: '1950-01-01',
  end: `${new Date().toISOString().slice(0, 7)}-01`,
}

function App() {
  const [period, setPeriod] = useState<Period>(FULL_PERIOD)
  const { observations, loading, error } = useObservations(period)

  return (
    <>
      <header className="site-header">
        <h1>ENSO Monitor</h1>
        <SourceInfo />
      </header>

      <main>
        <section aria-labelledby="oni-title">
          <h2 id="oni-title">Évolution de l'indice ONI</h2>
          <PeriodFilter period={period} onApply={setPeriod} />

          <div aria-live="polite">
            {loading && <p>Chargement des données…</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && observations.length === 0 && (
              <p>Aucune donnée sur cette période.</p>
            )}
            {!loading && observations.length > 0 && (
              <p>{observations.length} valeurs affichées.</p>
            )}
          </div>
          {observations.length > 0 && <OniChart observations={observations} />}
          <ObservationsTable observations={observations} />
        </section>
      </main>

      <footer className="site-footer">
        Données :{' '}
        <a href={ONI_PAGE_URL}>NOAA Climate Prediction Center — ONI v6</a>
      </footer>
    </>
  )
}

export default App
