import { useEffect, useState } from 'react'
import { fetchIndices } from '../api/client'
import type { ClimateIndex } from '../api/types'

export function SourceInfo() {
  const [index, setIndex] = useState<ClimateIndex | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetchIndices()
      .then((indices) =>
        setIndex(indices.find((item) => item.code === 'ONI') ?? null),
      )
      .catch(() => setFailed(true))
  }, [])

  if (failed) {
    return <p className="source">Informations sur la source indisponibles.</p>
  }
  if (!index) {
    return <p className="source">Chargement de la source…</p>
  }

  const extraction = index.last_import_at
    ? new Date(index.last_import_at).toLocaleDateString('fr-FR')
    : 'inconnue'

  return (
    <p className="source">
      Source : <a href={index.source_url}>{index.source_name}</a> — {index.name}{' '}
      ({index.code}, {index.dataset_version}) · Extraction : {extraction} ·
      Unité : {index.unit}
    </p>
  )
}
