import { Link, useRouterState } from "@tanstack/react-router"
import { BreadCrumbIcon, RightArrowIcon } from "../../../assets"
import React from "react"
import { useAuthStore } from "@/features/auth/stores/authStore"

interface BreadCrumbProps {
  rootLabel: string
  rootPath: string
}

export const BreadCrumb: React.FC<BreadCrumbProps> = ({ rootLabel, rootPath }) => {
  const role = useAuthStore((state) => state.user?.role ?? "")
  const router = useRouterState()

  const segments = router.location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, idx, arr) => {
      const path = "/" + arr.slice(0, idx + 1).join("/")
      return { label: segment, path }
    })

  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDealPage = /^\/deals\/\d+$/.test(pathname)

  return (
    <>
      <nav className="mb-[1rem] flex items-center space-x-3 p-1 text-[1rem] text-gray-500">
        <div className="flex items-center space-x-3">
          <img src={BreadCrumbIcon} alt="breadcrumb" className="h-6 w-6" />
          <Link to={rootPath} className="text-md text-[#4B465C] hover:underline">
            {rootLabel}
          </Link>
        </div>

        {segments.map((seg, idx) => (
          <div key={seg.path} className="flex items-center space-x-2">
            <img src={RightArrowIcon} alt="breadcrumb" className="h-5 w-5" />
            <Link
              to={seg.path}
              className={`${router.location.pathname === seg.path ? "cursor-default font-semibold text-cerulean-600" : "text-[#4B465C] hover:underline"} text-md capitalize`}
            >
              {(/^\d+$/.test(seg.label) ? `#${seg.label}` : seg.label).replaceAll("-", " ")}
            </Link>
          </div>
        ))}
      </nav>
    </>
  )
}
