import { SignupBanner } from "../../assets/index"
import SignupForm from "../../features/auth/components/SignupForm"

const SignupPage = () => {
  return (
    <div className="container flex items-center h-screen">
      <div className="hidden md:flex md:w-1/2 items-center justify-center py-8">
        <img src={`${SignupBanner}`} alt="Logo" className="max-h-[90vh] object-contain" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage
