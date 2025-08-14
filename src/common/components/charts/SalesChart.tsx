import React, { useEffect, useState } from "react"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Trend, { TrendStatusEnum } from "../widgets/Trend"
import colors from "../../constants/tailwind-colors"
import tailwindBreakpoints from "../../constants/tailwind-breakpoints"
import { CurrencyLabel } from "../currency/CurrencyComponent"

interface BarData {
  name: string
  [key: string]: number | string
}

interface SalesBarChartProps {
  data: BarData[]
  barKeys: string[]
  barColors: string[]
  totalValue: string
  title: string
  growth: number
  status: TrendStatusEnum
  chartHeight?: number
  chartWidth?: number | string
}

const SalesBarChart: React.FC<SalesBarChartProps> = ({
  data,
  barKeys,
  barColors,
  totalValue,
  title,
  growth,
  status,
  chartHeight = 256,
  chartWidth = "100%",
}) => {
  // Dynamically find the max Y value from the data
  const maxDataValue = Math.max(
    ...data.flatMap((item) =>
      barKeys.map((key) => (typeof item[key] === "number" ? (item[key] as number) : 0))
    )
  )

  const [legendAlign, setLegendAlign] = useState<"center" | "right">("center")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= tailwindBreakpoints.lg) setLegendAlign("center")
      else setLegendAlign("right")
    }

    if (typeof window !== "undefined") handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Round the max value up to the nearest 50 for a clean Y-axis
  const yAxisMax = Math.ceil((maxDataValue + 10) / 50) * 50

  return (
    <div className="p-6">
      <div className="flex h-[21.21875rem] w-full flex-col justify-between rounded-md bg-lightBg">
        <div className="flex justify-between xl:flex-col xl:justify-normal">
          <div className="flex w-full flex-wrap justify-between">
            <div>
              <p className="mb-2 text-[24px] font-semibold text-screamin-700">
                {title === "Deals Summary" ? totalValue : <CurrencyLabel value={totalValue}  fractionDigits={2} />}
              </p>
              <p className="mb-2 text-sm font-medium text-shark-500">{title}</p>
            </div>
          </div>

          <div className="flex w-fit rounded">
            <Trend
              value={Math.abs(growth)}
              {...(growth !== 0 && {
                status: growth > 0 ? TrendStatusEnum.Incline : TrendStatusEnum.Decline,
              })}
            />
          </div>
        </div>

        <ResponsiveContainer width={chartWidth} height={chartHeight}>
          <BarChart data={data} barGap={10} barCategoryGap={10}>
            <Legend
              verticalAlign="top"
              height={36}
              align={legendAlign}
              content={({ payload }) => (
                <div className="flex justify-center gap-8 xl:justify-end">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: colors.shark[300] }}
              tick={{ fill: colors.shark[300], fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, yAxisMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#ABAFB5", fontSize: 15 }}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            {barKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={barColors[i]} radius={[6, 6, 0, 0]} barSize={45} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SalesBarChart
