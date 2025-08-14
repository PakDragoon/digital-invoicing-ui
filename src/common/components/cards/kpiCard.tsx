import React from "react"
import PieChartV2 from "@/common/components/charts/PieChartV2"
import ToggleSwitch from "@/common/components/Toggler"

interface ChartData {
  name: string
  value: number
}

interface Props {
  title: string
  toggle: boolean
  toggleLeftText?: string
  toggleRightText: string
  numerator: number | string
  denominator: number
  isPrevMonth?: boolean
  onToggleMonth?: () => void
  colorPalette: string[]
  renderFooter?: () => React.ReactNode
  chartData: ChartData[]
}

const KpiCard: React.FC<Props> = ({
  title,
  toggle = false,
  toggleLeftText,
  toggleRightText = "",
  numerator = 0,
  denominator,
  isPrevMonth = false,
  onToggleMonth,
  colorPalette,
  renderFooter,
  chartData,
}) => {
  return (
    <div className="grid w-full grid-cols-4 items-center gap-[1rem] rounded-md bg-cerulean-50">
      <div className="col-span-1 flex justify-center">
        <PieChartV2
          data={chartData}
          showLegend={false}
          colorPalette={colorPalette}
          width={120}
          height={120}
        />
      </div>

      <div className="col-span-3 flex h-full w-full flex-col gap-1 p-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
            <div className="flex items-baseline">
              <span className="bold-text-xl text-cerulean-600">{numerator}</span>
              {denominator && <span className="bold-text-xl text-shark-300">/{denominator}</span>}
            </div>
          </div>
          {toggle && (
            <div className="ml-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                {toggleLeftText && (
                  <span className="regular-text-xs whitespace-nowrap text-shark-500">
                    {toggleLeftText}
                  </span>
                )}
                <ToggleSwitch checked={isPrevMonth} onChange={onToggleMonth} />
                {toggleRightText && (
                  <span className="regular-text-xs whitespace-nowrap text-shark-500">
                    {toggleRightText}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="medium-text-xs flex whitespace-nowrap text-left text-cerulean-600">
          {title}
        </div>
        <div className="mt-2 flex gap-4 py-1">{renderFooter?.()}</div>
      </div>
    </div>
  )
}

export default KpiCard
