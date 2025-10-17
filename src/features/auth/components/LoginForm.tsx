import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { LockIcon, RelayLogo, ForgotPassIcon, LinkSentIcon } from "../../../assets"
import Modal from "../../../common/components/modal/Modal"
import TextField from "../../../common/components/TextField"
import { useLogin } from "../hooks/useLogin"
import { loginSchema } from "../schemas/loginSchema"
import { ROUTES } from "../../../common/routes"
import { createModalConfigs, ModalType } from "../../../common/utils/modalConfigs"
import { validateEmail } from "../../../common/utils/emailValidation"
import { useAuthStore } from "../stores/authStore"
import { setFinanceInRotation } from "../services/authApi"
import { postForgotPassword } from "../hooks/postForgotPassword"

type LoginFormData = z.infer<typeof loginSchema>

const LoginForm = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null)
  const { login, isPending, error, isSuccess } = useLogin()
  const navigate = useNavigate()
  const [resetClicked, setResetClicked] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleResetPassword = () => {
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }
    postForgotPassword(email)
    setResetClicked(true)
    setCurrentModal("linkSent")
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isSuccess) {
      navigate({ to: ROUTES.DASHBOARD })
    }

    if (error) {
      setCurrentModal("error")
    }
  }, [isSuccess, navigate, error])

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    const { email, password } = data

    login(email, password)
  }
  const { user } = useAuthStore.getState()
  useEffect(() => {
    if (user) {
      const companyId: string = user!.companyId!.toString()

      if (user?.role === "FinanceManager") {
        setFinanceInRotation(user.id, companyId)
      }
    }
  }, [user])

  const handleTryAgain = () => {
    setCurrentModal(null)
  }

  const MODAL_CONFIGS = createModalConfigs({
    handleTryAgain,
    handleResetPassword,
    setCurrentModal,
    email,
    setEmail,
    emailError,
    resetClicked,
    LockIcon: LockIcon,
    ForgotPassIcon: ForgotPassIcon,
    LinkSentIcon: LinkSentIcon,
  })

  return (
    <div className="flex min-h-screen w-[24.0625rem] flex-col items-center justify-center">
      <div className="flex w-full flex-col justify-center">
        <img src={RelayLogo} alt="Logo" className="mb-8" />

        <h2 className="mb-[0.9375rem] text-center text-[30px] font-semibold leading-[38px] text-shark-500">
          Sign in to your account
        </h2>

        <p className="text-center text-[16px] font-normal text-shark-500">
          Welcome back! Please enter your details
        </p>

        <div className="gap-[3.5rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-12">
            <div className="mb-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    placeholder="example@gmail.com"
                    type="email"
                    {...field}
                    error={errors.email?.message}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    placeholder="XXXXXXXXXXXXX"
                    type="password"
                    {...field}
                    error={errors.password?.message}
                  />
                )}
              />
            </div>

            <div className="mb-[1.5rem] flex w-full justify-between text-sm text-gray-600">
              <label className="mb-[1.5rem] mt-[1.5rem] flex items-center">
                <input type="checkbox" className="mr-2 h-[18px] w-[1.125rem]" /> Remember me
              </label>
              <Link
                to={ROUTES.ROOT}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentModal("forgotPassword")
                }}
                className="mb-[1.5rem] mt-[1.5rem] cursor-pointer text-shark-500 underline hover:underline"
              >
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              className="flex h-[2.75rem] w-[24.0625rem] items-center justify-center rounded-[0.25rem] bg-cerulean-600 text-[1rem] font-medium leading-none text-white transition hover:bg-cerulean-700 disabled:bg-gray-400"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="font-inter mt-4 text-center text-[14px] font-medium leading-[20px] text-shark-500">
            {/*Don't have an account?{" "}*/}
            {/*<Link to={ROUTES.SIGNUP} className="text-[14px] text-primary hover:underline">*/}
            {/*  Dealership Signup*/}
            {/*</Link>*/}
          </p>
        </div>
      </div>

      {currentModal && (
        <Modal
          isOpen={Boolean(currentModal)}
          onClose={() => {
            MODAL_CONFIGS[currentModal!]?.onClose?.();
            setCurrentModal(null);
          }}
          heading={MODAL_CONFIGS[currentModal].heading}
          buttonText={MODAL_CONFIGS[currentModal].buttonText}
          onButtonClick={MODAL_CONFIGS[currentModal].onButtonClick}
          icon={MODAL_CONFIGS[currentModal].icon}
          size="w-[30.5rem] h-[26.4375rem]"
          iconBgClass={MODAL_CONFIGS[currentModal].iconBgClass}
          headingClass="text-shark-500 mb-[1rem]"
          buttonClass={MODAL_CONFIGS[currentModal].buttonClass}
        >
          {MODAL_CONFIGS[currentModal].content}
        </Modal>
      )}
    </div>
  )
}

export default LoginForm
