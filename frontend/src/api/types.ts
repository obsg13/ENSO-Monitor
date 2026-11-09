export interface ClimateIndex {
  code: string
  name: string
  unit: string
  dataset_version: string
  source_name: string
  source_url: string
  last_import_at: string | null
}

export interface Observation {
  season: string
  period_date: string
  value: number
}

export interface PeriodStats {
  start: string
  end: string
  seasons: number
  peak_value: number
  peak_season: string
  peak_date: string
  mean_value: number
}

export interface Comparison {
  index: string
  unit: string
  period_a: PeriodStats
  period_b: PeriodStats
}

export interface Period {
  start: string
  end: string
}
