import { ChartData } from '@/app/libs/types'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type ChartLineProps = {
  chartData: ChartData
}

type TooltipContentProps = {
  active: boolean
  payload: any
  label: string
}

type CustomYAxisTickProps = {
  x: number
  y: number
  payload: any
}

export default function ChartLine({ chartData }: ChartLineProps) {
  const getData = (header: string) => {
    return chartData.find((data) => data.header === header)
  }

  const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
    if (active && payload && payload.length) {
      const dataPoint = getData(label)
      if (!dataPoint) return null
      const { data } = dataPoint
      return (
        <div className=" rounded-lg p-4 bg-gray-600 text-gray-200">
          <h5 className="font-medium text-gray-50">
            Set: {data.weight} lbs
            {data.reps && ` x ${data.reps}`} {data.rpe && ` @ RPE ${data.rpe}`}
          </h5>
          <span className="text-sm text-gray-400">{dataPoint.header}</span>
        </div>
      )
    }
  }

  const CustomYAxisTick = ({ x, y, payload }: CustomYAxisTickProps) => {
    return (
      <text
        x={x - 5}
        y={y}
        dy={4}
        fill="#9ca3af"
        textAnchor="end"
        fontSize={12}
      >
        {payload.value} lbs.
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
      <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#9ca3af"
        />
        <XAxis
          dataKey="header"
          name="Date"
          tick={customXAxisTick}
        />
        <YAxis
          dataKey="data.weight"
          domain={['auto', 'auto']}
          tick={CustomYAxisTick}
        />
        <Tooltip
          content={
            <CustomTooltip
              active={false}
              payload={undefined}
              label={''}
            />
          }
        />

        <Line
          type="monotone"
          dataKey="data.weight"
          stroke="#a78bfa"
          activeDot={{ r: 8 }}
          name="Weight"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
