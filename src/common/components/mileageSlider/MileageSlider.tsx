import React from "react"

interface MileageRangeSliderProps {
  minMileage: number
  maxMileage: number
  onMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MileageRangeSlider: React.FC<MileageRangeSliderProps> = ({
  minMileage,
  maxMileage,
  onMinChange,
  onMaxChange,
}) => {
  const range = 1000000
  const minPercent = (minMileage / range) * 100
  const maxPercent = (maxMileage / range) * 100
  const fillStart = `${minPercent}%`
  const fillWidth = `${maxPercent - minPercent}%`
  const minLabelLeft = fillStart
  const maxLabelLeft = `${maxPercent}%`
  const minZIndex = maxMileage < minMileage + 1000 ? 2 : 1
  const maxZIndex = minZIndex

  return (
    <div className="mt-8">
      <label className="mb-5 block text-sm font-medium text-cerulean-600">Mileage</label>

      <div className="relative mb-8">
        <div className="relative h-2">
          <div className="absolute top-0 h-2 w-full rounded-full bg-gray-200"></div>

          <div
            className="absolute top-0 h-2 rounded-full bg-blue-600"
            style={{ left: fillStart, width: fillWidth }}
          ></div>

          <input
            type="range"
            min={0}
            max={range}
            step={1000}
            value={minMileage}
            onChange={onMinChange}
            className="pointer-events-none absolute top-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md"
            style={{ zIndex: minZIndex }}
          />

          <input
            type="range"
            min={0}
            max={range}
            step={1000}
            value={maxMileage}
            onChange={onMaxChange}
            className="pointer-events-none absolute top-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md"
            style={{ zIndex: maxZIndex }}
          />

          <div
            className="absolute top-5 -translate-x-1/2 transform rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white"
            style={{ left: minLabelLeft }}
          >
            {Math.round(minMileage / 1000)}K
          </div>

          <div
            className="absolute top-5 -translate-x-1/2 transform rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white"
            style={{ left: maxLabelLeft }}
          >
            {Math.round(maxMileage / 1000)}K
          </div>
        </div>
      </div>
    </div>
  )
}

export default MileageRangeSlider
