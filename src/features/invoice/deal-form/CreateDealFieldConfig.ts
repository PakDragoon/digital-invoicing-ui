import { formatPhoneNumber } from "@/common/utils"
import { formatBusinessMonth, generateBusinessMonthMap } from "@/common/utils/businessMonthMapper"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { useGetSalesPersons } from "@/features/table/services/tableDataApi"
import { useEffect, useState } from "react"

// Types
export type InvoiceFormData = {
  id: string
  salesType: string
  dealershipDealNo: string
  stock: string
  vehicleStatus: string
  relayDealType: string
  paymentMethod: string
  source: string
  dealDate: string
  businessMonth: string
  personaVerificationId: string
  customerPhone: string
  customer: string
  salesperson1: SalespersonOption | null
  salesperson2: SalespersonOption | null
  estimatedSalesGross: string
  year: string
  make: string
  model: string
  modelNumber: string
  vin: string
  color: string
  interiorColor: string
  miles: string
  equipment: string
  certified: string
  tradeYear: string
  tradeMake: string
  tradeModel: string
  tradeVin: string
  tradePayoff: string
  tradeMiles: string
  tradeAcv: string
  comment: string
  salesperson1Id: string
  salesperson2Id: string
  contractType: boolean | null
  contractStatus: string
  contractFundedDate: string
  dealStatus?: string
}

export const initialFormData: InvoiceFormData = {
  id: "",
  salesType: "",
  dealershipDealNo: "",
  stock: "",
  vehicleStatus: "",
  relayDealType: "",
  paymentMethod: "",
  source: "",
  customerPhone: "",
  salesperson1: { id: "", name: "" },
  salesperson2: { id: "", name: "" },
  estimatedSalesGross: "",
  dealDate: "",
  businessMonth: "",
  personaVerificationId: "",
  year: "",
  make: "",
  model: "",
  modelNumber: "",
  vin: "",
  color: "",
  interiorColor: "",
  miles: "",
  equipment: "",
  certified: "",
  tradeYear: "",
  tradeMake: "",
  tradeModel: "",
  tradeVin: "",
  tradePayoff: "",
  tradeMiles: "",
  tradeAcv: "",
  customer: "",
  comment: "",
  salesperson1Id: "",
  salesperson2Id: "",
  contractType: null,
  contractStatus: "",
  contractFundedDate: "",
}

export interface SalespersonOption {
  id: string | undefined
  name: string | undefined
}

export type InvoiceFields = {
  field: keyof InvoiceFormData
  type: "select" | "input" | "number" | "date"
  label: string
  options?: Array<{ name: string; id: string }> | string[] | Array<{ label: string; value: string }>
  require: boolean
  disabled?: boolean
  config?: {
    dynamicOptions?: boolean
    format?: (value: string) => string
  }
}

export interface InitialFormData {
  [key: string]: any
}

export const initialData = (dealNo: string, data: Partial<InvoiceFormData>) => {
  return {
    salesType: data.salesType || "",
    dealershipDealNo: dealNo,
    stock: data.stock || "",
    vehicleStatus: data.vehicleStatus || "",
    relayDealType: data.relayDealType || "",
    paymentMethod: data.paymentMethod || "",
    source: data.source || "",
    customerPhone: formatPhoneNumber(data.customerPhone ?? "") || "",
    customer: data.customer || "",
    salesperson1: { id: data.salesperson1Id || "", name: data.salesperson1 || "" },
    salesperson2: { id: data.salesperson2Id || "", name: data.salesperson2 || "" },
    estimatedSalesGross: data.estimatedSalesGross?.toString() || "",
    dealDate: data.dealDate || "",
    businessMonth: formatBusinessMonth(data.businessMonth) || "",
    personaVerificationId: data.personaVerificationId || "",
    year: data.year?.toString() || "",
    make: data.make || "",
    model: data.model || "",
    modelNumber: data.modelNumber || "",
    vin: data.vin || "",
    color: data.color || "",
    interiorColor: data.interiorColor || "",
    miles: data.miles?.toString() || "",
    tradeAcv: data.tradeAcv?.toString() || "",
    tradeYear: data.tradeYear?.toString() || "",
    tradeMake: data.tradeMake || "",
    tradeModel: data.tradeModel || "",
    tradeVin: data.tradeVin || "",
    tradePayoff: data.tradePayoff || "",
    tradeMiles: data.tradeMiles?.toString() || "",
    comment: data.comment || "",
  }
}

export const businessMonthMap = generateBusinessMonthMap(7)
// Constants

