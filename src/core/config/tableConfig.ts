import {
  ACCOUNTING_RETURNED_STATUS,
  ASSIGNED_WORKING_FINANCE_STATUS,
  DEAL_STATUSES,
  DEALS_SOLD_STATUSES,
  FINALIZED_DEAL_STATUSES,
  FINANCE_DEAL_STATUSES,
  PAST_CUSTOMER_SIGNED,
  RETURNED_IN_ACCOUNTING_STATUS,
  TO_BE_FINALIZED_STATUSES,
} from "@/common/constants/deal-status";
import { MAKE_READY_STATUS } from "@/common/constants/make-ready-status";
import colors from "@/common/constants/tailwind-colors";
import {
  VISIT_STATUS,
  VISIT_STATUS_WAITING,
} from "@/common/constants/visit-status";
import { ROUTES } from "@/common/routes";
import { useAuthStore } from "@/features/auth/stores/authStore";
import AccountantDealEdit from "@/features/invoice/components/AccountantDealEdit";
import {
  ALL_SALESPERSON_STATUS,
  AVAILABLE_STATUS,
  NOT_WORKING_TODAY_STATUS,
  TEMPORARILY_UNAVAILABLE_STATUS,
  WITH_CUSTOMER_STATUS,
} from "@/common/constants/salesperson-status";

export interface IHeader {
  key: string;
  label: string;
  filtered?: boolean;
  status?: boolean;
  filterKey?: string;
  editable?: boolean;
  checked?: boolean;
  hidden?: boolean;
  isCurrency?: boolean;
}

export interface ITab {
  key: string;
  label: string;
  api: string;
  color: string;
  rowColor: string;
  headers: IHeader[];
  dealStatus?: string[];
  mrStatus?: string[];
  visitStatus?: string[];
  empStatus?: string[];
  disabled?: boolean;
  hidden?: boolean;
  searchPlaceholder?: string;
  alignment?: "left" | "right";
}

export interface ITablePageConfig {
  tabs: ITab[];
}

export type ITableConfig = {
  [role: string]: {
    [tablePage: string]: ITablePageConfig;
  };
};

export type DataTableProps = {
  color: string;
  rowColor: string;
  headers: IHeader[];
  hidden: boolean;
  dealStatus: string[];
  mrStatus: string[];
  visitStatus: string[];
  empStatus: string[];
  carMakes: string[];
  data: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string | null) => void;
  searchBoxPlaceholder?: string;
  showSearchBox?: string;
  editField?: boolean;
  objectiveData: any[];
  setObjectiveData: React.Dispatch<React.SetStateAction<any[]>>;
  button: string;
  selectedTab?: string;
  businessMonth?: string;
  setBusinessMonth: any;
};

export const PRODUCTION_HEADERS: IHeader[] = [
  { key: "make", label: "Make" },
  { key: "swd", label: "SWD" },
  { key: "delivered", label: "Delivered" },
  { key: "finalized", label: "Finalized" },
  { key: "total", label: "Total" },
  { key: "swdGross", label: "SWD Gross", isCurrency: true },
  { key: "deliveredGross", label: "Delivered Gross", isCurrency: true },
  { key: "finalizedGross", label: "Finalized Gross", isCurrency: true },
  { key: "totalGross", label: "Total Gross", isCurrency: true },
];

export const GM_TOTAL_OBJECTIVE_HEADERS: IHeader[] = [
  { key: "make", label: "Model/Category" },
  { key: "factory", label: "Factor" },
  { key: "sales", label: "Sales", isCurrency: true },
  { key: "average", label: "Average", isCurrency: true },
  { key: "totalGross", label: "Total Gross", isCurrency: true },
];

const DEAL_HEADERS: IHeader[] = [
  { key: "createdAt", label: "Date Created" },
  { key: "dealDate", label: "Deal Date", checked: false },
  { key: "dealershipDealNo", label: "Deal No #" },
  { key: "dealStatus", label: "Deal Status", filtered: true, status: true },
  {
    key: "salesperson1",
    label: "Salesperson 1",
    filtered: true,
    filterKey: "salesperson",
  },
  { key: "salesperson2", label: "Salesperson 2", filterKey: "salesperson" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "customer", label: "Customer" },
];

const VEHICLE_HEADERS: IHeader[] = [
  { key: "stock", label: "Stock #" },
  { key: "year", label: "Year" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
];

const TRADE_HEADERS: IHeader[] = [
  { key: "tradeYear", label: "Trade Year" },
  { key: "tradeMake", label: "Trade Make" },
  { key: "tradeModel", label: "Trade Model" },
];

//salesmanager
const SALESMANAGER_QUOTE_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  ...VEHICLE_HEADERS,
  ...TRADE_HEADERS,
  { key: "payoff", label: "Payoff" },
  { key: "actions", label: "Actions" },
];

const SALESMANAGER_FINALIZED_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "frontGross", label: "Front Gross" },
  { key: "backGross", label: "Finance Gross" },
  { key: "businessMonth", label: "Business Month" },
  ...VEHICLE_HEADERS,
  ...TRADE_HEADERS,
  { key: "dateFinalized", label: "Date Finanlized" },
  { key: "FinalizedTimeElapsed", label: "TIme Elapsed" },
  { key: "timeInAccounting", label: "Time in Accounting" },
  { key: "actions", label: "Actions" },
];

const SALESMANAGER_SOLD_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "salesType", label: "New / Used" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "relayDealType", label: "Deal Type" },
  { key: "source", label: "Source" },
  { key: "estimatedSalesGross", label: "Sales Gross" },
  { key: "businessMonth", label: "Business Month" },
  { key: "certified", label: "Certified" },
  { key: "tradeAvc", label: "AVC" },
  { key: "miles", label: "Miles" },
  { key: "color", label: "Color" },
  ...TRADE_HEADERS,
  ...VEHICLE_HEADERS,
  { key: "actions", label: "Actions" },
];

const SALESMANAGER_DAILY_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "salesType", label: "New / Used" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "relayDealType", label: "Deal Type" },
  { key: "source", label: "Source" },
  { key: "estimatedSalesGross", label: "Sales Gross" },
  { key: "businessMonth", label: "Business Month" },
  ...VEHICLE_HEADERS,
  { key: "certified", label: "Certified" },
  ...TRADE_HEADERS,
  { key: "tradeAVC", label: "AVC" },
  { key: "miles", label: "Miles" },
  { key: "color", label: "Color" },
  { key: "actions", label: "Actions" },
];

const SALESMANAGER_FINANCE_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "financeManager", label: "Finance Manager" },
  { key: "estimatedFinanceGross", label: "F&I Gross" },
  { key: "estimatedSalesGross", label: "Sales Gross" },
  { key: "missingDoc", label: "Missing Docs" },
  { key: "financeAcceptedAtAge", label: "Age" },
  { key: "actions", label: "Actions" },
];

//salesperson
const DEAL_FINALIZED_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "estimatedFinanceGross", label: "F&I Gross" },
  { key: "estimatedSalesGross", label: "Sales Gross" },
  { key: "lienHolder", label: "Lienholder" },
  { key: "financeCompleteDate", label: "Date Finalized" },
  { key: "timeElapsed", label: "Time Elapsed" },
  { key: "certified", label: "Certified" },
  { key: "salesManager", label: "Sales Manager" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "businessMonth", label: "Business Month" },

  ...VEHICLE_HEADERS,
  ...TRADE_HEADERS,
  { key: "actions", label: "Actions" },
];

const DEAL_FINANCE_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "stock", label: "Stock #" },
  { key: "relayDealType", label: "Deal Type" },
  { key: "lienHolder", label: "Lienholder" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "timeElapsed", label: "Time Elapsed" },
  { key: "missingDoc", label: "Missing Docs" },
  { key: "estimatedSalesGross", label: "EST Finance Gross" },
  { key: "financeAcceptedAtAge", label: "Age" },
  { key: "actions", label: "Actions" },
];

