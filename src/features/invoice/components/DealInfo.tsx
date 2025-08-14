import React from "react"
import { Deal } from "@/core/entities"

interface InfoBoxProps {
  headers: { key: string; label: string; value: string }[]
  data: Deal
  isModalView?: boolean
  title: string
}

const formatValue = (
  isFinanceProduct: boolean,
  rawValue?: string | number | null
): string | number => {
  if (isFinanceProduct) {
    if (rawValue === null || rawValue === undefined || rawValue === "" || rawValue === 0)
      return "No"
    return "Yes"
  }
  return rawValue || "N/A"
}

const DealInfo: React.FC<InfoBoxProps> = ({ headers, data, isModalView = false, title }) => {
  const isFinanceProduct = title === "Finance Products"
  return (
    <div className={`flex w-full flex-col ${isModalView ? "" : "p-6"}`}>
      <div className="flex flex-col gap-2.5">
        {headers?.map((item, index) => (
          <div key={item.key} className="flex gap-2 text-base font-medium">
            <span className="text-shark-500">{item.label}</span>
            <span className="text-shark-900">{formatValue(isFinanceProduct, data[item.key])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DealInfo
