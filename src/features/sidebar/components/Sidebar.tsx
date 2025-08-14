import { useAuthStore } from "@/features/auth/stores/authStore"
import { Link, useRouterState } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import {
  Menu,
  MessageIcon,
  ObjectiveIcon,
  RelayIcon,
  RelayLogo,
  SidebarNotificationIcon,
  TableIcon,
  HomeIcon,
  LogsIcon,
  SalesBoardIcon,
  FinanceQueueIcon,
} from "@/assets"
import { ROUTES } from "@/common/routes"
import { useSidebarStore } from "../store/sidebarStore"
import StatusDropdown from "./StatusDropdown"

interface SidebarProps {
  className?: string
}

const menuItems: Record<string, { text: string; Icon: React.FC | string; Path?: string }[]> = {
  GeneralManager: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: `${ROUTES.CUSTOMER_LOG}?tab=all` },
    { text: "Objectives", Icon: `${ObjectiveIcon}`, Path: ROUTES.OBJECTIVES },
    { text: "Sales Board", Icon: `${SalesBoardIcon}`, Path: ROUTES.SALES_BOARD },
    { text: "Finance Log", Icon: `${LogsIcon}`, Path: `${ROUTES.INVOICES}?tab=finance` },
    { text: "Car make/model", Icon: `${TableIcon}`, Path: `${ROUTES.CAR_MAKE_MODEL}` },
  ],
  SalesManager: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: ROUTES.CUSTOMER_LOG },
    { text: "Sales Board", Icon: `${SalesBoardIcon}`, Path: ROUTES.SALES_BOARD },
    { text: "Finance Queue", Icon: `${FinanceQueueIcon}`, Path: ROUTES.FINANCE_QUEUE },
    { text: "Objectives", Icon: `${ObjectiveIcon}`, Path: ROUTES.OBJECTIVES },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  Receptionist: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: ROUTES.CUSTOMER_LOG },
    { text: "Salesperson Log", Icon: `${TableIcon}`, Path: ROUTES.SALESPERSON },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  FinanceManager: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`,Path: ROUTES.CUSTOMER_LOG },
    { text: "Finance Log", Icon: `${LogsIcon}`, Path: `${ROUTES.INVOICES}?tab=finance` },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  FinanceDirector: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: ROUTES.CUSTOMER_LOG },
    { text: "Finance Log", Icon: `${LogsIcon}`, Path: `${ROUTES.INVOICES}?tab=finance` },
    {
      text: "Employee Status",
      Icon: `${TableIcon}`,
      Path: `${ROUTES.MANAGERS_OVERVIEW}?tab=finance-manager`,
    },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  FinanceAssistant: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: ROUTES.CUSTOMER_LOG },
    { text: "Finance Log", Icon: `${LogsIcon}`, Path: `${ROUTES.INVOICES}?tab=finance` },
    {
      text: "Employee Status",
      Icon: `${TableIcon}`,
      Path: `${ROUTES.MANAGERS_OVERVIEW}?tab=finance-manager`,
    },
  ],
  Accountant: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Deals Log", Icon: `${LogsIcon}`, Path: `${ROUTES.INVOICES}?tab=all-deals` },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  SalesPerson: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Customer Log", Icon: `${LogsIcon}`, Path: ROUTES.CUSTOMER_LOG },
    { text: "Sales Board", Icon: `${SalesBoardIcon}`, Path: ROUTES.SALES_BOARD },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  MakeReady: [
    { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD },
    { text: "Messages", Icon: `${MessageIcon}`, Path: ROUTES.MESSAGES },
    { text: "Notifications", Icon: `${SidebarNotificationIcon}`, Path: ROUTES.NOTIFICATIONS },
  ],
  Admin: [
     { text: "Dashboard", Icon: `${HomeIcon}`, Path: ROUTES.DASHBOARD }
  ]
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { user } = useAuthStore.getState()
  const role = user?.role || "Admin"
  const router = useRouterState()
  const currentPath = router.location.pathname

  const open = useSidebarStore((state) => state.open)
  const toggleSidebar = useSidebarStore((state) => state.toggle)

  const setOpen = useSidebarStore((state) => state.setOpen)
  const selectedMenuItems = menuItems[role] || menuItems["Admin"]

  const handleMenuItemClick = () => setOpen(false)

  return (
    <div
      className={`duration-750 fixed left-0 top-0 flex h-screen flex-col justify-between border-r border-gray-200 bg-white px-[1rem] py-[1.5rem] transition-all ease-in-out ${open ? "max-h-[91.375rem] w-[11.25rem]" : "w-[5rem]"} z-50 overflow-x-hidden`}
    >
      <div className="flex w-full flex-col items-center">
        <div
          className={`flex items-center ${open ? "justify-between" : "justify-center"} h-[2.563rem] w-[9.875rem]`}
        >
          <button onClick={toggleSidebar} className="p-2">
            <img src={`${Menu}`} alt="Menu" className="h-[1.938rem] w-[1.938rem]" />
          </button>
        </div>
        {role !== 'Admin' &&
          <>
        <div className="my-[1.25rem] h-px w-full bg-shark-100"></div>
        
        <div className={`${open ? "flex flex-col items-center p-[0.75]" : ""} gap-4`}>
          <StatusDropdown open={open} />
          </div>
          </>
       }
       

        <div className="my-[1.25rem] h-px w-full bg-shark-100"></div>

        <ul className="flex flex-col gap-[1rem]">
          {selectedMenuItems?.map((item, index) => {
            const isActive = item.Path === currentPath
            return (
              <React.Fragment key={item.text}>
                <li className="list-none">
                  <Link to={item.Path} onClick={handleMenuItemClick}>
                    <button
                      className={`flex h-11 w-full max-w-[9.75rem] items-center rounded px-3 ${open ? "justify-start" : "justify-center"} group cursor-pointer text-shark-600 transition-all duration-200 hover:bg-cerulean-600 hover:text-white ${isActive ? "bg-cerulean-600 text-white" : ""}`}
                      style={{ gap: open ? "0.75rem" : "0" }}
                    >
                      <div className="flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center">
                        {typeof item.Icon === "string" && (
                          <img
                            src={item.Icon}
                            alt={item.text}
                            className={`h-[1.125rem] w-[1.125rem] transition-all duration-200 ${isActive ? "brightness-0 invert" : "group-hover:brightness-0 group-hover:invert"}`}
                          />
                        )}
                      </div>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.25 }}
                            className="flex h-[1.25rem] w-[9.75rem] items-center gap-[0.75rem] rounded-md"
                          >
                            <span className="regular-text-sm w-full text-left transition-colors duration-200 group-hover:text-white">
                              {item.text}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </Link>
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>

      <div className="relative -mb-1 h-16 text-center">
        <img
          src={`${RelayLogo}`}
          alt="Relay Automotive"
          className={`absolute left-1/2 top-0 mx-auto -translate-x-1/2 transition-all duration-300 ease-in-out ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} w-36`}
        />
        <img
          src={`${RelayIcon}`}
          alt="Relay Automotive Small"
          className={`absolute left-1/2 top-0 mx-auto -translate-x-1/2 transition-all duration-300 ease-in-out ${open ? "scale-90 opacity-0" : "scale-100 opacity-100"} w-12`}
        />
      </div>
    </div>
  )
}

export default Sidebar