const DEAL_SOLD_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "vehicleStatus", label: "Vehicle Status" },
  ...VEHICLE_HEADERS,
  { key: "estimatedSalesGross", label: "Est Sales Gross" },
  { key: "businessMonth", label: "Business Month" },
  { key: "makeReadyStatus", label: "Make Ready Status" },
  ...TRADE_HEADERS,
  { key: "certified", label: "Certified" },
  { key: "tradeAVC", label: "AVC" },
  { key: "miles", label: "Miles" },
  { key: "color", label: "Color" },
  { key: "source", label: "Source" },
  { key: "salesType", label: "New / Used" },
  { key: "actions", label: "Actions" },
];

//finance Assistant

export const ASSISTANT_FINALIZED_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "stock", label: "Stock #" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "salesType", label: "New / Used" },
  { key: "relayDealType", label: "Relay Deal Type" },
  { key: "estimatedFinanceGross", label: "F&I Gross" },
  { key: "businessMonth", label: "Business Month" },
  { key: "certified", label: "Certified" },
  { key: "actions", label: "Actions" },
];
export const ASSISTANT_ASSIGNED_HEADERS: IHeader[] = [
  ...ASSISTANT_FINALIZED_HEADERS.filter(
    (header) =>
      header.key !== "certified" &&
      header.key !== "estimatedFinanceGross" &&
      header.key !== "actions",
  ),
  { key: "financeAcceptedAtAge", label: "Age" },
  { key: "contractAmount", label: "Contract Amount" },
  { key: "lienHolder", label: "Lienholder" },
  { key: "salesManager", label: "Sales Manager" },
  { key: "actions", label: "Actions" },
];

export const ASSISTANT_RETURNED_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { key: "stock", label: "Stock #" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "financeManager", label: "F&I Manager" },
  { key: "financeAcceptedAtAge", label: "Age" },
  { key: "contractAmount", label: "Contract Amount" },
  { key: "orignalReturnedDate", label: "Ret Date" },
  { key: "returnedBy", label: "Ret By" },
  { key: "payoff", label: "Payoff" },
  { key: "missingDoc", label: "Missing Docs" },
  { key: "actions", label: "Actions" },
];

//Finance Manager sales headers
export const FINANCE_DEAL_HEADERS: IHeader[] = [
  ...DEAL_HEADERS,
  { label: "Contract Status", key: "contractStatus" },
  { label: "Finance Manager", key: "financeManager" },
  { label: "Contract Amount", key: "contractAmount" },
];

export const FINANCE_FINALIZED_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "Sales Type", key: "salesType" },
  { label: "Stock #", key: "stock" },
  { label: "Relay Deal Type", key: "relayDealType" },
  { label: "F&I Gross", key: "estimatedFinanceGross" },
  { label: "Business Month", key: "businessMonth" },
  { label: "Certified", key: "certified" },
  { label: "Finance Income", key: "totalAmountFinanced" },
  { label: "MBI Gross", key: "mbiGross" },
  { label: "Gap Gross", key: "gapIncome" },
  { label: "Wheel & Tire Gross", key: "wheelIncome" },
  { label: "Windshield Gross", key: "windshieldIncome" },
  { label: "Chemicals Gross", key: "chemicalIncome" },
  { label: "PDR Gross", key: "pdrIncome" },
  { label: "Maintenance Gross", key: "maintenanceIncome" },
  { key: "actions", label: "Actions" },
];

export const FINANCE_ASSIGNED_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "Sales Type", key: "salesType" },
  { label: "Sales Manager", key: "salesmanager" },
  { label: "Stock #", key: "stock" },
  { label: "Relay Deal Type", key: "relayDealType" },
  { label: "Business Month", key: "businessMonth" },
  { label: "Lienholder", key: "lienHolder" },
  { label: "Est Fin Gross", key: "estimatedFinanceGross" },
  { label: "Age", key: "financeAcceptedAtAge" },
  { label: "Finance Income", key: "totalAmountFinanced" },
  { label: "MBI Gross", key: "mbiGross" },
  { label: "Gap Gross", key: "gapIncome" },
  { label: "Wheel & Tire Gross", key: "wheelIncome" },
  { label: "Windshield Gross", key: "windshieldIncome" },
  { label: "Chemicals Gross", key: "chemicalIncome" },
  { label: "PDR Gross", key: "pdrIncome" },
  { label: "Maintenance Gross", key: "maintenanceIncome" },
  { label: "Action", key: "actions" },
];

export const FINANCE_RETURNED_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "Ret Date", key: "originalReturnDate" },
  { label: "Ret By", key: "returnedBy" },
  { label: "Stock #", key: "stock" },
  { label: "Payoff", key: "payoff" },
  { label: "Missing Docs", key: "missingDoc" },
  { label: "Age", key: "financeAcceptedAtAge" },
  { key: "actions", label: "Actions" },
];

export const DIRECTOR_ASSIGNED_DEAL_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "Sales Type", key: "salesType" },
  { label: "Sales Manager", key: "salesManager" },
  { label: "Finance Gross", key: "financeGross" },
  { label: "Stock #", key: "stockNumber" },
  { label: "Relay Deal Type", key: "relayDealType" },
  { label: "Business Month", key: "businessMonth" },
  { label: "Lienholder", key: "lienHolder" },
  { label: "Est Fin Gross", key: "estimatedFinanceGross" },
  { label: "Finance Income", key: "totalAmountFinanced" },
  { label: "MBI Gross", key: "mbiGross" },
  { label: "Gap Gross", key: "gapIncome" },
  { label: "Wheel & Tire Gross", key: "wheelIncome" },
  { label: "Windshield Gross", key: "windshieldIncome" },
  { label: "Chemicals Gross", key: "chemicalIncome" },
  { label: "PDR Gross", key: "pdrIncome" },
  { label: "Maintenance Gross", key: "maintenanceIncome" },
  { label: "Age", key: "financeAcceptedAtAge" },
  { key: "actions", label: "Actions" },
];

export const DIRECTOR_RETURNED_DEAL_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "Ret Date", key: "originalReturnDate" },
  { label: "Ret By", key: "returnedBy" },
  { label: "Stock #", key: "stock" },
  { label: "Payoff", key: "payoff" },
  { label: "Missing Docs", key: "missingDoc" },
  { label: "Age", key: "financeAcceptedAtAge" },
  { key: "actions", label: "Actions" },
];

export const DIRECTOR_FINALIZED_DEAL_HEADERS: IHeader[] = [
  ...FINANCE_DEAL_HEADERS,
  { label: "New / Used", key: "salesType" },
  { label: "Stock #", key: "stock" },
  { label: "Relay Deal Type", key: "relayDealType" },
  { label: "F&I Gross", key: "estimatedFinanceGross" },
  { label: "Business Month", key: "businessMonth" },
  { label: "Certified", key: "certified" },
  { label: "Finance Income", key: "totalAmountFinanced" },
  { label: "MBI Gross", key: "mbiGross" },
  { label: "Gap Gross", key: "gapIncome" },
  { label: "Wheel & Tire Gross", key: "wheelIncome" },
  { label: "Windshield Gross", key: "windshieldIncome" },
  { label: "Chemicals Gross", key: "chemicalsIcome" },
  { label: "PDR Gross", key: "pdrIncome" },
  { label: "Maintenance Gross", key: "maintenanceIcome" },
  { key: "actions", label: "Actions" },
];

//GM Sales header

export const GM_DEALS_HEADERS: IHeader[] = [
  ...DEAL_HEADERS.filter((header) => header.key !== "dealStatus"),
  { key: "salesmanager", label: "Sales Manager" },
  { key: "actions", label: "Actions" },
];

