export type DealFormData = {
  id: string
  salesType: string
  dealershipDealNo: string
  stock: string
  relayDealType: string
  paymentMethod: string
  source: string
  salesperson1: string | null
  salesperson2: string | null
  dealDate: string
  customer: string
  contractType: boolean
  financeCompleteDate: string
  contractStatus: string
  payoff: string
  financeManager: string
  originalReturnDate: string
  returnBy: string
  age: string
  accountingStatus: string
  dealStatus: string
}

export type DealFields = {
  field: keyof DealFormData
  type: "select" | "input"
  label: string
  require: boolean
  disabled?: boolean
  config?: {
    dynamicOptions?: boolean
    format?: (value: string) => string
  }
}

export const initialData = (dealNo: string, data: Partial<DealFormData>) => {
  return {
    id: data.id,
    accountingStatus: data.accountingStatus,
    salesType: data.salesType || "",
    dealershipDealNo: dealNo,
    stock: data.stock || "",
    relayDealType: data.relayDealType || "",
    source: data.source || "",
    customer: data.customer || "",
    salesperson1: { id: data.salesperson1Id || "", name: data.salesperson1 || "" },
    salesperson2: { id: data.salesperson2Id || "", name: data.salesperson2 || "" },
    dealDate: data.dealDate || "",
    financeCompleteDate: data.financeCompleteDate || "",
    contractStatus: data.contractStatus || "",
    payoff: data.payoff || "",
    financeManager: data.financeManager || "",
    originalReturnDate: data.originalReturnDate || "",
    returnBy: data.returnBy || "",
    age: data.age || "",
  }
}

export const DealConfig = {
  options: [],
  fields: {
    deal: (
      salespersonOptions: Array<{ name: string; id: string }>,
      edit: boolean = true
    ): DealFields[] => [
      {
        type: "input",
        field: "salesType",
        label: "New/Used",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "customer",
        label: "Customer Name",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "stock",
        label: "Stock",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "dealershipDealNo",
        label: "Deal No",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "dealDate",
        label: "Deal Date",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financeCompleteDate",
        label: "Finance Complete Date",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "relayDealType",
        label: "Relay Deal Type",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "contractStatus",
        label: "Contract Status",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "payoff",
        label: "Payoff",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "age",
        label: "Age",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "salesperson1",
        label: "Sales Person 1",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "salesperson2",
        label: "Sales Person 2",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "financeManager",
        label: "Finance Manager",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "originalReturnDate",
        label: "Original Return Date",
        require: false,
        disabled: edit ? true : undefined,
      },
      {
        type: "input",
        field: "returnBy",
        label: "Return By",
        require: false,
        disabled: edit ? true : undefined,
      },
    ],
  },
}
