import React from "react"
import GaugeChart from "./charts/GuageChart"
import Trend, { TrendStatusEnum } from "./widgets/Trend"
import { CurrencyLabel } from "./currency/CurrencyComponent"


interface SalesSummaryProps {
  totalCarsSold: number
  newCarsSold: number
  usedCarsSold: number
  totalRevenue: number
  newRevenue: number
  usedRevenue: number
  growth: number
  topSalesperson: string
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  totalCarsSold,
  newCarsSold,
  usedCarsSold,
  totalRevenue,
  newRevenue,
  usedRevenue,
  growth,
  topSalesperson,
}) => {
  return (
    <div className="px-6 pb-6 pt-[1.3125rem]">
      <div className="flex h-full w-full flex-col gap-[2.688rem]">
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-start">
            <span className="semibold-display-2xl text-[1.5rem] font-semibold leading-[2rem] text-screamin-700">
            <CurrencyLabel value={totalRevenue}  fractionDigits={2} />
            </span>
            <span className="medium-text-sm text-shark-500">Total Revenue</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-inter semibold-display-2xl text-[1.5rem] font-semibold leading-[2rem] text-screamin-700">
              {totalCarsSold}
            </span>
            <span className="medium-text-sm text-shark-500">Total Cars Sold</span>
          </div>
        </div>

        <div className="medium-text-xs flex w-full items-center justify-evenly">
          {/* New Cars */}
          <div className="flex flex-col items-center">
            <span className="w-full">
              <GaugeChart value={newCarsSold} />
            </span>
            <span className="text-shark-500">New Cars Sold</span>
            <span className="text-screamin-700">
              <CurrencyLabel value={newRevenue}  fractionDigits={2} />
            </span>
          </div>
          {/* Old Cars */}
          <div className="flex flex-col items-center">
            <span className="w-full">
              <GaugeChart value={usedCarsSold} />
            </span>
            <span className="text-shark-500">Used Cars Sold</span>
            <span className="text-cinnabar-700">
              <CurrencyLabel value={usedRevenue}  fractionDigits={2} />
            </span>
          </div>
        </div>

        <div className="xl-gap-[3.875rem] mt-10 flex w-full items-center justify-center gap-[1.563rem] xl:mt-0">
          <div className="flex items-center gap-[0.25rem]">
            <span className="regular-text-xs text-shark-500">Revenue Growth</span>
            <span className="medium-text-xs flex items-center gap-1 rounded-[4px] bg-screamin-100 p-[8px] text-screamin-700">
              {" "}
              <Trend value={growth} status={TrendStatusEnum.Incline} />
            </span>
          </div>
          <div className="flex items-center gap-[0.25rem]">
            <span className="regular-text-xs text-shark-500">Top Salesperson</span>
            <span className="medium-text-xs rounded-[0.25rem] bg-cerulean-100 p-[0.5rem] text-cerulean-700">
              {topSalesperson}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesSummary
