import { ObjectiveInfoData } from "@/features/dashboard/hooks/useObjectives"
import React, { lazy } from "react"
import colors from "../constants/tailwind-colors"

// Lazy load components
const ObjectiveCard = lazy(() => import("@/common/components/cards/ObjectiveCard"))

const renderObjectiveCard = (
  title: string,
  newValue: number,
  usedValue: number,
  newColor: string,
  usedColor: string
) => (
  <div className="flex min-w-0 flex-1 items-center justify-center" key={title}>
    <ObjectiveCard
      title={title}
      total={newValue + usedValue}
      newProgress={newValue}
      usedProgress={usedValue}
      newColor={newColor}
      usedColor={usedColor}
    />
  </div>
)

const ObjectiveCardsGrid: React.FC<ObjectiveInfoData> = ({
  DeptObjectiveNew = 0,
  DeptObjectiveUsed = 0,
  AssignedObjectiveNew = 0,
  AssignedObjectiveUsed = 0,
  PrevMonthDeptObjectiveNew = 0,
  PrevMonthDeptObjectiveUsed = 0,
  PrevMonthNewSales = 0,
  PrevMonthUsedSales = 0,
}) => {
  return (
    <div className="px-6 pb-6 pt-[1.3125rem]">
      <div className="flex w-full flex-col items-center gap-y-12">
        {/* Top row */}
        <div className="flex w-full flex-wrap justify-between gap-8 border-b-2 pb-[2.875rem]">
          {renderObjectiveCard(
            "Dept Objective",
            DeptObjectiveNew,
            DeptObjectiveUsed,
            colors.cinnabar[300],
            colors.screamin[600]
          )}
          {renderObjectiveCard(
            "Assigned Objective",
            AssignedObjectiveNew,
            AssignedObjectiveUsed,
            colors.cinnabar[300],
            colors.screamin[600]
          )}
        </div>

        {/* Bottom row */}
        <div className="flex w-full flex-wrap justify-between gap-8">
          {renderObjectiveCard(
            "Previous Month Objective",
            PrevMonthDeptObjectiveNew,
            PrevMonthDeptObjectiveUsed,
            colors.oldlace[300],
            colors.screamin[600]
          )}
          {renderObjectiveCard(
            "Previous Month Sales",
            PrevMonthNewSales,
            PrevMonthUsedSales,
            colors.screamin[600],
            colors.screamin[600]
          )}
        </div>
      </div>
    </div>
  )
}

export default ObjectiveCardsGrid
