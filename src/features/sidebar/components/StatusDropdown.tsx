import { useState, useRef, useEffect } from "react"
import { AvailableIcon, StatusIcon, DownArrow } from "@/assets"
import { useStatusQuery, Status } from "@/features/sidebar/hooks/useStatusQuery"
import { useUpdateStatus } from "@/features/sidebar/hooks/useUpdateStatus"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { toast } from "react-toastify"
import { fetchUserFromDB } from "../hooks/useFetchUser"

export default function CustomDropdown({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Status | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore.getState()
  const id = user?.id
  const currentStatus = user?.status
  const updateStatusMutation = useUpdateStatus()

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return
      try {
        const updatedUser = await fetchUserFromDB(id, user.dealershipId)
        const { currentStatusId, roleName, ...rest } = updatedUser.data

        useAuthStore.getState().setUser({
          ...rest,
          role: roleName,
          status: currentStatusId,
        })
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    loadUser()
  }, [])

  const handleUpdate = (status: Status) => {
    if (!status?.id || !user?.dealershipId || !id) return

    updateStatusMutation.mutate(
      {
        employeeId: id,
        payload: {
          statusId: parseInt(status.id),
          dealershipId: String(user.dealershipId),
        },
      },
      {
        onSuccess: (data) => {
          console.log("✅ Status updated successfully:", data)
          useAuthStore.getState().setUser({
            ...user,
            status: String(status.id),
          })

          toast.success("Status updated successfully.")
        },
        onError: (error: any) => {
          console.error("❌ Failed to update status:", error?.response?.data || error)
          toast.error("Something wrong happened. Unable to update status.")
        },
      }
    )
  }

  const { data, isLoading, isError } = useStatusQuery()
  const statusData = data?.data

  const toggleDropdown = () => {
    if (open) setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (statusData && currentStatus) {
      const matchedStatus = statusData.find((status) => status.id === currentStatus)
      if (matchedStatus) {
        setSelected(matchedStatus)
      }
    }
  }, [data, currentStatus])

  return (
    <div className="regular-text-xs relative h-[2.25rem] w-full max-w-[9.5rem]" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`w-full rounded border px-4 py-2 ${
          isOpen ? "min-w-[8.5rem] border-blue-500 bg-blue-50" : "border-transparent bg-gray-100"
        } flex items-center justify-between text-gray-700 focus:outline-none`}
      >
        {selected?.statusName.toLowerCase() === "available" ? (
          <img
            src={AvailableIcon}
            alt="Status Icon"
            style={{ height: "0.75rem", width: "0.75rem" }}
          />
        ) : (
          <img src={StatusIcon} alt="Status Icon" style={{ height: "0.75rem", width: "0.75rem" }} />
        )}

        {open && (
          <span className={`mx-2 ${isOpen ? "regular-text-xs text-blue-600" : "text-gray-500"}`}>
            {selected?.statusName ?? "Available"}
          </span>
        )}

        {open && (
          <img src={DownArrow} alt="Down Arrow" style={{ height: "0.75rem", width: "0.75rem" }} />
        )}
      </button>

      {isOpen && open && (
        <ul className="absolute left-0 right-0 z-10 mt-1 rounded border border-gray-300 bg-white shadow">
          {isLoading && <li className="px-4 py-2 text-gray-500">Loading...</li>}
          {isError && <li className="px-4 py-2 text-red-500">Error loading statuses</li>}
          {statusData?.map((status) => (
            <li
              key={status.id}
              onClick={() => {
                setSelected(status)
                setIsOpen(false)
                handleUpdate(status)
              }}
              className={`mx-1 my-1 cursor-pointer rounded px-4 py-2 transition-colors duration-150 ${
                selected?.id === status.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {status.statusName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
