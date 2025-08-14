import React from "react"
import Trend, { STATUS_STYLES, TrendStatusEnum } from "../widgets/Trend"
import LineChartComponent from "../charts/LineChart"

interface Props {
  duration: number
  comparison: number
  status: TrendStatusEnum
  data: { day: string; value: number }[]
  description: string
}

const TimeCard: React.FC<Props> = ({ duration, comparison, status, data, description }) => {
  const durationLabel = duration < 1 ? "<1 Day" : `${duration} Day${duration > 1 ? "s" : ""}`
  const { durationTextClass, chartColor } =
    STATUS_STYLES[status] || STATUS_STYLES[TrendStatusEnum.Flat]

  return (
    <div className="flex items-center gap-[0.5rem] px-[1.5rem] py-[1rem]">
      <div className="flex w-[45%] flex-col justify-between gap-[5px]">
        <span className={`semibold-display-xs ${durationTextClass}`}>{durationLabel}</span>
        <span className="regular-text-xs text-wrap text-shark-700">{description}</span>
        <div className="flex items-center gap-[0.5rem]">
          <Trend value={comparison} status={status} />
          <span className="medium-text-sm text-shark-500">vs last 7 Days</span>
        </div>
      </div>

      <div className="flex w-[55%] flex-col items-center justify-between">
        <LineChartComponent
          width={260}
          height={150}
          data={data}
          xKey="day"
          yKey="value"
          strokeColor={chartColor}
          yTicks={[0, 5, 10, 15, 20, 25, 30]}
          unit="d"
        />
      </div>
    </div>
  )
}

export default TimeCard