export const dealOptions = {
  dealType: ["New", "Used"],
  vehicleStatus: ["Ground", "Allocated", "Transit", "Order", "Dealer Trade"],
  relayDealType: [
    "Customer Preset",
    "Box Close",
    "Phone Close",
    "Appointment",
    "Request",
    "Submit",
  ],
  paymentMethod: ["Cash", "Finance", "Lease"],
  dealDate: ["2024-01-01", "2024-02-15", "2024-03-20"],
  certified: ["Certified", "Non-Certified"],
  businessMonth: Object.keys(generateBusinessMonthMap(7)),
  verificationId: ["VER1234", "VER5678", "VER9101"],
  dealSource: ["Internet", "Inbound Phone", "Customer Referral", "Tradeshow"],
}

export const DealConfig = {
  options: dealOptions,
  fields: {
    deal: (
      salespersonOptions: Array<{ name: string; id: string }>,
      edit: boolean = false
    ): InvoiceFields[] => [
      {
        type: "select",
        field: "salesType",
        label: "New/Used",
        require: true,
        options: dealOptions.dealType,
        disabled: edit ? false : undefined,
      },
      {
        type: "number",
        field: "dealershipDealNo",
        label: "Deal No",
        require: true,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "stock",
        label: "Stock",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "vehicleStatus",
        label: "Vehicle Status",
        options: dealOptions.vehicleStatus,
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "relayDealType",
        label: "Relay Deal Type",
        options: dealOptions.relayDealType,
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "paymentMethod",
        label: "Payment Method",
        options: dealOptions.paymentMethod,
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "source",
        label: "Source",
        options: dealOptions.dealSource,
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "customerPhone",
        label: "Customer Phone",
        require: false,
        config: edit ? undefined : { format: formatPhoneNumber },
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "customer",
        label: "Customer Name",
        require: true,
        disabled: edit ? true : undefined,
      },
      {
        type: "select",
        field: "salesperson1",
        label: "Sales Person 1",
        options: salespersonOptions,
        require: true,
        config: edit ? undefined : { dynamicOptions: true },
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "salesperson2",
        label: "Sales Person 2",
        options: salespersonOptions,
        require: false,
        config: edit ? undefined : { dynamicOptions: true },
        disabled: edit ? false : undefined,
      },
      {
        type: "number",
        field: "estimatedSalesGross",
        label: "Est Sales Gross",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "date",
        field: "dealDate",
        label: "Deal Date",
        options: dealOptions.dealDate,
        require: false,
      },
      {
        type: "select",
        field: "businessMonth",
        label: "Business Month",
        options: dealOptions.businessMonth,
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "personaVerificationId",
        label: "ID Verification Number",
        options: dealOptions.verificationId,
        require: false,
        disabled: edit ? true : undefined,
      },
    ],

    vehicle: (edit: boolean = false): InvoiceFields[] => [
      {
        type: "input",
        field: "year",
        label: "Year",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "make",
        label: "Make",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "model",
        label: "Model",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "modelNumber",
        label: "Model #",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "vin",
        label: "VIN",
        require: true,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "color",
        label: "Color",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "interiorColor",
        label: "Interior Color",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "number",
        field: "miles",
        label: "Miles",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "equipment",
        label: "Equipment",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "select",
        field: "certified",
        label: "Certified",
        options: dealOptions.certified,
        require: false,
        disabled: edit ? false : undefined,
      },
    ],

    trade: (edit: boolean = false): InvoiceFields[] => [
      {
        type: "input",
        field: "tradeYear",
        label: "Year",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "tradeMake",
        label: "Make",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "tradeModel",
        label: "Model",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "tradeVin",
        label: "VIN",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "number",
        field: "tradeMiles",
        label: "Miles",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "tradePayoff",
        label: "Payoff",
        require: false,
        disabled: edit ? false : undefined,
      },
      {
        type: "input",
        field: "tradeAcv",
        label: "ACV",
        require: false,
        disabled: edit ? false : undefined,
      },
    ],
  },
}

// Hooks
export const useSalespersonOptions = () => {
  const dealershipId = useAuthStore((state) => state.user?.dealershipId?.toString() ?? "")
  const [salespersonOptions, setSalespersonOptions] = useState<Array<{ name: string; id: string }>>(
    []
  )
  const { data: salesPersonsList } = useGetSalesPersons(dealershipId)
  const token = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const mapSalespersons = () => {
      if (salesPersonsList?.data) {
        const options = salesPersonsList.data.map((person: any) => ({
          name: `${person.firstName} ${person.lastName}`,
          id: person.id,
        }))
        setSalespersonOptions(options)
      }
    }

    token && salesPersonsList && mapSalespersons()
  }, [token, salesPersonsList])

  return salespersonOptions
}

export const useDealDropdownFields = () => {
  const salespersonOptions = useSalespersonOptions()
  return DealConfig.fields.deal(salespersonOptions)
}

export const useVehicleDropdownFields = () => DealConfig.fields.vehicle
export const useTradeDropdownFields = () => DealConfig.fields.trade
