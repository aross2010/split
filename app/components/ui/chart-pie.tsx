import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import chroma from 'chroma-js'

type ChartBarProps = {
  chartData: Map<string, number>
  tooltipLabel: string
}

const baseColor = chroma('#a78bfa')
const COLORS = [
  '#a78bfa', // Base color
  '#c8a5fc', // Lighter
  '#e9b9fe', // Lightest
  '#d5a6f3', // Light purple
  '#b480e0', // Muted purple
  '#a26fd5', // Stronger purple
  '#915fca', // Darker purple
  '#7e4fbf', // Deep purple
  '#6b3eb4', // Even deeper
  '#582c99', // Darkest
]

export default function ChartPie({ chartData, tooltipLabel }: ChartBarProps) {
  const data = Array.from(chartData, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg p-4 bg-gray-600 text-gray-200">
          <h5 className="font-medium text-gray-50">
            {`${tooltipLabel}: ${payload[0].value}`}
          </h5>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer
      height={300}
      style={{ marginLeft: '-5px' }}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={130}
          innerRadius={10}
          fill="#a78bfa"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          content={
            <CustomTooltip
              active={false}
              payload={undefined}
              label={''}
            />
          }
        />
        <Legend
          layout="vertical"
          align="left"
          verticalAlign="middle"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
