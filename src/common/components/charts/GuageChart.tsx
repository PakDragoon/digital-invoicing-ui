import React from "react"
import GaugeComponent from "react-gauge-component"

interface GaugeProps {
  value: number
  total?: number
  invert?: boolean
}

const thresholds = [10, 30, 50, 75, 100]
const baseColors = ["#EA4228", "#E88C28", "#E8E228", "#90E828", "#5BE12C"]

const getColorForValue = (value: number, colorScale: string[]) => {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) return colorScale[i]
  }
  return colorScale[colorScale.length - 1]
}

const GaugeChart: React.FC<GaugeProps> = ({ value, total, invert = false }) => {
  const displayValue = total ? (value / total) * 100 : value
  const colorScale = invert ? [...baseColors].reverse() : baseColors
  const valueColor = getColorForValue(displayValue, colorScale)
  const subArcs = thresholds.map((limit) => ({ limit }))

  return (
    <div className="flex h-full w-full items-center justify-center">
      <GaugeComponent
        value={displayValue}
        type="radial"
        style={{ width: "100%" }}
        labels={{
          valueLabel: {
            formatTextValue: () => `${value}`,
            style: {
              fill: valueColor,
              fontSize: "52px",
              fontWeight: "bold",
              textShadow: "none",
            },
          },
          tickLabels: {
            type: "inner",
            ticks: thresholds.map((t) => ({ value: t })),
          },
        }}
        arc={{
          colorArray: colorScale,
          subArcs,
          padding: 0.02,
          width: 0.3,
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
      />
    </div>
  )
}

export default GaugeChart
