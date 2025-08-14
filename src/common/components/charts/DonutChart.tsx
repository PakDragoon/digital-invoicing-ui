import React, { useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

type DonutChartData = {
  name: string
  value: number
  color: string
}[]

type DonutChartProps = {
  data: DonutChartData
  dashboard?: string
}
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, displayValue, value } = payload[0].payload
    return (
      <div className="rounded border border-gray-300 bg-white px-2 py-1 text-xs shadow-md">
        <p>{`${name}: ${displayValue ?? value}`}</p>
      </div>
    )
  }
  return null
}

export const DonutChartComponent: React.FC<DonutChartProps> = ({ data, dashboard }) => {
  const isFinanceAssistant = dashboard === "FinanceAssistant"
  return (
    <div className={`w-full ${isFinanceAssistant ? "flex h-[300px]" : "h-[300px]"}`}>
      <ResponsiveContainer width={isFinanceAssistant ? "70%" : "100%"} height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={100}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {!isFinanceAssistant && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              content={({ payload }) => (
                <ul className="flex flex-wrap justify-center gap-2 text-[10px]">
                  {payload?.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-1">
                      <div
                        style={{
                          backgroundColor: entry.color,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                        }}
                      />
                      {entry.value}
                    </li>
                  ))}
                </ul>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {isFinanceAssistant && (
        <div className="flex w-full justify-center pl-4">
          <ul className="space-y-2 text-xs">
            {data.map((entry, index) => (
              <li key={`legend-${index}`} className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: entry.color,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }}
                />
                {entry.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
