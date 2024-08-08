import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type ChartBarProps = {
  chartData: Map<string, number>
  yaxisLabel: string
  tooltipLabel: string
  tooltipValue?: string
}

export default function ChartBar({
  chartData,
  yaxisLabel,
  tooltipLabel,
  tooltipValue,
}: ChartBarProps) {
  const data = Array.from(chartData, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg p-4 bg-gray-600 text-gray-200">
          <h5 className="font-medium text-gray-50">
            {`${tooltipLabel}: ${payload[0].value} ${
              tooltipValue ? `${tooltipValue}` : ''
            }`}
          </h5>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
      )
    }
    return null
  }

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <text
        x={x - 5}
        y={y}
        dy={4}
        fill="#9ca3af"
        textAnchor="end"
        fontSize={12}
      >
        {payload.value}
        {tooltipValue ? ` ${tooltipValue}` : ''}
      </text>
    )
  }

  const customXAxisTick = ({ x, y, payload }: any) => {
    return (
      <text
        x={x}
        y={y + 5}
        dy={16}
        fill="#9ca3af"
        textAnchor="middle"
        fontSize={12}
      >
        {payload.value}
      </text>
    )
  }

  return (
    <ResponsiveContainer
      height={300}
      style={{ marginLeft: '-5px' }}
    >
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="5"
          stroke="#9ca3af"
        />
        <XAxis
          dataKey="name"
          name="Page"
          tick={customXAxisTick}
          tickSize={10}
          angle={-45}
          textAnchor="end"
          interval={3}
        />
        <YAxis tick={CustomYAxisTick} />
        <Tooltip
          content={
            <CustomTooltip
              active={false}
              payload={undefined}
              label={`${tooltipLabel} (${tooltipValue})`}
            />
          }
        />
        <Bar
          dataKey="value"
          fill="#a78bfa"
          name="Value"
          radius={[2, 2, 0, 0]}
          barSize={25}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
