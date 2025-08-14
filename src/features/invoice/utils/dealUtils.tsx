import { formatPhoneNumber } from "@/common/utils"
import { formatBusinessMonth } from "@/common/utils/businessMonthMapper"
import { format } from "date-fns"

export const formatStatusHistoryDateTime = (dateTime: string | Date | null | undefined): string => {
  if (!dateTime) return ""
  const date = new Date(dateTime)
  if (isNaN(date.getTime())) return ""
  return format(date, "MM-dd-yyyy hh:mm:ss a")
}

export const buildFormDataFromResult = (result: any, salesperson1: any, salesperson2: any) => {
  return {
    salesType: result.salesType || "",
    dealershipDealNo: result.dealershipDealNo || "",
    stock: result.stock || "",
    relayDealType: result.relayDealType || "",
    paymentMethod: result.paymentMethod || "",
    source: result.source || "",
    customerPhone: formatPhoneNumber(result.customerPhone) || "",
    customer: result.customer || "",
    salesperson1: salesperson1?.id ? { id: salesperson1.id, name: salesperson1.name || "" } : null,
    salesperson2: salesperson2?.id ? { id: salesperson2.id, name: salesperson2.name || "" } : null,
    estimatedSalesGross: result.estimatedSalesGross?.toString() || "",
    dealDate: result.dealDate || "",
    businessMonth: formatBusinessMonth(result.businessMonth),
    personaVerificationId: result.customerId || "",
    year: result.year?.toString() || null,
    make: result.make || "",
    model: result.model || "",
    modelNumber: result.modelNumber || "",
    vin: result.vin || "",
    color: result.color || "",
    interiorColor: result.interiorColor || "",
    miles: result.miles?.toString() || "",
    tradeAcv: result.tradeAcv?.toString() || "",
    comment: result.comment || "",
    tradeYear: result.tradeYear?.toString() || null,
    tradeMake: result.tradeMake || "",
    tradeModel: result.tradeModel || "",
    tradeVin: result.tradeVin || "",
    tradePayoff: result.tradePayoff || "",
    tradeMiles: result.tradeMiles?.toString() || "",
    certified: result.certified ?? null,
  }
}
