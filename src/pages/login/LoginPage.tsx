import { useEffect, useState } from "react"
import { LoginBanner } from "../../assets/index"
import LoginForm from "../../features/auth/components/LoginForm"

const LoginPage = () => {
  return (
    <div
      className={`container flex items-center justify-items-center gap-[10.3125rem] transition-all duration-700 ease-out`}
    >
      <div className="hidden transition-all delay-200 duration-700 ease-out md:block">
        <img
          src={LoginBanner}
          alt="Logo"
          className="mb-[3rem] ml-[3.1875rem] mt-[3rem] transition-all delay-300 duration-700 ease-out"
        />
      </div>

      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
