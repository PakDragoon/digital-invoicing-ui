import React, { useState, useEffect } from "react"
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import colors from "../../constants/tailwind-colors"
import tailwindBreakpoints from "../../constants/tailwind-breakpoints"
import { formatCurrency } from "@/common/utils/formatCurrency"

interface BarChartData {
  name: string
  value: number
}

interface ReusableBarChartComponentProps {
  data?: BarChartData[]
  barColors?: string[]
  isCurrency?: boolean
  isPercentage?: boolean
}

const ReusableBarChartComponent: React.FC<ReusableBarChartComponentProps> = ({
  data = [],
  barColors = ["#7367F0", "#FCBF4D"],
  isCurrency = false,
  isPercentage = false,
}) => {
  const [barSize, setBarSize] = useState(64)

  useEffect(() => {
    const updateBarSize = () => {
      const screenWidth = window.innerWidth
      if (screenWidth >= tailwindBreakpoints.xl) {
        setBarSize(64)
      } else if (screenWidth >= tailwindBreakpoints.lg) {
        setBarSize(56)
      } else if (screenWidth >= tailwindBreakpoints.md) {
        setBarSize(48)
      } else {
        setBarSize(48)
      }
    }
    updateBarSize()
    window.addEventListener("resize", updateBarSize)
    return () => window.removeEventListener("resize", updateBarSize)
  }, [])

  const yellow = colors.oldlace[400]
  const blue = colors.cerulean[600]

  // Ensure the data is formatted correctly with only name and value
  const formattedData = data.map((entry) => ({
    name: entry.name,
    value: entry.value || 0, // Default to 0 if value is not available
  }))

  const calculateYAxis = (data: BarChartData[]) => {
    // Extract the maximum value from the data
    const maxValue = Math.max(...data.map((item) => item.value))

    // Dynamically calculate the gap based on the max value
    const gap = Math.ceil(maxValue / 5) // 5 gaps to get 6 ticks

    // Generate 6 ticks starting from 0
    const ticks = Array.from({ length: 6 }, (_, i) => i * gap)

    // Ensure the last tick is at least the maximum value
    if (ticks[ticks.length - 1] < maxValue) {
      ticks[ticks.length - 1] = maxValue
    }

    // Define the domain to include the minimum and maximum values
    const domain = [0, maxValue]

    return {
      domain,
      ticks,
    }
  }

  const { domain, ticks } = calculateYAxis(data)

  const formatValue = (value: number) => {
    if (isPercentage) return `${value.toFixed(0)}%`
    if (isCurrency) return formatCurrency(value,isCurrency)
    return value.toString()
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData} // Use the formatted data with only name and value
        barCategoryGap={50}
        margin={{ top: 24, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          axisLine={{ stroke: colors.shark[300] }}
          tickLine={false}
          tick={{
            fill: colors.shark[300],
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}
        />
        <YAxis
          ticks={ticks}
          domain={domain}
          allowDataOverflow={true}
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: colors.shark[300],
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}
          tickFormatter={formatValue}
        />

        {/* Generic Bar */}
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0] as [number, number, number, number]}
          barSize={barSize}
          name="Value"
          isAnimationActive={false}
        >
          <LabelList
            dataKey="value"
            position="top"
            style={{
              fill: colors.shark[300],
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
            }}
            formatter={formatValue}
          />
          {formattedData.map((entry: BarChartData, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? yellow : blue} // Alternates between yellow and blue
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ReusableBarChartComponent
