import React, { ReactNode, MouseEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { useModalStore } from "./store/modalStore";
// import { useStepStore } from "@/features/dashboard/components/GeneralManager/store.tsx/UseStepsStore"
import { BackArrowIcon } from "@/assets";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  widthClass,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | MouseEventInit) => {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      )
        onClose();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = () => onClose();
  const handleContentClick = (e: MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();
  const { disableModalButton } = useModalStore();
  // const { step, setStep } = useStepStore()

  const handleBackClick = () => {
    // if (step > 0) {
    //   setStep(step - 1)
    // }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            style={{ zIndex: 1000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center px-[62px] py-[32px]"
            style={{ zIndex: 1001 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              ref={modalRef}
              className={`relative flex max-h-[90vh] flex-col rounded-lg bg-[#FCFCFC] shadow-lg ${widthClass ? widthClass : "w-fit"}`}
              onClick={handleContentClick}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#01012E14] px-[24px] py-[18px]">
                <div className="flex gap-3">
                  {0 > 0 && (
                    <img
                      src={`${BackArrowIcon}`}
                      alt="Back Arrow Icon"
                      onClick={handleBackClick}
                      className="cursor-pointer"
                    />
                  )}
                  <span className="font-inter text-[24px] font-semibold not-italic leading-[32px] text-[#3455DB]">
                    {title}
                  </span>
                </div>
                <div
                  {...(!disableModalButton && { onClick: onClose })}
                  className={`text-2xl ${disableModalButton ? "text-[#CCCCCC]" : "text-[#81868F] hover:cursor-pointer"}`}
                  aria-label="close"
                  aria-disabled={disableModalButton}
                >
                  <IoIosClose />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="w-full flex-1 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
