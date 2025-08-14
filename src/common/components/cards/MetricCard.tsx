import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { ReactComponent as CarIcon } from "../../../assets/icons/Car.svg"
import { Add } from "@/assets"
import { useSetOpenModalStore } from "@/core/store/showEditGross"

export interface MetricComponentProps {
  id: string
  objectiveName: string
  achievedObjective: number | string
  iconColor: string
  iconBgColor: string
  path?: string
  enableEdit? : boolean
}

const MetricComponent: React.FC<MetricComponentProps> = ({
  id,
  objectiveName,
  achievedObjective,
  iconColor,
  iconBgColor,
  path,
  enableEdit = false
}) => {
  const navigate = useNavigate()
  const handleClick = () => navigate({ to: path })
  const setEditFinanceGross = useSetOpenModalStore((state) => state.setOpenModal);

  return (
    <div
      key={id}
      className={`relative flex h-[5.9375rem] w-full items-center gap-4 rounded-lg bg-white p-6 shadow-sm ${path && "cursor-pointer"} transition hover:opacity-80`}
      onClick={handleClick}
    >
      {/* Dynamic Icon Container */}
      <div className="flex items-center justify-center rounded-full p-3" style={{ backgroundColor: iconBgColor }}>
        <CarIcon style={{ width: 24, height: 24, color: iconColor }} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold" style={{ color: iconColor }}>
          {achievedObjective}
        </span>
        <span className="text-xs font-medium text-[#666B74]">{objectiveName}</span>
      </div>

      {objectiveName === "Finance Gross" && enableEdit && (
        <div className="absolute top-2 right-2 cursor-pointer" onClick={() => setEditFinanceGross(true)}>
          <img src={`${Add}`} alt="plus icon" />
        </div>
      )}
    </div>
  )
}

export default MetricComponent
