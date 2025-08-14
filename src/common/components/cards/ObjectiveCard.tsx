import ProgressBar from "../ProgressBar/ProgressBar"

interface ObjectiveCardProps {
  title: string
  total: number
  newProgress: number
  usedProgress: number
  newColor: string
  usedColor: string
  newCount?: number
  usedCount?: number
}

export default function ObjectiveCard({
  title,
  total,
  newProgress,
  usedProgress,
  newColor,
  usedColor,
  newCount,
  usedCount,
}: ObjectiveCardProps) {
  const calculatePercentage = (value: number) => {
    if (!total || total <= 0) return 0
    return (value / total) * 100
  }

  const newPercentage = calculatePercentage(newProgress)
  const usedPercentage = calculatePercentage(usedProgress)

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-white p-[0.625rem]">
      {/* Header */}
      <div className="mb-[0.5rem] flex h-[0.9375rem] w-full justify-between font-sans font-semibold">
        <span className="text-[0.9375rem] text-[#4B465C]">{title}</span>
        <div className="flex h-[24px] items-center gap-[0.3125rem] rounded-[4px] bg-screamin-200 px-[0.625rem] text-[0.8125rem] text-screamin-700">
          <span>Total:</span>
          <span>{total}</span>
        </div>
      </div>

      {/* New Cars */}
      <div className="mb-[0.5rem] flex flex-grow flex-col gap-[0.0625rem]">
        <div
          className={`flex justify-between text-[#4B465C] ${title === "Previous Month Objective" ? "mt-3" : ""} xl:mt-0`}
        >
          <span className="font-sans text-[0.9375rem]">
            New Cars {newCount ? <span>({newCount})</span> : ""}
          </span>
          <span className="text-[0.8125rem]">{newPercentage.toFixed(2)}%</span>
        </div>
        <div className="flex-grow">
          <ProgressBar progress={newPercentage} color={newColor} />
        </div>
      </div>

      {/* Used Cars */}
      <div className="mb-[0.5rem] flex flex-grow flex-col">
        <div className="flex justify-between text-[#4B465C]">
          <span className="font-sans text-[0.9375rem]">
            Used Cars {usedCount ? <span>({usedCount})</span> : ""}
          </span>
          <span className="text-[0.8125rem]">{usedPercentage.toFixed(2)}%</span>
        </div>
        <div className="flex-grow">
          <ProgressBar progress={usedPercentage} color={usedColor} />
        </div>
      </div>
    </div>
  )
}
