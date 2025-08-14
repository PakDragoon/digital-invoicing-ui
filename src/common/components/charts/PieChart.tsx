import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface PieData {
  name: string
  value: number
}

interface ReusablePieChartProps {
  data: PieData[]
  width?: number
  height?: number
  totalValue?: string
  title?: string
  growth?: number
  chartsColorPalette?: string[]
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
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <foreignObject x={x - 20} y={y - 20} width={40} height={40}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-black shadow">
        {`${Math.round(percent * 100)}%`}
      </div>
    </foreignObject>
  )
}

const ReusablePieChart: React.FC<ReusablePieChartProps> = ({
  data,
  width = 220,
  height = 220,
  growth,
  totalValue,
  title,
  chartsColorPalette = [
    "#FDBA32",
    "#3B82F6",
    "#22C55E",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ],
}) => {
  return (
    <div style={{ width }}>
      {growth && (
        <div className="flex flex-col">
          <p className="mb-2 text-[24px] font-semibold text-[#01B802]">{totalValue}</p>
          <p className="mb-2 text-sm font-medium text-[#666B74]">{title}</p>
          <div className="flex w-fit items-center rounded bg-[#D7FFD7] px-2 py-1 text-xs font-semibold text-[#01B802]">
            {growth}
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartsColorPalette[index % chartsColorPalette.length]}
                stroke="none"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-5 flex flex-wrap justify-center gap-[1.5rem]">
        {data.map((entry, index) => {
          const color = chartsColorPalette[index % chartsColorPalette.length]
          return (
            <div key={entry.name} className="flex items-center space-x-2">
              <span
                className="h-[0.5rem] w-[0.5rem] rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span className="text-xs text-shark-500">
                {entry.name}: <span style={{ color }}>{entry.value}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReusablePieChart
