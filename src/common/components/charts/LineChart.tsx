import React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

interface Props {
  data: { [key: string]: any }[]
  xKey?: string
  yKey?: string
  width?: number
  height?: number
  strokeColor?: string
  gradientId?: string
  yTicks?: number[]
  unit?: string // e.g. "d", "%", etc.
}

const LineChartComponent: React.FC<Props> = ({
  data,
  xKey = "day",
  yKey = "value",
  width = 250,
  height = 125,
  strokeColor = "#3B82F6",
  gradientId = "colorLine",
  yTicks = [0, 5, 10],
  unit = "",
}) => {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#A3A3A3", fontSize: 12 }}
          />
          <YAxis
            dataKey={yKey}
            axisLine={false}
            tickLine={false}
            ticks={yTicks}
            tickFormatter={(tick) => `${tick}${unit}`}
            tick={{ fill: "#A3A3A3", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "white", border: "none", fontSize: 12 }}
            formatter={(value: any) => `${value}${unit}`}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChartComponent
