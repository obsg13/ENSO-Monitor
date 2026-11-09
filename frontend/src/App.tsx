import { useObservations } from './hooks/useObservations'

function App() {
  const { observations, loading, error } = useObservations({
    start: '1997-01-01',
    end: '1998-12-01',
  })

  if (loading) return <p>Chargement…</p>
  if (error) return <p>{error}</p>
  return <p>{observations.length} observations chargées</p>
}

export default App
