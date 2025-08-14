import React from "react"
import { DeclineIcon, GrowthIcon, FlatArrowIcon } from "@/assets"
import colors from "@/common/constants/tailwind-colors"

export enum TrendStatusEnum {
  Incline = "Incline",
  Decline = "Decline",
  Flat = "Flat",
}

interface TrendConfig {
  container: string
  sign: string
  iconPath: string
  alt: string
}

export const STATUS_STYLES = {
  [TrendStatusEnum.Incline]: {
    durationTextClass: "text-screamin-700",
    chartColor: colors.cerulean["500"],
  },
  [TrendStatusEnum.Decline]: {
    durationTextClass: "text-cinnabar-500",
    chartColor: colors.cinnabar["500"],
  },
  [TrendStatusEnum.Flat]: {
    durationTextClass: "text-shark-500",
    chartColor: colors.shark["500"],
  },
} as const

export const getTrendStatus = (value: number): TrendStatusEnum => {
  if (value === 0) return TrendStatusEnum.Flat
  return value > 0 ? TrendStatusEnum.Incline : TrendStatusEnum.Decline
}

const trendConfig: Record<TrendStatusEnum, TrendConfig> = {
  [TrendStatusEnum.Incline]: {
    container: "bg-screamin-100 text-screamin-700",
    sign: "+",
    iconPath: `${GrowthIcon}`,
    alt: "Incline",
  },
  [TrendStatusEnum.Flat]: {
    container: "bg-shark-100 text-shark-700",
    sign: "",
    iconPath: `${FlatArrowIcon}`,
    alt: "Flat",
  },
  [TrendStatusEnum.Decline]: {
    container: "bg-red-100 text-red-700",
    sign: "-",
    iconPath: `${DeclineIcon}`,
    alt: "Decline",
  },
}

interface Props {
  value: number | string
  status?: TrendStatusEnum
  className?: string
}

const Trend: React.FC<Props> = ({ value, status = TrendStatusEnum.Flat, className = "" }) => {
  const { container, sign, iconPath, alt } = trendConfig[status]
  const formattedValue = `${sign}${value}%`
  return (
    <div className={`w-max ${className}`}>
      <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${container}`}>
        <span className="whitespace-nowrap text-xs font-medium">{formattedValue}</span>
        <span className="flex-shrink-0" aria-label={alt}>
          <img src={iconPath} alt={alt} className="h-4 w-4 flex-shrink-0 object-contain" />
        </span>
      </div>
    </div>
  )
}

export default Trend
