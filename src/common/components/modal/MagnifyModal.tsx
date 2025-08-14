import React, { useEffect, useRef, useState } from "react"
import { CloseIcon, Chart } from "../../../assets"

interface MagnifyModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  rect: DOMRect | null
}

const MagnifyModal: React.FC<MagnifyModalProps> = ({ isOpen, onClose, title, children, rect }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const timeout = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && rect && modalRef.current) {
      const modal = modalRef.current
      const final = modal.getBoundingClientRect()

      const dx = rect.left - final.left
      const dy = rect.top - final.top
      const sx = rect.width / final.width
      const sy = rect.height / final.height

      modal.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            opacity: 0,
          },
          {
            transform: "translate(0, 0) scale(1, 1)",
            opacity: 1,
          },
        ],
        {
          duration: 300,
          easing: "ease-out",
          fill: "both",
        }
      )
    }
  }, [isOpen, rect])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isMounted) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMounted, onClose])

  if (!isMounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        ref={modalRef}
        className={`flex w-fit max-w-[95vw] transform flex-col rounded-[9px] bg-lightBg pb-[0.313rem] shadow-lg transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="flex w-full items-center justify-between rounded-t-[0.563rem] border-b-[1.5px] border-borderGray px-[1.5rem] py-[1.125rem] transition-opacity duration-300 ease-out">
          <div className="flex h-[1.828125rem] items-center font-geist text-[1.21875rem] font-normal leading-[1.828125rem] text-shark-500">
            <img
              src={Chart}
              alt="Chart"
              className="mr-2 h-5 w-5 shrink-0"
              style={{ objectFit: "contain" }}
            />
            <span className="block leading-[1.828125rem]">{title}</span>
          </div>
          <button onClick={onClose} className="m-0 cursor-pointer border-none bg-transparent p-0">
            <img src={CloseIcon} alt="Close" className="h-5 w-5 object-contain" />
          </button>
        </div>

        <div className="flex h-full max-h-[36rem] w-full flex-col gap-[0.9375rem] px-[2.25rem] pb-[1.96875rem] pt-[0.9375rem] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MagnifyModal
