import React from "react"

// ---------------------
// Types
// ---------------------
interface ProgressRow {
  label: string
  value: string
  percent: number
  color: string
}

export interface ObjectiveCardProps {
  title: string
  total: number
  rows: ProgressRow[]
  badgeTextColor: string
  badgeBgColor: string
}

// ---------------------
// Component
// ---------------------
const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  title,
  total,
  rows,
  badgeTextColor,
  badgeBgColor,
}) => {
  return (
    <div className="h-[26.125rem] w-full rounded-lg bg-white p-6">
      <div className="mb-5 flex justify-between">
        <h4 className="text-sm font-semibold text-[#1d1d1f]">{title}</h4>
        <div
          className="rounded px-2 py-1 text-xs font-semibold"
          style={{
            backgroundColor: badgeBgColor,
            color: badgeTextColor,
          }}
        >
          Total: {total}
        </div>
      </div>

      {rows.map((row, index) => (
        <div key={index} className="mb-4">
          <div className="mb-1 flex justify-between text-sm text-[#6e6e73]">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#f2f2f2]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${row.percent}%`,
                backgroundColor: row.color,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ObjectiveCard
