import { Chart, Expand, Options } from "@/assets"
import { Link } from "@tanstack/react-router"
import React, { useRef, useState } from "react"
import MagnifyModal from "../modal/MagnifyModal"

type CardContainerProps = {
  component: React.ComponentType<any>
  title: string
  tableRoute?: string
  componentProps?: any
}

const CardContainerComponent: React.FC<CardContainerProps> = ({
  component: Component,
  title,
  tableRoute,
  componentProps,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleExpand = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setCardRect(rect)
      setIsModalOpen(true)
    }
  }

  return (
    <React.Fragment>
      <div
        ref={cardRef}
        className="flex h-full max-w-full flex-col rounded-[0.5rem] bg-lightBg"
        style={{ minWidth: 0 }}
      >
        {/* Header */}
        <div className="flex h-[2.6875rem] items-center justify-between border-b border-borderGray px-4 py-3">
          <div className="flex items-center gap-1">
            <img src={`${Chart}`} alt="Chart Icon" className="" />
            <span className="font-geist text-[0.813rem] font-normal text-shark-500">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {tableRoute && (
              <Link to={tableRoute}>
                <img src={`${Options}`} alt="Option Icon" className="block" />
              </Link>
            )}

            <img
              src={`${Expand}`}
              alt="Expand Icon"
              className={`w-5 cursor-pointer ${title === "Total Salesperson" ? "hidden xl:block" : ""}`}
              onClick={handleExpand}
            />
          </div>
        </div>

        {/* Body */}
        <div className="h-full w-full">
          <Component {...componentProps} isExpanded={isModalOpen} />
        </div>
      </div>

      <MagnifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        rect={cardRect}
      >
        <Component {...componentProps}  isExpanded={true}/>
      </MagnifyModal>
    </React.Fragment>
  )
}

export const CardContainer = React.memo(CardContainerComponent)
