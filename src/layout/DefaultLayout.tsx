import RoleBasedHeader from "@/common/components/header/RoleBasedHeader"
import { useClickOutside } from "@/common/hooks/useClickOutside"
import { useFetchNotifications } from "@/features/notifications/hooks/useFetchNotifications"
// import { usePusherNotifications } from "@/features/notifications/hooks/usePusherNotifications"
import { useNotificationStore } from "@/features/notifications/store/notificationStore"
import { Outlet } from "@tanstack/react-router"
import React, { useEffect, useRef } from "react"
import Navbar from "../features/navbar/components/Navbar"
import Sidebar from "../features/sidebar/components/Sidebar"
import { useSidebarStore } from "../features/sidebar/store/sidebarStore"
import { useAuthStore } from "@/features/auth/stores/authStore"

const RootLayout: React.FC = () => {
  const open = useSidebarStore((state) => state.open)
  const toggleSidebar = useSidebarStore((state) => state.toggle)
  const setOpen = useSidebarStore((state) => state.setOpen)
  const { user } = useAuthStore.getState()

  const sidebarRef = useRef<HTMLDivElement>(null)

  // usePusherNotifications()
  const { isLoading } = useFetchNotifications()

  // Push isLoading into the store
  useEffect(() => {
    useNotificationStore.getState().setIsLoading(isLoading)
  }, [isLoading])

  useClickOutside(sidebarRef, () => {
    if (open) {
      setOpen(false)
    }
  })

  return (
    <div className="flex h-screen flex-col overflow-auto bg-[#E5E7E8]">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
          <div ref={sidebarRef}>
              <Sidebar />
            </div>
        <div className="h-[62px] w-full pl-[5rem]">
          <RoleBasedHeader />
        </div>
        <main className="flex-1 overflow-auto pb-[1.5rem] pl-[6.5rem] pr-[1.5rem] pt-[1.375rem]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
