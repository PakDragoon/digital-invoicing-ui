import React from "react"
import { humanize } from "@/common/utils/humanize"

export const getStatusBadge = (status: string) => {
  const baseClass = "text-sm px-4 py-1 rounded-full text-nowrap"
  if (!status) return <span></span>
  const humanizedStatus = humanize(status)

  switch (status) {
    case "New":
    case "AccountingReturned":
    case "Pending":
      return (
        <span className={`${baseClass} bg-oldlace-100 text-oldlace-600`}>{humanizedStatus}</span>
      )
    case "Approved":
    case "Sold":
    case "AVAILABLE":
      return (
        <span className={`${baseClass} bg-screamin-100 text-screamin-700`}>{humanizedStatus}</span>
      )
    case "DealReturned":
    case "UNAVAILABLE":
      return (
        <span className={`${baseClass} bg-cinnabar-100 text-cinnabar-800`}>{humanizedStatus}</span>
      )
    case "InProcess":
    case "VACATION":
      return (
        <span className={`${baseClass} bg-oldlace-100 text-oldlace-600`}>{humanizedStatus}</span>
      )
    case "WITH CUSTOMER":
    case "Used":
      return (
        <span className={`${baseClass} bg-cerulean-100 text-cerulean-600`}>{humanizedStatus}</span>
      )
    default:
      return (
        <span className={`${baseClass} bg-oldlace-50 text-oldlace-400`}>{humanizedStatus}</span>
      )
  }
}
