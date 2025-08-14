import React, { useState, useEffect } from "react"
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import colors from "../../constants/tailwind-colors"
import tailwindBreakpoints from "../../constants/tailwind-breakpoints"

interface BarChartData {
  name: string
  [key: string]: number | string
}

interface ReusableDoubleBarChartComponentProps {
  data?: BarChartData[]
  barKeys?: string[]
  barColors?: string[]
}

const ReusableDoubleBarChartComponent: React.FC<ReusableDoubleBarChartComponentProps> = ({
  data = [],
  barKeys = ["NewSold", "UsedSold"],
  barColors = ["#7367F0", "#FCBF4D"],
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

  const effectiveBarKeys = barKeys?.length
    ? barKeys
    : data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "name")
      : ["value"]

  // Function to calculate YAxis ticks and domain
  const calculateYAxis = (data: BarChartData[]) => {
    // Extract numeric values and ensure we are dealing with valid numbers
    const numericValues = data.flatMap((item) =>
      effectiveBarKeys.map((key) => {
        const value = item[key]
        // Ensure only valid numbers are included
        return typeof value === "number" && !isNaN(value) ? value : 0
      })
    )

    // Get max and min value from valid numeric data
    const maxValue = Math.max(...numericValues)
    const minValue = Math.min(...numericValues)

    if (maxValue === -Infinity || minValue === Infinity) {
      return { domain: [0, 700], ticks: [0, 100, 200, 300, 400, 500] }
    }

    // Calculate the gap based on the max value (keeping 6 ticks)
    const gap = Math.ceil((maxValue - minValue) / 5) // 6 ticks -> 5 gaps

    // Calculate domain based on gap
    const domainMax = Math.ceil(maxValue / gap) * gap
    const domainMin = 0

    // Generate 6 ticks with dynamic spacing
    const ticks = Array.from({ length: 6 }, (_, index) => index * gap)

    return {
      domain: [domainMin, domainMax],
      ticks,
    }
  }

  const { domain, ticks } = calculateYAxis(data)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={50} barGap={10}>
        <Legend
          verticalAlign="top"
          height={36}
          align="center"
          content={({ payload }) => {
            if (!payload || !Array.isArray(payload)) return null

            const showLegend = barKeys?.includes("Penetration")
            if (!showLegend) return null

            return (
              <div className="flex justify-center gap-8 xl:justify-end">
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )
          }}
        />

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
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}
        />

        {effectiveBarKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={barColors[i % barColors.length]}
            radius={[6, 6, 0, 0]}
            barSize={barSize}
          >
            <LabelList
              dataKey={key}
              position="top"
              style={{
                fill: colors.shark[300],
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ReusableDoubleBarChartComponent
