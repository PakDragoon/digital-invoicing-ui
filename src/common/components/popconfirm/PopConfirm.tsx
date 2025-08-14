import React, { useRef, useEffect } from "react"

interface PopConfirmProps {
  title: string
  onConfirm: () => void
  onCancel?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

const PopConfirm: React.FC<PopConfirmProps> = ({
  title,
  onConfirm,
  onCancel,
  open,
  setOpen,
  children,
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    else document.removeEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen])

  return (
    <div className="relative inline-block">
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <div
          ref={popoverRef}
          className="absolute -top-28 right-1 z-50 w-[23rem] rounded-md border border-gray-200 bg-white p-4 text-sm shadow-xl"
          style={{ transform: "translateX(1.8125rem)" }}
        >
          <div className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-shark-200 bg-white shadow-sm" />
          <div className="flex font-medium text-shark-800">{title}</div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="rounded border border-shark-300 bg-white px-2 py-[0.125rem] text-shark-700 hover:bg-shark-50"
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}
            >
              Cancel
            </button>
            <button
              className="rounded bg-cinnabar-600 px-2 py-[0.125rem] text-white hover:bg-cinnabar-800"
              onClick={() => {
                onConfirm()
                setOpen(false)
              }}
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopConfirm
