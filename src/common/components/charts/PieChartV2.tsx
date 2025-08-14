import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface PieData {
  name: string
  value: number
}

interface PieChartProps {
  data: PieData[]
  showLegend?: boolean
  width?: number
  height?: number
  colorPalette: string[]
}

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const RADIAN = Math.PI / 180

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <foreignObject x={x - 20} y={y - 10} width={28} height={28}>
      <div className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white p-3 text-[8px] font-bold text-black shadow">
        {`${Math.round(percent * 100)}%`}
      </div>
    </foreignObject>
  )
}

// Tailwind-inspired color palette
const colorPalette = [
  "#FDBA32",
  "#3B82F6",
  "#22C55E",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
]

const PieChartV2: React.FC<PieChartProps> = ({
  data,
  showLegend = true,
  width = 100,
  height = 100,
  colorPalette,
}) => {
  return (
    <div>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="90%"
            paddingAngle={0}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorPalette[index % colorPalette.length]}
                stroke="none"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {showLegend && (
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm font-medium">
          {data.map((entry, index) => {
            const color = colorPalette[index % colorPalette.length]
            return (
              <div key={entry.name} className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="text-gray-700">
                  {entry.name}: <span style={{ color }}>{entry.value}</span>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PieChartV2
