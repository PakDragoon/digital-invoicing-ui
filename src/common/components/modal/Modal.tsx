import React, { ReactNode, useEffect, useRef, useState } from "react"
import { CloseIcon } from "../../../assets"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  heading?: string
  buttonText?: string
  onButtonClick?: () => void
  icon?: string | ReactNode
  iconBgClass?: string
  children?: ReactNode
  showCloseButton?: boolean
  size?: string
  headingClass?: string
  buttonClass?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  heading,
  buttonText,
  onButtonClick,
  icon,
  iconBgClass,
  children,
  showCloseButton = true,
  size,
  headingClass,
  buttonClass,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
      timeoutRef.current = setTimeout(() => setIsMounted(false), 300)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      onClose()
    }
  }

  if (!isMounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${visible ? "bg-opacity-60 opacity-100" : "bg-opacity-0 opacity-0"}`}
    >
      <div
        className={`${size} relative flex transform items-center justify-center rounded-[9px] bg-white shadow-lg transition-all duration-300 ease-out ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}`}
      >
        <div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-[1rem] top-[1rem] m-0 h-[1.5rem] w-[1.5rem] cursor-pointer border-none bg-transparent p-0"
            >
              <img src={CloseIcon} alt="Close" className="h-[1.5rem] w-[1.5rem] object-contain" />
            </button>
          )}

          <div className="flex flex-col items-center text-center">
            {icon && (
              <div
                className={`mb-[2.625rem] mt-[1.5rem] flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full ${iconBgClass}`}
              >
                {typeof icon === "string" ? <img src={icon} alt="Icon" /> : icon}
              </div>
            )}

            {heading && (
              <h2 className={`text-[1.5rem] leading-[0.75rem] ${headingClass}`}>{heading}</h2>
            )}

            <div>{children}</div>

            {buttonText && (
              <button
                onClick={handleButtonClick}
                className={`text-[1rem] font-medium ${buttonClass}`}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