export const GM_DAILY_DEAL_HEADERS: IHeader[] = [
  ...GM_DEALS_HEADERS.filter((header) => header.key !== "actions"),
  { key: "dealStatus", label: "Deal Status" },
  { key: "salesType", label: "New / Used" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "relayDealType", label: "Relay Deal Type" },
  { key: "source", label: "Source" },
  { key: "estimatedSalesGross", label: "Est Sales Gross" },
  { key: "businessMonth", label: "Business Month" },
  ...VEHICLE_HEADERS,
  { key: "color", label: "Color" },
  { key: "certified", label: "Certified" },
  ...TRADE_HEADERS.filter((header) => header.key !== "tradeMake"),
  { key: "miles", label: "Miles" },
  { key: "tradeAcv", label: "ACV" },
  { key: "actions", label: "Actions" },
];

export const GM_FINANCE_DEALS_HEADERS: IHeader[] = [
  ...GM_DEALS_HEADERS.filter((header) => header.key !== "actions"),
  { key: "dealStatus", label: "Deal Status" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "estimatedFinanceGross", label: "Est Finance Gross" },
  { key: "estimatedSalesGross", label: "Est Sales Gross" },
  { key: "missingDoc", label: "Missing Docs" },
  { key: "financeAcceptedAtAge", label: "Age" },
  { key: "actions", label: "Actions" },
];

export const GM_SOLD_DEALS_HEADERS: IHeader[] = [
  ...GM_DEALS_HEADERS.filter((header) => header.key !== "actions"),
  { key: "dealStatus", label: "Deal Status" },
  { key: "salesType", label: "New / Used" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "relayDealType", label: "Relay Deal Type" },
  { key: "source", label: "Source" },
  { key: "estimatedSalesGross", label: "Est Sales Gross" },
  { key: "businessMonth", label: "Business Month" },
  ...VEHICLE_HEADERS,
  { key: "color", label: "Color" },
  { key: "certified", label: "Certified" },
  ...TRADE_HEADERS.filter((header) => header.key !== "tradeMake"),
  { key: "miles", label: "Miles" },
  { key: "tradeAcv", label: "ACV" },
  { key: "actions", label: "Actions" },
];

export const GM_FINALIZED_DEALS_HEADERS: IHeader[] = [
  ...GM_DEALS_HEADERS.filter((header) => header.key !== "actions"),
  { key: "frontGross", label: "Front Gross (DMS)" },
  { key: "backGross", label: "Finance Gross (DMS)" },
  { key: "businessMonth", label: "Business Month" },
  ...VEHICLE_HEADERS,
  ...TRADE_HEADERS,
  { key: "dateFinalized", label: "Date Finalized" },
  { key: "timeElapsed", label: "Time Elapsed" },
  { key: "timeInAccounting", label: "Time in Accounting" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "actions", label: "Actions" },
];

export const GM_QUOTE_DEALS_HEADERS: IHeader[] = [
  ...GM_DEALS_HEADERS.filter((header) => header.key !== "actions"),
  ...VEHICLE_HEADERS,
  ...TRADE_HEADERS,
  { key: "payoff", label: "Payoff" },
  { key: "actions", label: "Actions" },
];

//Accountant sales headers
export const ACCOUNTANT_DEALS_HEADERS: IHeader[] = [
  { key: "stock", label: "Stock #" },
  ...DEAL_HEADERS.filter(
    (header) => header.key !== "salesperson1" && header.key !== "salesperson2",
  ),
  { key: "salesType", label: "New / Used" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "actions", label: "Actions" },
];

export const ACCOUNT_SIGNED_FINALIZED_DEALS_HEADERS: IHeader[] = [
  { key: "stock", label: "Stock #" },
  ...DEAL_HEADERS.filter(
    (header) => header.key !== "salesperson1" && header.key !== "salesperson2",
  ),
  { key: "salesType", label: "New / Used" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "businessMonth", label: "Business Month" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "payoff", label: "Payoff" },
  { key: "payoffDate", label: "Payoff Good Thru" },
  { key: "FinalizedTimeElapsed", label: "Age" },
  { key: "contractAmount", label: "Contract Amount" },
  { key: "actions", label: "Actions" },
];

export const ACCOUNTANT_RETURNED_DEALS_HEADERS: IHeader[] = [
  { key: "stock", label: "Stock #" },
  ...DEAL_HEADERS.filter(
    (header) => header.key !== "salesperson1" && header.key !== "salesperson2",
  ),
  { key: "salesType", label: "New / Used" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "salesmanager", label: "Sales Manager" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "payoff", label: "Payoff" },
  { key: "payoffDate", label: "Payoff Good Thru" },
  { key: "FinalizedTimeElapsed", label: "Age" },
  { key: "businessMonth", label: "Business Month" },
  { key: "actions", label: "Actions" },
];

export const ACCOUNTANT_PAYOFF_DEALS_HEADERS: IHeader[] = [
  { key: "stock", label: "Stock #" },
  ...DEAL_HEADERS.filter(
    (header) => header.key !== "salesperson1" && header.key !== "salesperson2",
  ),
  { key: "salesType", label: "New / Used" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "businessMonth", label: "Business Month" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "payoff", label: "Payoff" },
  { key: "payoffDate", label: "Payoff Good Thru" },
  { key: "FinalizedTimeElapsed", label: "Age" },
  { key: "actions", label: "Actions" },
];

const FINANCE_PRODUCTION_HEADERS: IHeader[] = [
  { key: "Variable", label: " " },
  { key: "Cash", label: "Cash" },
  { key: "OSF", label: "OSF" },
  { key: "Finance", label: "Finance" },
  { key: "Lease", label: "Lease" },
  { key: "Total", label: "Total" },
  {
    key: "businessMonth",
    label: "Business Month",
    status: true,
    filtered: true,
    hidden: true,
  },
  {
    key: "startDate",
    label: "Start Date",
    status: true,
    filtered: true,
    hidden: true,
  },
  {
    key: "endDate",
    label: "End Date",
    status: true,
    filtered: true,
    hidden: true,
  },
];

const MAKE_READY_ALL_DATA_HEADERS: IHeader[] = [
  { key: "checkbox", label: "Checkbox" },
  { key: "dealDate", label: "Deal Date", checked: false },
  { key: "stock", label: "Stock" },
  { key: "dealStatus", label: "Deal Status" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "color", label: "Color" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "status", label: "MR Status", filtered: true, status: true },
  { key: "deliveryDate", label: "MR Date/Time" },
  { key: "dateNeeded", label: "REQ Date/Time" },
  { key: "salesperson1", label: "Salesperson 1" },
  { key: "salesperson2", label: "Salesperson 2" },
  { key: "assignedTo", label: "MR Name" },
  { key: "customerName", label: "Customer" },
  { key: "actions", label: "Actions" },
];

const MAKE_READY_HEADERS: IHeader[] = [
  { key: "checkbox", label: "Checkbox" },
  { key: "dealDate", label: "Deal Date", checked: false },
  { key: "stock", label: "Stock" },
  { key: "dealType", label: "Deal Type" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "color", label: "Color" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "deliveryDate", label: "MR Date/Time" },
  { key: "dateNeeded", label: "REQ Date/Time" },
  { key: "salesperson1", label: "S1" },
  { key: "salesperson2", label: "S2" },
  { key: "customerName", label: "Customer" },
  { key: "actions", label: "Actions" },
];

export const DEAL_DOCUMENT_HEADERS: IHeader[] = [
  { key: "docTypeName", label: "Item" },
  { key: "request", label: "Request" },
  { key: "uploadDatetime", label: "Req Date" },
  { key: "received", label: "Received" },
  { key: "receivedDateTime", label: "Rec Date" },
  { key: "action", label: "Action" },
];

const NEW_OBJECTIVES_HEADERS: IHeader[] = [
  {
    key: "salespersonName",
    label: "Salesperson",
    filtered: true,
    filterKey: "salesperson",
  },
  { key: "AssignedObjective", label: "Assigned New Objective", editable: true },
  { key: "SuggestedObjective", label: "Suggested New Objective" },
  { key: "PrevMonthSales", label: "Prev Month New Sales" },
  { key: "PrevMonthSalesObjective", label: "Prev Month New Objective" },
  {
    key: "PrevMonthPercentageOfObjectives",
    label: "Prev Month % of New Objective",
  },
  { key: "SalesPercentage", label: "% of New Sales" },
];

