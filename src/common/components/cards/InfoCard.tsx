import React, { useRef, useState } from "react"
import { ExpandIcon, Chart } from "@/assets"
import MagnifyModal from "@/common/components/modal/MagnifyModal"
import { Deal } from "@/core/entities"


interface DataItem {
  key: string
  label: string
  magnifiedView?: boolean
}

interface Section {
  title: string
  data: DataItem[]
  display?: boolean
}

interface InfoCardProps {
  component: React.ComponentType<{
    data: Deal
    headers?: DataItem[]
    isModalView?: boolean
    title?: string
  }>
  title: string
  componentProps?: { data: Deal, headers?: DataItem[]}
  sections?: Section[]
  maxVisibleFields?: number
}

const InfoCardComponent: React.FC<InfoCardProps> = ({
  title,
  component: Component,
  componentProps,
  sections = [],
  maxVisibleFields = 6,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [showCobuyerInfo, setShowCobuyerInfo] = useState(false)

  const handleExpand = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setCardRect(rect)
      setIsModalOpen(true)
    }
  }

  const getVisibleFields = () => {
    if (sections.length === 0) return componentProps?.headers?.slice(0, maxVisibleFields) || []
    const allFields: DataItem[] = []

    for (const section of sections) {
      allFields.push(...section.data)
      if (allFields.length >= maxVisibleFields) break
    }
    return allFields.slice(0, maxVisibleFields)
  }

  const visibleFields = getVisibleFields()

  const computeColumnDistribution = () => {
    if (sections.length === 0) return { leftColumn: [], rightColumn: [] }

    const visibleSections = !showCobuyerInfo
      ? sections.filter((section) => section.display !== false)
      : sections

    const totalFields = visibleSections.reduce((sum, section) => sum + section.data.length, 0)
    const fieldsPerColumn = Math.floor(totalFields / 2)
    const leftColumn: { section: Section; field: DataItem; isNewSection: boolean }[] = []
    const rightColumn: { section: Section; field: DataItem; isNewSection: boolean }[] = []
    let currentColumn = leftColumn
    let fieldCount = 0

    visibleSections.forEach((section) => {
      section.data.forEach((field, fieldIndex) => {
        if (fieldCount >= fieldsPerColumn && currentColumn === leftColumn)
          currentColumn = rightColumn
        currentColumn.push({ section, field, isNewSection: fieldIndex === 0 })
        fieldCount++
      })
    })

    return { leftColumn, rightColumn }
  }

  const { leftColumn, rightColumn } = computeColumnDistribution()
  const renderColumn = (
    columnData: { section: Section; field: DataItem; isNewSection: boolean }[]
  ) => (
    <div className="space-y-3">
      {columnData.map((item, index) => {
        if (item.field.magnifiedView === false) {
          return null
        }
        return (
          <div key={`${item.section.title}-${item.field.key}`}>
            {item.isNewSection && (
              <h3
                className={`mb-3 border-b border-[#E5E5E5] pb-2 text-lg font-semibold text-[#333] ${index !== 0 ? "mt-8" : ""}`}
              >
                {item.section.title}
              </h3>
            )}
            <Component
              {...componentProps}
              headers={[item.field]}
              isModalView={true}
              title={item.section.title}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <div ref={cardRef} className="relative h-[358px] w-full rounded-lg bg-[#FCFCFC]">
        <div className="flex w-full justify-between border-b border-[#01012E14] px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={`${Chart}`} alt="Chart" className="w-4" />
            <span className="text-sm font-normal text-[#666B74]">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={`${ExpandIcon}`}
              alt="Expand"
              onClick={handleExpand}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="h-full w-full">
          <Component {...componentProps} headers={visibleFields} title={title} />
        </div>
      </div>

      <MagnifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        rect={cardRect}
      >
        <div className="p-6">
          {sections.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>{renderColumn(leftColumn)}</div>
              <div>{renderColumn(rightColumn)}</div>
            </div>
          ) : (
            <div className="space-y-3">
              <Component {...componentProps} isModalView={true} title={title} />
            </div>
          )}
          {title === "Deal & Customer Info" && componentProps?.data.coBuyerName !== "" && (
            <div className="mb-4 mt-10 flex justify-end">
              <button
                onClick={() => setShowCobuyerInfo((prev) => !prev)}
                className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm transition hover:bg-blue-600"
              >
                {showCobuyerInfo ? "Hide CoBuyer Info" : "Show CoBuyer Info"}
              </button>
            </div>
          )}
        </div>
      </MagnifyModal>
    </>
  )
}

export default InfoCardComponent
