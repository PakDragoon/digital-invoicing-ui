import React, { useState } from "react"
import colors from "../constants/tailwind-colors"

type TabItemComponentProps = {
  tab: string
  isSelected: boolean
  onTabChange: (tab: string) => void
  key: string
  color: string
  disabled?: boolean
}

interface ISvgPath {
  d: string
  stroke: string
  width: string
  linecap: string
  linejoin: string
}

const svgPaths: ISvgPath[] = [
  {
    d: "M1.79883 2.60352V13.3965H12.5918",
    stroke: "currentColor",
    width: "1.19922",
    linecap: "round",
    linejoin: "round",
  },
  {
    d: "M5.99609 6.80078H4.79687C4.46572 6.80078 4.19727 7.06924 4.19727 7.40039V10.3984C4.19727 10.7296 4.46572 10.998 4.79687 10.998H5.99609C6.32725 10.998 6.5957 10.7296 6.5957 10.3984V7.40039C6.5957 7.06924 6.32725 6.80078 5.99609 6.80078Z",
    stroke: "currentColor",
    width: "1.19922",
    linecap: "round",
    linejoin: "round",
  },
  {
    d: "M10.793 3.80273H9.59375C9.26259 3.80273 8.99414 4.07119 8.99414 4.40234V10.3984C8.99414 10.7296 9.26259 10.998 9.59375 10.998H10.793C11.1241 10.998 11.3926 10.7296 11.3926 10.3984V4.40234C11.3926 4.07119 11.1241 3.80273 10.793 3.80273Z",
    stroke: "currentColor",
    width: "1.19922",
    linecap: "round",
    linejoin: "round",
  },
]

const SvgPathComponent = ({ d, stroke, width, linecap, linejoin }) => {
  return (
    <path
      key={d}
      d={d}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={linecap}
      strokeLinejoin={linejoin}
    />
  )
}

const TabItemComponent: React.FC<TabItemComponentProps> = ({
  tab,
  isSelected,
  color,
  onTabChange,
  disabled,
}) => {
  const [hovered, setHovered] = useState(false)
  const textColor = disabled
    ? colors.shark["400"]
    : isSelected || hovered
      ? color
      : colors.shark["500"]

  const borderColor = isSelected ? color : "transparent"

  const backgroundColor = disabled ? colors.shark["50"] : "transparent"

  return (
    <button
      key={tab}
      onClick={() => !disabled && onTabChange(tab)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`font-inter group flex items-center gap-[0.75rem] border-b-2 px-[1.25rem] pb-[0.4rem] pt-2 text-sm ${disabled ? "hover:cursor-not-allowed" : ""}`}
      style={{
        color: textColor,
        borderBottomColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <svg
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        style={{ color: textColor }}
      >
        {svgPaths.map((path) => {
          return (
            <SvgPathComponent
              d={path.d}
              stroke={path.stroke}
              width={path.width}
              linecap={path.linecap}
              linejoin={path.linejoin}
            />
          )
        })}
      </svg>
      <span className="font-inter text-sm transition-colors duration-200">{tab}</span>
    </button>
  )
}

export const TabItem = React.memo(TabItemComponent)