const USED_OBJECTIVES_HEADERS: IHeader[] = [
  {
    key: "salespersonName",
    label: "Salesperson",
    filtered: true,
    filterKey: "salesperson",
  },
  {
    key: "AssignedObjective",
    label: "Assigned Used Objective",
    editable: true,
  },
  { key: "SuggestedObjective", label: "Suggested Used Objective" },
  { key: "PrevMonthSales", label: "Prev Month Used Sales" },
  { key: "PrevMonthSalesObjective", label: "Prev Month Used Objective" },
  {
    key: "PrevMonthPercentageOfObjectives",
    label: "Prev Month % of Used Objective",
  },
  { key: "SalesPercentage", label: "% of Used Sales" },
];

const TOTAL_OBJECTIVES_HEADERS: IHeader[] = [
  {
    key: "salespersonName",
    label: "Salesperson",
    filtered: true,
    filterKey: "salesperson",
  },
  {
    key: "AssignedObjective",
    label: "Assigned Total Objectives",
    editable: true,
  },
  { key: "SuggestedObjective", label: "Suggested Total Objectives" },
  { key: "PrevMonthSales", label: "Prev Month Total Sales" },
  { key: "PrevMonthSalesObjective", label: "Prev Month Total Objectives" },
  {
    key: "PrevMonthPercentageOfObjectives",
    label: "Prev Month % of Total Objectives",
  },
  { key: "SalesPercentage", label: "% of Total Sales" },
];

const GM_NEW_OBJECTIVES_HEADERS: IHeader[] = [
  { key: "carline", label: "Carline", filtered: true, filterKey: "make" },
  { key: "internalObjective", label: "Internal Objective", editable: true },
  { key: "factoryObjective", label: "Factory Objective", editable: true },
  { key: "avgGross", label: "Avg Gross", editable: true, isCurrency: true },
  { key: "totalGross", label: "Internal Objective Gross", isCurrency: true },
  { key: "factoryGross", label: "Factory Objective Gross", isCurrency: true },
  { key: "prevMonthSales", label: "Prev Month Sales" },
  { key: "prevMonthObjectives", label: "Prev Month Objective" },
];

const GM_USED_OBJECTIVES_HEADERS: IHeader[] = [
  { key: "carline", label: "Carline" },
  { key: "internalObjective", label: "Objective", editable: true },
  { key: "avgGross", label: "Avg Gross", editable: true, isCurrency: true },
  { key: "totalGross", label: "Total Gross", isCurrency: true },
  { key: "DelGross", label: "Prev Month Sales" },
  { key: "prevMonthObjectives", label: "Prev Month Objective" },
];

const GM_FINANCE_OBJECTIVE_HEADERS: IHeader[] = [
  { key: "Department", label: "Department" },
  { key: "units", label: "Units" },
  { key: "PRU", label: "PRU", editable: true, isCurrency: true },
  { key: "totalIncome", label: "Total Income", isCurrency: true },
];

const NOTIFICATIONS_HEADER: IHeader[] = [
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "from", label: "From" },
  { key: "entityId", label: "Entity ID" },
  { key: "notificationType", label: "Action" },
  { key: "message", label: "Message" },
  { key: "actions", label: "Action" },
];

const SALESPERSON_OBJECTIVE_HEADER: IHeader[] = [
  { key: "FullName", label: "Salesperson" },
  {
    key: "EmployeeStatus",
    label: "Status",
    status: true,
    filtered: true,
    filterKey: "empStatus",
  },
  { key: "SoldSales", label: "Sold" },
  { key: "objective", label: "Obj %" },
  { key: "DeliveredUnits", label: "Del. Unit" },
  { key: "DeliveredGross", label: "Del Gross" },
  { key: "AvgGross", label: "AVG Gross" },
  { key: "SWD", label: "SWD " },
  { key: "SWDTotalGross", label: "SWD Gross" },
  { key: "SWDAvgGross", label: "SWD AVG" },
  { key: "ExpectedGross", label: "Exp Gross" },
  { key: "ExpAvgGross", label: "Exp AVG" },
];

const SALESPERSON_HEADER: IHeader[] = [
  { key: "name", label: "Sales Person" },
  {
    key: "status",
    label: "Status",
    status: true,
    filtered: true,
    filterKey: "empStatus",
  },
  { key: "statusTime", label: "Status Change Time" },
  { key: "updatedAt", label: "Time Elapsed" },
  { key: "phone", label: "Cell Phone" },
  { key: "RoleType", label: "Role Type" },
];

const MANAGERS_PRODUCTION_HEADER: IHeader[] = [
  { key: "FullName", label: "Salesperson" },
  {
    key: "EmployeeStatus",
    label: "Status",
    status: true,
    filtered: true,
    filterKey: "empStatus",
  },
  { key: "SoldSales", label: "Sold" },
  { key: "DeliveredUnits", label: "Del. Unit" },
  { key: "DeliveredGross", label: "Del Gross" },
  { key: "AvgGross", label: "AVG Gross" },
  { key: "SWD", label: "SWD " },
  { key: "SWDTotalGross", label: "SWD Gross" },
  { key: "SWDAvgGross", label: "SWD AVG" },
  { key: "ExpectedGross", label: "Exp Gross" },
  { key: "ExpAvgGross", label: "Exp AVG" },
];

const FINANCEQUEUE_HEADER: IHeader[] = [
  { key: "CreatedAt", label: "TimeElapsed" },
  { key: "relayDealId", label: "Deal#" },
  { key: "customerName", label: "Customer" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "priority", label: "Priority" },
  { key: "fiManager", label: "Assigned F&I Manager" },
  { key: "salesperson01", label: "S1" },
  { key: "salesperson02", label: "S2 " },
  { key: "comments", label: "Comment" },
  { key: "actions", label: "Actions" },
];

const PLATES_HEADER: IHeader[] = [
  { key: "dealDate", label: "Deal Date" },
  { key: "stock", label: "Stock" },
  { key: "dealNo", label: "Deal #" },
  { key: "dealStatus", label: "Deal Status" },
  { key: "customerName", label: "Customer" },
  { key: "salesType", label: "New/Used" },
  { key: "financeManager", label: "Finance Manager" },
  {
    key: "salesperson01",
    label: "SLSP1",
    filtered: true,
    filterKey: "salesperson",
  },
  { key: "salesperson02", label: "SLSP2", filterKey: "salesperson" },
  { key: "plateNumber", label: "Plate Number" },
  { key: "homePhone", label: "Home Number" },
  { key: "phone", label: "Cell Number" },
  { key: "email", label: "Email" },
  { key: "age", label: "Age" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "year", label: "Year" },
  { key: "plateStatus", label: "Plate Status", status: true },
  { key: "filteredComments", label: "Comments" },
  { key: "actions", label: "Action" },
];

export const SALES_BOARD_MAX_COLS = 20;

const SALESBOARD_HEADER: IHeader[] = [
  { key: "salesperson", label: "Salesperson" },
  { key: "total", label: "Total" },
  ...Array.from({ length: SALES_BOARD_MAX_COLS }, (_, i) => {
    const num = (i + 1).toString();
    return { key: num, label: num };
  }),
];

