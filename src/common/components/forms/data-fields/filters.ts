import React from "react"
import {
  generateBusinessMonthMap,
  formatBusinessMonth,
  generateProductionBusinessMonthMap,
} from "@/common/utils"
import { ISalesBoardParams } from "@/features/salesboard/hooks"

export type FormData = {
  dealMake: string[]
  dealStatus: string[]
  businessMonth: string
  dateRange: [Date | null, Date | null]
  vehicleStatus: string[]
  startDate: string
  endDate: string
}

export const initialFormData = {
  year: null,
  dealMake: [],
  dealStatus: [],
  businessMonth: "",
  dateRange: [null, null],
  vehicleStatus: [],
}

export type FormField<T> = {
  field: keyof T
  type: "text" | "radio" | "checkbox" | "select" | "date"
  label: string
  options?: { label: React.ReactNode; value: string }[]
  required: boolean
}

export const salesTypeOptions: { label: React.ReactNode; value: string }[] = [
  { label: "All", value: "All" },
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
]

export const dealStatusOptions = [
  { label: "Sold", value: "Sold" },
  { label: "In Process", value: "InProcess" },
  { label: "Customer Signed", value: "CustomerSigned" },
  { label: "Finance Complete", value: "FinanceComplete" },
  { label: "Admin / Bill Reviewed", value: "AdminBillReviewed" },
  { label: "Finalized", value: "Finalized" },
  // { label: "Dead", value: "Dead" },
  { label: "Pending", value: "Pending" },
   { label: "Approved", value: "Approved" },
  { label: "Deal Returned", value: "DealReturned" },
  { label: "Accounting Returned", value: "AccountingReturned" },
  { label: "Conditioned", value: "Conditioned" },
  { label: "Scanned", value: "Scanned" },
  { label: "Declined", value: "Declined" },
  { label: "Finance Returned", value: "FinanceReturned" },
  // { label: "Quote", value: "Quote" },
]

export const vehicleStatusOptions = [
  { label: "Ground", value: "Ground" },
  { label: "Allocated", value: "Allocated" },
  { label: "Transit", value: "Transit" },
  { label: "Order", value: "Order" },
  { label: "Dealer Trade", value: "Dealer Trade" },
]

export const makeOptions = [
  { label: "BMW", value: "BMW" },
  { label: "Cadillac", value: "Cadillac" },
  { label: "Ford", value: "Ford" },
  { label: "Toyota", value: "Toyota" },
  { label: "Daihatsu", value: "Daihatsu" },
  { label: "Ferrari", value: "Ferrari" },
  { label: "Lamborghini", value: "Lamborghini" },
  { label: "Mustang", value: "Mustang" },
  { label: "Mercedes", value: "Mercedes" },
  { label: "Corvette", value: "Corvette" },
  { label: "Mitsubishi", value: "Mitsubishi" },
  { label: "Alpha Romeo", value: "Alpha Romeo" },
]

export const businessMonthOptions = Object.keys(generateBusinessMonthMap(7, true))
export const productionBusinessMonth = Object.keys(generateProductionBusinessMonthMap())

export function convertFiltersForForm(filters: ISalesBoardParams | undefined) {
  return {
    dealStatus: filters?.dealStatus ?? [],
    businessMonth: filters?.businessMonth ? formatBusinessMonth(filters.businessMonth) : "",
    dateRange:
      filters?.startDate && filters.endDate ? [filters.startDate, filters.endDate] : [null, null],
    vehicleStatus: filters?.vehicleStatus ?? [],
  }
}
