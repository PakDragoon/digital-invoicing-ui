import React from "react"
import { useNavigate } from "@tanstack/react-router"
import TextField from "../components/TextField"
import CustomButton from "../components/buttons/CustomButton"
import { ROUTES } from '@/common/routes'

export type ModalType =
  | "error"
  | "forgotPassword"
  | "linkSent"
  | "existingDeal"
  | "dealCreated"
  | "dealNotExisting"
  | "makeReadyCreated"
  | "existingMakeReady"
  | "dealUpdated"
  | "customerAdded"
  | "inviteSent"
  | "welcomeOnboard"
  | "dealershipCreated"
  | null

export interface ModalConfig {
  heading: string
  buttonText: string
  onButtonClick?: () => void
  onClose?: () => void
  icon: React.ReactNode
  iconBgClass: string
  content: React.ReactNode
  buttonClass: string
  closeCreateDealModal?: () => void
  openMakeReadyModal?: () => void
  closeEditDeal?: () => void
  closeEditMakeReady?: () => void
  closeAssignDeal?: () => void
  closeNotifySalesperson?: () => void
  closeCustomerModal?: () => void
}

export const createModalConfigs = ({
  handleTryAgain,
  handleResetPassword,
  setCurrentModal,
  email,
  setEmail,
  emailError,
  resetClicked,
  LockIcon,
  ForgotPassIcon,
  LinkSentIcon,
  closeCreateDealModal,
  openMakeReadyModal,
  closeMakeReadyModal,
  closeEditDeal,
  closeEditMakeReady,
  closeAssignDeal,
  closeNotifySalesperson,
  closeCustomerModal,
}: {
  handleTryAgain?: () => void
  handleResetPassword?: () => void
  setCurrentModal?: (modal: ModalType) => void
  email?: string
  setEmail?: (email: string) => void
  emailError?: string | null
  resetClicked?: boolean
  LockIcon?: React.ReactNode
  ForgotPassIcon?: React.ReactNode
  LinkSentIcon?: React.ReactNode
  closeCreateDealModal?: () => void
  openMakeReadyModal?: () => void
  closeMakeReadyModal?: () => void
  openEditDeal?: () => void
  closeEditDeal?: () => void
  closeEditMakeReady?: () => void
  closeAssignDeal?: () => void
  closeNotifySalesperson?: () => void
  closeCustomerModal?: () => void
}): Record<Exclude<ModalType, null>, ModalConfig> => {
  const navigate = useNavigate()

  return {
    error: {
      heading: "Oops! Incorrect Email or Password",
      buttonText: "Try Again",
      onButtonClick: handleTryAgain,
      icon: LockIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="mb-[2.625rem] text-[1.125rem] font-medium not-italic leading-[1.75rem] text-shark-500">
          Please try again!
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    forgotPassword: {
      heading: "Enter Your Email",
      buttonText: "Reset Password",
      onButtonClick: handleResetPassword,
      onClose: () => {
        setEmail?.('');
      },
      icon: ForgotPassIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <div className="mb-[2.625rem] mt-[1.25rem] w-[26rem]">
          <TextField
            placeholder="Enter your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail?.(e.target.value)}
            error={emailError || ""}
          />
        </div>
      ),
      buttonClass: `text-white text-[0.875rem] p-[0.75rem] rounded-[0.25rem] ${
        resetClicked || email === '' ? "bg-shark-300" : "bg-cerulean-600"
      }`,
    },
    linkSent: {
      heading: "Recovery Link Sent",
      buttonText: "Done",
      onButtonClick: () => setCurrentModal?.(null),
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="mb-[2.625rem] text-[1.125rem] font-medium not-italic leading-[1.75rem] text-shark-500">
          Please check your email for password recovery
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    existingDeal: {
      heading: "Deal Exist",
      buttonText: "OK",
      onButtonClick: () => setCurrentModal?.(null),
      icon: LockIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="mb-[2.625rem] text-[1.125rem] font-medium not-italic leading-[1.75rem] text-shark-500">
          This deal already exists
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    dealCreated: {
      heading: "Success",
      buttonText: "Done",
      onButtonClick: () => {
        setCurrentModal?.(null)
        closeCreateDealModal?.()
        closeEditDeal?.()
        closeAssignDeal?.()
      },
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <div className="flex w-full flex-col justify-between align-middle">
          <p className="mb-6 text-lg font-medium text-shark-500">
            Your deal has been successfully saved.
          </p>
          <div className="">
            <CustomButton
              text="Create Make Ready"
              variant="outlined"
              onClick={() => {
                closeCreateDealModal?.()
                closeEditDeal?.()
                closeAssignDeal?.()
                openMakeReadyModal?.()
                setCurrentModal?.(null)
              }}
            />
          </div>
        </div>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem] mt-2",
    },
    dealUpdated: {
      heading: "Success",
      buttonText: "Done",
      onButtonClick: () => {
        setCurrentModal?.(null)
        closeCreateDealModal?.()
        closeEditDeal?.()
      },
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <div className="flex w-full flex-col justify-between align-middle">
          <p className="mb-6 text-lg font-medium text-shark-500">
            Your deal has been successfully saved.
          </p>
        </div>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem] mt-2",
    },
    dealNotExisting: {
      heading: "Invalid",
      buttonText: "Ok",
      onButtonClick: () => {
        setCurrentModal?.(null)
        closeCreateDealModal?.()
      },
      icon: LockIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <div className="flex w-full flex-col justify-between align-middle">
          <p className="mb-6 text-lg font-medium text-shark-500">Deal Does Not Exists</p>
        </div>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem] mt-2",
    },
    makeReadyCreated: {
      heading: "Success",
      buttonText: "Done",
      onButtonClick: () => {
        setCurrentModal?.(null)
        closeMakeReadyModal?.()
        closeEditMakeReady?.()
      },
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <div className="flex w-full flex-col justify-between align-middle">
          <p className="mb-6 text-lg font-medium text-shark-500">Make Ready Saved successfully</p>
        </div>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem] mt-2",
    },
    existingMakeReady: {
      heading: "Make Ready Exists",
      buttonText: "OK",
      onButtonClick: () => setCurrentModal?.(null),
      icon: LockIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="mb-[2.625rem] text-[1.125rem] font-medium not-italic leading-[1.75rem] text-shark-500">
          Make Ready for this deal No Already Exists
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    customerAdded: {
      heading: "Customer Visit Created Successfully!",
      buttonText: "OK",
      onButtonClick: () => {
        setCurrentModal?.(null)
        closeNotifySalesperson?.()
        closeCustomerModal?.()
      },
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="mb-[2.625rem] text-[1.125rem] font-medium not-italic leading-[1.75rem] text-shark-500">
          Successfully Added customer visit
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    inviteSent: {
      heading: "Invitation Sent!",
      buttonText: "Done",
      onButtonClick: () => navigate({ to: ROUTES.ROOT }),
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="px-[3rem] mb-[2.625rem] text-sm not-italic leading-[1.75rem] text-shark-500">
          An invite has been sent to <span className="text-cerulean-500 font-semibold">{email}</span>. They’ll receive instructions to complete the setup
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    welcomeOnboard: {
      heading: "Welcome! Let’s Complete Your Dealership Setup",
      buttonText: "Continue",
      onButtonClick: () => setCurrentModal?.(null),
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="px-[3rem] mb-[2.625rem] text-sm not-italic leading-[1.75rem] text-shark-500">
          You’ve been invited to manage this dealership on Relay Automotive. Just a few more steps and your dealership will be ready to go live
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
    dealershipCreated: {
      heading: "Your dealership has been created",
      buttonText: "Get Started",
      onButtonClick: () => navigate({ to: ROUTES.ROOT }),
      icon: LinkSentIcon,
      iconBgClass: "bg-cinnabar-500",
      content: (
        <p className="px-[3rem] mb-[2.625rem] text-sm not-italic leading-[1.75rem] text-shark-500">
          Lets get started!
        </p>
      ),
      buttonClass: "bg-cerulean-600 text-white w-[7.25rem] h-[2.75rem] rounded-[0.25rem]",
    },
  }
}