const CUSTOMER_LOG_HEADERS: IHeader[] = [
  { key: "id", label: "ID Verf #" },
  { key: "createdAt", label: "Date Logged" },
  { key: "customerName", label: "Customer Name" },
  {
    key: "visitStatus",
    label: "Customer Status",
    status: true,
    filtered: true,
  },
  { key: "waitTime", label: "Wait Time" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone Number" },
  {
    key: "assignedSalespersonName",
    label: "Assigned Salesperson",
    filtered: true,
    filterKey: "salesperson",
  },
  { key: "vehicleInterest", label: "Interested Model" },
];

const REC_CUSTOMER_LOG_HEADERS: IHeader[] = [
  ...CUSTOMER_LOG_HEADERS,
  { key: "requestedSalesperson", label: "Requested Salesperson" },
  { key: "source", label: "Source" },
  { key: "email", label: "Email" },
  { key: "customerId", label: "ID Scan" },
  { key: "comments", label: "Comment Added" },
];

const MANAGERS_OVERVIEW_HEADERS: IHeader[] = [
  { key: "name", label: "Manager" },
  {
    key: "status",
    label: "Status",
    status: true,
    filtered: true,
    filterKey: "empStatus",
  },
  { key: "statusTime", label: "Status Change Time" },
  { key: "updatedAt", label: "Time Elapsed" },
  { key: "phone", label: "Cell Phone" },
];

const NEW_PRODUCTION_HEADERS: IHeader[] = [
  { key: "checkbox", label: "Checkbox" },
  { key: "Make", label: "Make" },
  { key: "Swd", label: "SWD" },
  { key: "Del", label: "Delivered" },
  { key: "Finalized", label: "Finalized" },
  { key: "Total", label: "Total" },
  { key: "SwdGross", label: "SWD Gross", isCurrency: true },
  { key: "DelGross", label: "Delivered Gross", isCurrency: true },
  { key: "FinalizedGross", label: "Finalized Gross", isCurrency: true },
  { key: "TotalGross", label: "Total Gross", isCurrency: true },
];

const USED_PRODUCTION_HEADERS: IHeader[] = [
  { key: "checkbox", label: "Checkbox" },
  { key: "Make", label: "Make" },
  { key: "Swd", label: "SWD" },
  { key: "Del", label: "Delivered" },
  { key: "Finalized", label: "Finalized" },
  { key: "Total", label: "Total" },
  { key: "SwdGross", label: "SWD Gross", isCurrency: true },
  { key: "DelGross", label: "Delivered Gross", isCurrency: true },
  { key: "FinalizedGross", label: "Finalized Gross", isCurrency: true },
  { key: "TotalGross", label: "Total Gross", isCurrency: true },
];

const SIGNED_DEAL_HEADERS: IHeader[] = [
  { key: "createdAt", label: "Date Created" },
  { key: "dealDate", label: "Deal Date", checked: false },
  { key: "salesType", label: "New/Used" },
  { key: "stock", label: "Stock #" },
  { key: "dealershipDealNo", label: "Deal #" },
  { key: "customer", label: "Customer" },
  { key: "dealStatus", label: "Deal Status", status: true },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "financeManager", label: "F&I Manager" },
];

const ACCOUNTANT_FINALIZED_DEAL_HEADERS: IHeader[] = [
  { key: "createdAt", label: "Date Created" },
  { key: "dealDate", label: "Deal Date", checked: false },
  { key: "stock", label: "Stock #" },
  { key: "dealershipDealNo", label: "Deal #" },
  { key: "customer", label: "Customer" },
  { key: "dealStatus", label: "Deal Status", status: true },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "financeSource", label: "Finance Source" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "FinalizedTimeElapsed", label: "Age" },
  { key: "estimatedFinanceGross", label: "Finance Gross" },
  { key: "actions", label: "Action" },
];

const CIT_HEADER: IHeader[] = [
  { key: "financeType", label: "Finance Type" },
  { key: "customerName", label: "Customer Name" },
  { key: "vin", label: "VIN" },
  { key: "makeName", label: "Make" },
  { key: "modelName", label: "Model" },
  { key: "modelYear", label: "Year" },
  { key: "saleClass", label: "New / Used" },
  { key: "vehicleStock", label: "Stock #" },
  { key: "financedAmount", label: "Amount Financed" },
  { key: "financedTermQuantity", label: "Term" },
  { key: "totalMonthlyPaymentAmount", label: "Payment" },
  { key: "conditionRejection", label: "Rejection Condition" }, // []
  { key: "creditContractPersonPhone", label: "Analyst Phone" },
  { key: "creditAnalystInitials", label: "Analyst Name" },
  { key: "creditAnalystComments", label: "Analyst Comment" },
  { key: "stipulations", label: "Stipulations" }, // []
  { key: "reserveParticipation", label: "Participation" },
  { key: "reserveFlat", label: "Flat" },
  { key: "financeCompanyName", label: "Lientholder" },
  { key: "fundingStatus", label: "Funding Status", status: true },
  { key: "funderComments", label: "Funding Comments" }, // []
  { key: "applicationStatus", label: "Application Status" },
  { key: "dealDate", label: "Contract Date" },
  { key: "age", label: "Age" },
  { key: "contractFundedDate", label: "Funding Date" },
  { key: "financeManager", label: "Finance Manager" },
  { key: "actions", label: "Action" },
];

const DEALERSHIP_HEADERS: IHeader[] = [
  { key: "dealershipName", label: "Dealership Name" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "companyName", label: "Company" },
  { key: "addressStreet1", label: "Address" },
  { key: "csv", label: "CSV", hidden: true },
  { key: "actions", label: "Action" },
];

const Notifications = {
  tabs: [
    {
      key: "unread-notifications",
      label: "Unread",
      api: "/notifications",
      headers: NOTIFICATIONS_HEADER,
      color: colors.cerulean["500"],
      rowColor: colors.cerulean["50"],
    },
    {
      key: "read-notifications",
      label: "Read",
      api: "/notifications",
      headers: NOTIFICATIONS_HEADER,
      color: colors.cerulean["500"],
      rowColor: colors.cerulean["50"],
    },
  ],
};

