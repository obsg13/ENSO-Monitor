import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Observation } from '../api/types'

interface OniChartProps {
  observations: Observation[]
}

export function OniChart({ observations }: OniChartProps) {
  return (
    <figure className="chart">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={observations}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period_date"
            tickFormatter={(date: string) => date.slice(0, 7)}
            minTickGap={40}
          />
          <YAxis unit=" °C" domain={[-3, 3]} />
          <Tooltip
            labelFormatter={(label) =>
              `Mois central : ${String(label).slice(0, 7)}`
            }
            formatter={(value) => [`${Number(value).toFixed(1)} °C`, 'ONI']}
          />
          <Legend />
          <ReferenceLine
            y={0.5}
            stroke="#b00020"
            strokeDasharray="6 4"
            label={{
              value: '+0,5 °C (El Niño)',
              position: 'insideBottomRight',
              fill: '#4a4a4a',
            }}
          />
          <ReferenceLine
            y={-0.5}
            stroke="#0b5cad"
            strokeDasharray="6 4"
            label={{
              value: '-0,5 °C (La Niña)',
              position: 'insideTopRight',
              fill: '#4a4a4a',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="ONI (°C)"
            stroke="#1a1a1a"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <figcaption>
        Anomalie de température de surface de la mer (°C) dans la région Niño
        3.4. Au-dessus de +0,5 °C : conditions El Niño ; en dessous de -0,5 °C :
        conditions La Niña. Les valeurs détaillées sont disponibles dans le
        tableau ci-dessous.
      </figcaption>
    </figure>
  )
}
