import { parseDDMMYYYY } from "@/common/utils"

export type CITLogsData = {
  id: string
  financeType: string
  applicationType: string
  applicationStatus: string
  applicationStatusDetail: string
  customerName: string
  vin: string
  makeName: string
  modelName: string
  modelYear: string
  saleClass: string
  vehicleStock: string
  cashDownPaymentAmount: number
  financedAmount: number
  manufacturerRebateAmount: number
  netTradeAmount: number
  financedTermQuantity: number
  conditionRejection: string
  submittedDateTime: string
  decisionDateTime: string
  creditAnalystInitials: string
  creditAnalystComments: string
  stipulations: string
  decisionComments: string
  r1DealerId: string
  financeCompanyId: string
  financeCompanyName: string
  fundingStatus: string
  funderComments: string
  contractStatus?: string
  contractFundedDate?: string
  totalMonthlyPaymentAmount?: string
  tier?: string
  creditContractPersonTitle?: string
  creditContractPersonPhone?: string
  reserveParticipation?: string
  reserveFlat?: string
  hasRouteOneContract?: boolean
}

export type CITLogFields = {
  field: keyof CITLogsData
  type: "select" | "input" | "date"
  label: string
  require: boolean
  disabled?: boolean
  options?: string[]
  config?: {
    dynamicOptions?: boolean
    format?: (value: string) => string
  }
}

export const initialData = (data: Partial<CITLogsData>) => {
  return {
    id: data.id,
    financeType: data.financeType || "",
    applicationType: data.applicationType || "",
    applicationStatus: data.applicationStatus || "",
    applicationStatusDetail: data.applicationStatusDetail || "",
    customerName: data.customerName || "",
    vin: data.vin || "",
    makeName: data.makeName || "",
    modelName: data.modelName || "",
    modelYear: data.modelYear || "",
    saleClass: data.saleClass || "",
    vehicleStock: data.vehicleStock || "",
    cashDownPaymentAmount: data.cashDownPaymentAmount ? String(data.cashDownPaymentAmount) : "0",
    financedAmount: data.financedAmount ? String(data.financedAmount) : "0",
    manufacturerRebateAmount: data.manufacturerRebateAmount
      ? String(data.manufacturerRebateAmount)
      : "0",
    netTradeAmount: data.netTradeAmount ? String(data.netTradeAmount) : "0",
    financedTermQuantity: data.financedTermQuantity ? String(data.financedTermQuantity) : "0",
    conditionRejection: data.conditionRejection || "",
    submittedDateTime: data.submittedDateTime || "",
    decisionDateTime: data.decisionDateTime || "",
    creditAnalystInitials: data.creditAnalystInitials || "",
    creditAnalystComments: data.creditAnalystComments || "",
    stipulations: data.stipulations || "",
    decisionComments: data.decisionComments || "",
    r1DealerId: data.r1DealerId || "",
    financeCompanyId: data.financeCompanyId || "",
    financeCompanyName: data.financeCompanyName || "",
    fundingStatus: data.fundingStatus || "",
    funderComments: data.funderComments || "",
    contractStatus: data.contractStatus || "",
    contractFundedDate: data.contractFundedDate || null,
    totalMonthlyPaymentAmount: data.totalMonthlyPaymentAmount
      ? String(data.totalMonthlyPaymentAmount)
      : "0",
    tier: data.tier || "",
    creditContractPersonTitle: data.creditContractPersonTitle || "",
    creditContractPersonPhone: data.creditContractPersonPhone || "",
    reserveParticipation: data.reserveParticipation || "",
    reserveFlat: data.reserveFlat || "",
    hasRouteOneContract: data.hasRouteOneContract,
  }
}

export const contractOptions = {
  status: ["Signed", "Funded", "Booked"],
}

export const CITConfig = {
  options: contractOptions,
  fields: {
    cit: (
      customOption: Array<{ name: string; id: string }>,
      edit: boolean = true
    ): CITLogFields[] => [
      {
        type: "input",
        field: "financeType",
        label: "Finance Type",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "applicationType",
        label: "Application Type",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "applicationStatus",
        label: "Application Status",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "applicationStatusDetail",
        label: "Application Status Detail",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "customerName",
        label: "Customer Name",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "vin",
        label: "VIN",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "makeName",
        label: "Make Name",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "modelName",
        label: "Model Name",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "modelYear",
        label: "Model Year",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "saleClass",
        label: "Sale Class",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "vehicleStock",
        label: "Vehicle Stock",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "cashDownPaymentAmount",
        label: "Cash Down Payment Amount",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financedAmount",
        label: "Financed Amount",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "manufacturerRebateAmount",
        label: "Manufacturer Rebate Amount",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "netTradeAmount",
        label: "Net Trade Amount",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financedTermQuantity",
        label: "Financed Term Quantity",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "totalMonthlyPaymentAmount",
        label: "Total Monthly Payment",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "tier",
        label: "Tier",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "conditionRejection",
        label: "Condition Rejection",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "submittedDateTime",
        label: "Submitted DateTime",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "decisionDateTime",
        label: "Decision DateTime",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "creditContractPersonTitle",
        label: "Credit Person Title",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "creditContractPersonPhone",
        label: "Credit Person Phone",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "creditAnalystInitials",
        label: "Credit Analyst Initials",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "creditAnalystComments",
        label: "Credit Analyst Comments",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "stipulations",
        label: "Stipulations",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "reserveParticipation",
        label: "Participation",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "reserveFlat",
        label: "Flat",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "decisionComments",
        label: "Decision Comments",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "r1DealerId",
        label: "R1 Dealer Id",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financeCompanyId",
        label: "Finance Company ID",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financeCompanyName",
        label: "Finance Company Name",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "fundingStatus",
        label: "Funding Status",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "funderComments",
        label: "Funder Comments",
        require: false,
        disabled: edit ? true : undefined,
      },
    ],
    contractStatus: (
      customOption: Array<{ name: string; id: string }>,
      edit: boolean = true
    ): CITLogFields[] => [
      {
        type: "select",
        field: "contractStatus",
        label: "Contract Status",
        options: contractOptions.status,
        require: false,
        disabled: undefined,
      },
      {
        type: "date",
        field: "contractFundedDate",
        label: "Contract Funded Date",
        require: false,
        disabled: undefined,
      },
    ],
  },
}