export const tableConfig: ITableConfig = {
  SalesManager: {
    Sales: {
      tabs: [
        {
          key: "daily",
          label: "Daily Sales",
          api: "/deal/daily",
          dealStatus: DEAL_STATUSES,
          headers: SALESMANAGER_DAILY_DEAL_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "finance",
          label: "Deals In Finance",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: SALESMANAGER_FINANCE_DEAL_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "sold-await-delivery",
          label: "Deals Sold / Waiting Delivery",
          api: "/deal/not-delivered",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: SALESMANAGER_SOLD_DEAL_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          dealStatus: FINALIZED_DEAL_STATUSES,
          headers: SALESMANAGER_FINALIZED_DEAL_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
        {
          key: "all-deals",
          label: "All Deals",
          api: "/deal/",
          dealStatus: DEAL_STATUSES.filter((d) => d !== "Quote"),
          headers: SALESMANAGER_DAILY_DEAL_HEADERS,
          color: colors.oldlace["600"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "quote-deals",
          label: "Quote Deals",
          api: "/deal/quote",
          alignment: "right",
          dealStatus: [],
          headers: SALESMANAGER_QUOTE_DEAL_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
      ],
    },
    "Make Ready": {
      tabs: [
        {
          key: "make-ready",
          label: "Make Ready",
          api: "/make-ready",
          dealStatus: DEAL_STATUSES,
          headers: MAKE_READY_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
      ],
    },
    Objectives: {
      tabs: [
        {
          key: "newObjectives",
          label: "New",
          api: "/objective/main/new",
          headers: NEW_OBJECTIVES_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "usedObjectives",
          label: "Used",
          api: "/objective/main/used",
          headers: USED_OBJECTIVES_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "totalObjectives",
          label: "Total",
          api: "/objective/main/All",
          headers: TOTAL_OBJECTIVES_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    Production: {
      tabs: [
        {
          key: "newProduction",
          label: "New",
          api: "",
          headers: NEW_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "usedProduction",
          label: "Used",
          api: "",
          headers: USED_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "Total",
          label: "Total",
          api: "",
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    Notifications,
    "Sales Board": {
      tabs: [
        {
          key: "sales-board",
          label: "Sales Board",
          api: "/deal/sales-board",
          headers: SALESBOARD_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    SalesPerson: {
      tabs: [
        {
          key: "salesperons",
          label: "SalesPerson",
          api: "/objective/salespeople-with-objective",
          headers: SALESPERSON_OBJECTIVE_HEADER,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
          searchPlaceholder: "Search by salesperson",
        },
      ],
    },
    "Finance Queue": {
      tabs: [
        {
          key: "financequeue",
          label: "FinanceQueue",
          api: "/finance/getFinanceQueue",
          headers: FINANCEQUEUE_HEADER,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
      ],
    },
  },
  Receptionist: {
    "Customer Log": {
      tabs: [
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: REC_CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by Deal#, Salesperson, Customer Name",
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: REC_CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "previousDay",
          label: "Previous Day",
          api: "/customer-visit?filter=previousDay",
          visitStatus: VISIT_STATUS,
          headers: REC_CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "all",
          label: "All",
          api: "/customer-visit?filter=all",
          visitStatus: VISIT_STATUS,
          headers: REC_CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    Notifications,
    Plates: {
      tabs: [
        {
          key: "plates",
          label: "Processing",
          api: "/plates?plateStatus=Processing",
          headers: PLATES_HEADER,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "plates",
          label: "Received",
          api: "/plates?plateStatus=Notified",
          headers: PLATES_HEADER,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "plates",
          label: "Delivered",
          api: "/plates?plateStatus=Picked",
          headers: PLATES_HEADER,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
      ],
    },
    SalesPerson: {
      tabs: [
        {
          key: "All",
          label: "All",
          api: "/employee/get-salespersons-by-type",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by salesperson",
          empStatus: ALL_SALESPERSON_STATUS,
        },
        {
          key: "Available",
          label: "Available",
          api: "/employee/get-salespersons-by-type?salespersonStatus=AVAILABLE",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by salesperson",
          empStatus: AVAILABLE_STATUS,
        },
        {
          key: "With Customer",
          label: "With Customer",
          api: "/employee/get-salespersons-by-type?salespersonStatus=WITH+CUSTOMER",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by salesperson",
          empStatus: WITH_CUSTOMER_STATUS,
        },
        {
          key: "Temporarily Unavailable",
          label: "Temporarily Unavailable",
          api: "/employee/get-salespersons-by-type?salespersonStatus=TEMPORARILY+UNAVAILABLE",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by salesperson",
          empStatus: TEMPORARILY_UNAVAILABLE_STATUS,
        },
        {
          key: "Not Working Today",
          label: "Not Working Today",
          api: "/employee/get-salespersons-by-type?salespersonStatus=NOT+WORKING+TODAY",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by salesperson",
          empStatus: NOT_WORKING_TODAY_STATUS,
        },
      ],
    },
    "Managers Overview": {
      tabs: [
        {
          key: "sales-manager",
          label: "Sales Managers",
          api: `/employee/managers-overview/SalesManager`,
          headers: MANAGERS_OVERVIEW_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
        {
          key: "finance-manager",
          label: "Finance Managers",
          api: "/employee/managers-overview/FinanceManager",
          headers: MANAGERS_OVERVIEW_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
      ],
    },
  },
  FinanceManager: {
    Notifications,
    Sales: {
      tabs: [
        {
          key: "assigned-waiting",
          label: "Deals Assigned/Waiting",
          api: "/FIManager/assigned-working",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: FINANCE_ASSIGNED_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "accounting-returned",
          label: "Deals Returned",
          api: "/FIManager/accounting-returned",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: FINANCE_RETURNED_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finance-finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: FINANCE_FINALIZED_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "finance",
          label: "Finance Logs",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_FINALIZED_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    FinanceProduction: {
      tabs: [
        {
          key: "soldProcessed",
          label: "Sold/Processed",
          api: "/FIManager/assigned-working",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "penetration",
          label: "Penetration",
          api: "/FIManager/assigned-working",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "income",
          label: "Income",
          api: "/FIManager/assigned-working",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerProduct",
          label: "Income/Product",
          api: "/FIManager/assigned-working",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerUnit",
          label: "Income/Unit",
          api: "/FIManager/assigned-working",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    CIT: {
      tabs: [
        {
          key: "sales-board",
          label: "CIT",
          api: "/deal/cit-logs",
          headers: CIT_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by VIN",
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
  },
  FinanceDirector: {
    Notifications,
    Sales: {
      tabs: [
        {
          key: "assigned-waiting",
          label: "Deals Assigned/Waiting",
          api: "/FIManager/assigned-working",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: DIRECTOR_ASSIGNED_DEAL_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "accounting-returned",
          label: "Deals Returned",
          api: "/FIManager/accounting-returned",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: DIRECTOR_RETURNED_DEAL_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finance-finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: DIRECTOR_FINALIZED_DEAL_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "finance",
          label: "Finance Logs",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: DIRECTOR_FINALIZED_DEAL_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    FinanceProduction: {
      tabs: [
        {
          key: "soldProcessed",
          label: "Sold/Processed",
          api: "",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "penetration",
          label: "Penetration",
          api: "",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "income",
          label: "Income",
          api: "",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerProduct",
          label: "Income/Product",
          api: "",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerUnit",
          label: "Income/Unit",
          api: "",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Managers Overview": {
      tabs: [
        {
          key: "finance-manager",
          label: "Finance Managers",
          api: "/employee/managers-overview/FinanceManager",
          headers: MANAGERS_OVERVIEW_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
      ],
    },
    CIT: {
      tabs: [
        {
          key: "sales-board",
          label: "CIT",
          api: "/deal/cit-logs",
          headers: CIT_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by VIN",
        },
      ],
    },
  },

  FinanceAssistant: {
    Notifications,
    Sales: {
      tabs: [
        {
          key: "assigned-waiting",
          label: "Deals Assigned/Waiting",
          api: "/FIManager/assigned-working",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: ASSISTANT_ASSIGNED_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "accounting-returned",
          label: "Deals Returned",
          api: "/FIManager/accounting-returned",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: ASSISTANT_RETURNED_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finance-finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: ASSISTANT_FINALIZED_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "finance",
          label: "Finance Logs",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: ASSISTANT_FINALIZED_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    FinanceProduction: {
      tabs: [
        {
          key: "soldProcessed",
          label: "Sold/Processed",
          api: "/FIManager/assigned-working",
          dealStatus: ASSIGNED_WORKING_FINANCE_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "penetration",
          label: "Penetration",
          api: "/FIManager/assigned-working",
          dealStatus: ACCOUNTING_RETURNED_STATUS,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "income",
          label: "Income",
          api: "/FIManager/assigned-working",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerProduct",
          label: "Income/Product",
          api: "/FIManager/assigned-working",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "incomePerUnit",
          label: "Income/Unit",
          api: "/FIManager/assigned-working",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Managers Overview": {
      tabs: [
        {
          key: "finance-manager",
          label: "Finance Managers",
          api: "/employee/managers-overview/FinanceManager",
          headers: MANAGERS_OVERVIEW_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
      ],
    },
    CIT: {
      tabs: [
        {
          key: "sales-board",
          label: "CIT",
          api: "/deal/cit-logs",
          headers: CIT_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by VIN",
        },
      ],
    },
  },
  SalesPerson: {
    Sales: {
      tabs: [
        {
          key: "sold-await-delivery",
          label: "Deals Sold / Waiting Delivery",
          api: "/deal/not-delivered",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: DEAL_SOLD_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finance",
          label: "Deals In Finance",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: DEAL_FINANCE_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          dealStatus: FINALIZED_DEAL_STATUSES,
          headers: DEAL_FINALIZED_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
        {
          key: "all-deals",
          label: "All Deals",
          api: "/deal/",
          dealStatus: DEAL_STATUSES.filter((d) => d !== "Quote"),
          headers: DEAL_SOLD_HEADERS,
          color: colors.oldlace["600"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "quote-deals",
          label: "Quote Deals",
          api: "/deal/quote",
          alignment: "right",
          dealStatus: [],
          headers: SALESMANAGER_QUOTE_DEAL_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
      ],
    },
    "Make Ready": {
      tabs: [
        {
          key: "make-ready",
          label: "Make Ready",
          api: "/make-ready",
          dealStatus: DEAL_STATUSES,
          headers: MAKE_READY_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
      ],
    },

    Production: {
      tabs: [
        {
          key: "newProduction",
          label: "New",
          api: "",
          headers: NEW_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "usedProduction",
          label: "Used",
          api: "",
          headers: USED_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "Total",
          label: "Total",
          api: "",
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Sales Board": {
      tabs: [
        {
          key: "sales-board",
          label: "Sales Board",
          api: "/deal/sales-board",
          headers: SALESBOARD_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    Plates: {
      tabs: [
        {
          key: "plates",
          label: "Plates",
          api: "/plates",
          headers: PLATES_HEADER,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
          searchPlaceholder: "Search by Salesperson",
        },
      ],
    },
    Notifications,
  },
  Accountant: {
    Sales: {
      tabs: [
        {
          key: "finance-complete",
          label: "Deals To Be Finalized",
          api: "/deal/tab/finance-complete",
          headers: ACCOUNT_SIGNED_FINALIZED_DEALS_HEADERS,
          dealStatus: TO_BE_FINALIZED_STATUSES,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "returned",
          label: "Deals Returned",
          api: "/deal/tab/returned-in-accounting",
          dealStatus: RETURNED_IN_ACCOUNTING_STATUS,
          headers: ACCOUNTANT_RETURNED_DEALS_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "payoff",
          label: "Deals With Payoffs",
          api: "/deal/tab/payoff",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: ACCOUNTANT_PAYOFF_DEALS_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          headers: ACCOUNTANT_FINALIZED_DEAL_HEADERS,
          dealStatus: FINALIZED_DEAL_STATUSES,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "all-deals",
          label: "All Deals",
          api: "/deal/tab/past-customer-signed",
          dealStatus: PAST_CUSTOMER_SIGNED,
          headers: ACCOUNT_SIGNED_FINALIZED_DEALS_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
      ],
    },
    Notifications,
    Plates: {
      tabs: [
        {
          key: "plates-processing",
          label: "Plates/Registration In Processing",
          api: "/plates?plateStatus=Processing",
          headers: PLATES_HEADER,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "plates-received",
          label: "Plates/Registration Received",
          api: "/plates?plateStatus=Received",
          headers: PLATES_HEADER,
          color: colors.screamin["500"],
          rowColor: colors.screamin["50"],
        },
      ],
    },
  },
  MakeReady: {
    "Make Ready": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/make-ready?mrStatus=all",
          mrStatus: MAKE_READY_STATUS,
          headers: MAKE_READY_ALL_DATA_HEADERS,
          color: colors.oldlace["600"],
          rowColor: colors.oldlace["50"],
          searchPlaceholder: "Search by Deal# or Make",
        },
        {
          key: "vehicles-in-process",
          label: "Vehicles in Process",
          api: "/make-ready?mrStatus=InProcess",
          mrStatus: MAKE_READY_STATUS,
          headers: MAKE_READY_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
          searchPlaceholder: "Search by Deal# or Make",
        },
        {
          key: "vehicles-held",
          label: "Vehicles Held",
          api: "/make-ready?mrStatus=Hold",
          mrStatus: MAKE_READY_STATUS,
          headers: MAKE_READY_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by Deal# or Make",
        },
        {
          key: "completed-today",
          label: "Completed Today",
          api: "/make-ready?mrStatus=CompletedToday",
          mrStatus: MAKE_READY_STATUS,
          headers: MAKE_READY_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
          searchPlaceholder: "Search by Deal# or Make",
        },
        {
          key: "month-to-date-vehicles",
          label: "MTD Vehicles",
          api: "/make-ready?mrStatus=MTD",
          mrStatus: DEAL_STATUSES,
          headers: MAKE_READY_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by Deal# or Make",
        },
      ],
    },
    Assigned: {
      tabs: [
        {
          key: "vehicles-assigned",
          label: "Assigned",
          api: "/make-ready?mrStatus=MakeReadyAssigned",
          dealStatus: DEAL_STATUSES,
          headers: MAKE_READY_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
      ],
    },
    Notifications,
  },
  GeneralManager: {
    Sales: {
      tabs: [
        {
          key: "daily",
          label: "Daily Sales",
          api: "/deal/daily",
          dealStatus: DEAL_STATUSES,
          headers: GM_DAILY_DEAL_HEADERS,
          color: colors.oldlace["500"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "finance",
          label: "Deals In Finance",
          api: "/deal/finance",
          dealStatus: FINANCE_DEAL_STATUSES,
          headers: GM_FINANCE_DEALS_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "sold-await-delivery",
          label: "Deals Sold / Waiting Delivery",
          api: "/deal/not-delivered",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: GM_SOLD_DEALS_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
        {
          key: "finalized",
          label: "Deals Finalized",
          api: "/deal/finalized",
          headers: GM_FINALIZED_DEALS_HEADERS,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
        },
        {
          key: "all-deals",
          label: "All Deals",
          api: "/deal/",
          dealStatus: DEAL_STATUSES.filter((d) => d !== "Quote"),
          headers: GM_DAILY_DEAL_HEADERS,
          color: colors.oldlace["600"],
          rowColor: colors.oldlace["50"],
        },
        {
          key: "quote-deals",
          label: "Quote Deals",
          api: "/deal/quote",
          alignment: "right",
          dealStatus: [],
          headers: GM_QUOTE_DEALS_HEADERS,
          color: colors.cinnabar["600"],
          rowColor: colors.cinnabar["50"],
        },
      ],
    },
    Objectives: {
      tabs: [
        {
          key: "newObjectives",
          label: "New",
          api: "/objective/gm-objectives?salesType=New",
          headers: GM_NEW_OBJECTIVES_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "usedObjectives",
          label: "Used",
          api: "/objective/gm-objectives?salesType=Used",
          headers: GM_USED_OBJECTIVES_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "financeObjectives",
          label: "Finance",
          api: "/objective/get-finance-objectives",
          headers: GM_FINANCE_OBJECTIVE_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "total",
          label: "Total",
          api: "/objective/get-total-gm-objectives",
          headers: GM_TOTAL_OBJECTIVE_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    Production: {
      tabs: [
        {
          key: "newProduction",
          label: "New",
          api: "",
          headers: NEW_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "usedProduction",
          label: "Used",
          api: "",
          headers: USED_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "Total",
          label: "Total",
          api: "",
          headers: FINANCE_PRODUCTION_HEADERS,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Sales Board": {
      tabs: [
        {
          key: "sales-board",
          label: "Sales Board",
          api: "/deal/sales-board",
          headers: SALESBOARD_HEADER,
          color: colors.cerulean["500"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Customer Log": {
      tabs: [
        {
          key: "all",
          label: "All",
          api: "/customer-visit",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "dailyWalkIn",
          label: "Daily Walk-in/Phone Calls",
          api: "/customer-visit?filter=dailyWalkIn",
          visitStatus: VISIT_STATUS,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
        {
          key: "customerWaiting",
          label: "Customer Waiting",
          api: "/customer-visit?filter=customerWaiting",
          visitStatus: VISIT_STATUS_WAITING,
          headers: CUSTOMER_LOG_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
        },
      ],
    },
    "Managers Overview": {
      tabs: [
        {
          key: "sales-person",
          label: "Sales Persons",
          api: "/employee/get-salespersons-by-type",
          headers: SALESPERSON_HEADER,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
        {
          key: "sales-manager",
          label: "Sales Managers",
          api: "/production/managers?role=SalesManager",
          headers: MANAGERS_PRODUCTION_HEADER,
          color: colors.oldlace["600"],
          rowColor: colors.oldlace["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
        {
          key: "finance-manager",
          label: "Finance Managers",
          api: "/production/managers?role=FinanceManager",
          headers: MANAGERS_PRODUCTION_HEADER,
          color: colors.screamin["600"],
          rowColor: colors.screamin["50"],
          searchPlaceholder: "Search by name, cell phone",
        },
      ],
    },
  },
  Admin: {
    Dealerships: {
      tabs: [
        {
          key: "dealerships",
          label: "Dealerships",
          api: "",
          dealStatus: DEALS_SOLD_STATUSES,
          headers: DEALERSHIP_HEADERS,
          color: colors.cerulean["600"],
          rowColor: colors.cerulean["50"],
          searchPlaceholder: "Search by Dealership Name",
        },
      ],
    },
  },
};

export const getEditTableRowModalConfig = () => {
  const { user } = useAuthStore.getState();
  const role = user?.role;

  return {
    [ROUTES.INVOICES]: {
      title: "Accountant Ticket",
      Component: AccountantDealEdit,
    },
  };
};

export const getConstantNameByHeaders = (
  headers: IHeader[],
): string | undefined => {
  const headerConstants = [
    { name: "NOTIFICATIONS_HEADER", headers: NOTIFICATIONS_HEADER },
    { name: "CUSTOMER_LOG_HEADERS", headers: CUSTOMER_LOG_HEADERS },
    { name: "MANAGERS_OVERVIEW_HEADERS", headers: MANAGERS_OVERVIEW_HEADERS },
    { name: "CIT_HEADER", headers: CIT_HEADER },
    { name: "FINANCE_PRODUCTION_HEADERS", headers: FINANCE_PRODUCTION_HEADERS },
    { name: "DEAL_HEADERS", headers: DEAL_HEADERS },

    //sales manager sales
    {
      name: "SALESMANAGER_DAILY_DEAL_HEADERS",
      headers: SALESMANAGER_DAILY_DEAL_HEADERS,
    },
    {
      name: "SALESMANAGER_FINANCE_DEAL_HEADERS",
      headers: SALESMANAGER_FINANCE_DEAL_HEADERS,
    },
    {
      name: "SALESMANAGER_SOLD_DEAL_HEADERS",
      headers: SALESMANAGER_SOLD_DEAL_HEADERS,
    },
    {
      name: "SALESMANAGER_FINALIZED_DEAL_HEADERS",
      headers: SALESMANAGER_FINALIZED_DEAL_HEADERS,
    },

    //receptionist customer log
    { name: "REC_CUSTOMER_LOG_HEADERS", headers: REC_CUSTOMER_LOG_HEADERS },

    //finance manager sales
    { name: "FINANCE_ASSIGNED_HEADERS", headers: FINANCE_ASSIGNED_HEADERS },
    { name: "FINANCE_RETURNED_HEADERS", headers: FINANCE_RETURNED_HEADERS },
    { name: "FINANCE_FINALIZED_HEADERS", headers: FINANCE_FINALIZED_HEADERS },

    //finance director sales
    {
      name: "DIRECTOR_FINALIZED_DEAL_HEADERS",
      headers: DIRECTOR_FINALIZED_DEAL_HEADERS,
    },
    {
      name: "DIRECTOR_RETURNED_DEAL_HEADERS",
      headers: DIRECTOR_RETURNED_DEAL_HEADERS,
    },
    {
      name: "DIRECTOR_ASSIGNED_DEAL_HEADERS",
      headers: DIRECTOR_ASSIGNED_DEAL_HEADERS,
    },

    //finance assistant sales
    {
      name: "ASSISTANT_FINALIZED_HEADERS",
      headers: ASSISTANT_FINALIZED_HEADERS,
    },
    { name: "ASSISTANT_ASSIGNED_HEADERS", headers: ASSISTANT_ASSIGNED_HEADERS },
    { name: "ASSISTANT_RETURNED_HEADERS", headers: ASSISTANT_RETURNED_HEADERS },

    //salesperson sales
    { name: "DEAL_SOLD_HEADERS", headers: DEAL_SOLD_HEADERS },
    { name: "DEAL_FINANCE_HEADERS", headers: DEAL_FINANCE_HEADERS },
    { name: "DEAL_FINALIZED_HEADERS", headers: DEAL_FINALIZED_HEADERS },
    {
      name: "SALESMANAGER_QUOTE_DEAL_HEADERS",
      headers: SALESMANAGER_QUOTE_DEAL_HEADERS,
    },

    //accountant sales
    {
      name: "ACCOUNT_SIGNED_FINALIZED_DEALS_HEADERS",
      headers: ACCOUNT_SIGNED_FINALIZED_DEALS_HEADERS,
    },
    {
      name: "ACCOUNTANT_RETURNED_DEALS_HEADERS",
      headers: ACCOUNTANT_RETURNED_DEALS_HEADERS,
    },
    {
      name: "ACCOUNTANT_PAYOFF_DEALS_HEADERS",
      headers: ACCOUNTANT_PAYOFF_DEALS_HEADERS,
    },
    {
      name: "ACCOUNTANT_FINALIZED_DEAL_HEADERS",
      headers: ACCOUNTANT_FINALIZED_DEAL_HEADERS,
    },

    //gm sales
    { name: "GM_DAILY_DEAL_HEADERS", headers: GM_DAILY_DEAL_HEADERS },
    { name: "GM_FINANCE_DEALS_HEADERS", headers: GM_FINANCE_DEALS_HEADERS },
    { name: "GM_SOLD_DEALS_HEADERS", headers: GM_SOLD_DEALS_HEADERS },
    { name: "GM_FINALIZED_DEALS_HEADERS", headers: GM_FINALIZED_DEALS_HEADERS },
    { name: "GM_QUOTE_DEALS_HEADERS", headers: GM_QUOTE_DEALS_HEADERS },

    { name: "FINANCE_DEAL_HEADERS", headers: FINANCE_DEAL_HEADERS },
    {
      name: "MAKE_READY_ALL_DATA_HEADERS",
      headers: MAKE_READY_ALL_DATA_HEADERS,
    },
    { name: "MAKE_READY_HEADERS", headers: MAKE_READY_HEADERS },
    { name: "DEAL_DOCUMENT_HEADERS", headers: DEAL_DOCUMENT_HEADERS },
    { name: "NEW_OBJECTIVES_HEADERS", headers: NEW_OBJECTIVES_HEADERS },
    { name: "USED_OBJECTIVES_HEADERS", headers: USED_OBJECTIVES_HEADERS },
    { name: "GM_NEW_OBJECTIVES_HEADERS", headers: GM_NEW_OBJECTIVES_HEADERS },
    { name: "GM_USED_OBJECTIVES_HEADERS", headers: GM_USED_OBJECTIVES_HEADERS },
    {
      name: "GM_FINANCE_OBJECTIVE_HEADERS",
      headers: GM_FINANCE_OBJECTIVE_HEADERS,
    },
    { name: "GM_TOTAL_OBJECTIVE_HEADERS", headers: GM_TOTAL_OBJECTIVE_HEADERS },
    { name: "SALESPERSON_HEADER", headers: SALESPERSON_HEADER },
    { name: "MANAGERS_PRODUCTION_HEADER", headers: MANAGERS_PRODUCTION_HEADER },
    { name: "FINANCEQUEUE_HEADER", headers: FINANCEQUEUE_HEADER },
    { name: "PLATES_HEADER", headers: PLATES_HEADER },
    { name: "SALESBOARD_HEADER", headers: SALESBOARD_HEADER },
    { name: "NEW_PRODUCTION_HEADERS", headers: NEW_PRODUCTION_HEADERS },
    { name: "USED_PRODUCTION_HEADERS", headers: USED_PRODUCTION_HEADERS },
    { name: "SIGNED_DEAL_HEADERS", headers: SIGNED_DEAL_HEADERS },
    { name: "ACCOUNTANT_DEALS_HEADERS", headers: ACCOUNTANT_DEALS_HEADERS },
    { name: "DEALERSHIP_HEADER", headers: DEALERSHIP_HEADERS },
    {
      name: "SALESPERSON_OBJECTIVE_HEADER",
      headers: SALESPERSON_OBJECTIVE_HEADER,
    },
  ];

  for (const { name, headers: referenceHeaders } of headerConstants) {
    if (headers.length !== referenceHeaders.length) continue;

    const isExactMatch = headers.every(
      (h, i) => h.key === referenceHeaders[i].key,
    );

    if (isExactMatch) return name;
  }

  return undefined;
};
