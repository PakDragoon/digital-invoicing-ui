import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../features/auth/stores/authStore"
import { NotFoundIcon } from "@/assets"
import { ROUTES } from "@/common/routes"

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleRedirect = () => {
    navigate({ to: user ? ROUTES.DASHBOARD : ROUTES.ROOT })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="mb-8">
        <img src={NotFoundIcon} alt="Not Found Icon" className="mx-auto h-40 w-40 text-gray-300" />
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h1>
      <p className="text-[72px] font-extrabold leading-none text-gray-800">404</p>

      <p className="mt-2 max-w-md text-gray-600">
        Oops! The page you're looking for doesn't exist or you are not authorized to access it.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleRedirect}
          className="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          {user ? "Go to Dashboard" : "Go to Login"}
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
