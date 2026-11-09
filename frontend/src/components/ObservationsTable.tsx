import { useState } from 'react'
import type { Observation } from '../api/types'

interface ObservationsTableProps {
  observations: Observation[]
}

export function ObservationsTable({ observations }: ObservationsTableProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="table-section">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Masquer' : 'Afficher'} le tableau des valeurs
      </button>
      {open && (
        <div className="table-wrapper" tabIndex={0}>
          <table>
            <caption>
              Valeurs de l'indice ONI (°C) sur la période choisie
            </caption>
            <thead>
              <tr>
                <th scope="col">Saison</th>
                <th scope="col">Mois central</th>
                <th scope="col">Valeur (°C)</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((observation) => (
                <tr key={observation.period_date}>
                  <td>{observation.season}</td>
                  <td>{observation.period_date.slice(0, 7)}</td>
                  <td>{observation.value.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
