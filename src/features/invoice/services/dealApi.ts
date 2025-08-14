import { EntityType } from "@/common/constants/comment"
import { formatBusinessMonth } from "@/common/utils"
import api from "@/core/config/api"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { businessMonthMap, InvoiceFormData } from "../deal-form/CreateDealFieldConfig"
import { businessMonthFormatter } from "@/common/utils/businessMonthFormatter"
import { PrismaDealStatus } from "@/core/entities/deal"
import { toast } from "react-toastify"

interface SalespersonOption {
  name: string
  id: string
}

interface SalespersonOptionsResponse {
  salespersonOptions: SalespersonOption[]
}

export const dealService = {
  fetchDealData: async (dealNo: string, dealershipId: string, token: string) => {
    try {
      const response = await api.get(`/deal/dealership/${dealNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dealershipId,
        },
      })

      return response.data.data.data
    } catch (error) {
      console.error("Error fetching deal data:", error)
      return {}
    }
  },
  fetchSalesperson: async (id: string, dealershipId: string, token: string) => {
    try {
      const response = await api.get(`/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dealershipId,
        },
      })
      return response.data.data
    } catch (error) {
      console.error("Error fetching salesperson data:", error)
      throw error
    }
  },

  formatFullName: (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} ${
      lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
    }`
  },

  getRelaySalesperson: async (
    salespersonId: string | null | undefined,
    dealershipId: string,
    token: string
  ): Promise<any> => {
    if (!salespersonId) return ""
    try {
      const Relaysalesperson = await dealService.fetchDMSEMployee(
        salespersonId,
        dealershipId,
        token
      )
      return {
        id: Relaysalesperson.id,
        name: Relaysalesperson.name,
      }
    } catch (error) {
      console.error(`Error fetching name for salesperson ${salespersonId}:`, error)
      return ""
    }
  },

  getCustomer: async (
    phone: string,
    dealershipId: string,
    token: string | null,
    verificationId: string
  ) => {
    try {
      const response = await api.get(`/customer/existing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          phone,
          dealershipId,
          verificationId,
        },
      })
      return response.data.data
    } catch {
      console.error("No customer found or request failed:")
      return null
    }
  },
  getCustomerVisit: async (id: string, dealershipId: string, token: string | null) => {
    const response = await api.get(`/customer-visit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        dealershipId,
      },
    })

    return response.data.data.id
  },
  saveComment: async (entityType: EntityType, entityId: string | number, commentBody: string) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const companyId = (user?.companyId ?? "").toString()
    const commentToSave = {
      entityType,
      entityId: String(entityId),
      commentBody,
      dealershipId,
      companyId,
    }

    try {
      const { data } = await api.post("/comment", commentToSave)
      return data
    } catch (error) {
      console.error(`Error saving ${entityType} comment for ID ${entityId}: `, error)
    }
  },
  fetchComments: async (entityType: EntityType, entityId: string | number) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()

    try {
      const { data } = await api.get("/comment", { params: { entityType, entityId, dealershipId } })
      return data
    } catch (error) {
      console.error(`Error fetching ${entityType} comments for ID ${entityId}: `, error)
    }
  },
  fetchDMSEMployee: async (dmsId: string, dealershipId: string, token: string) => {
    try {
      const response = await api.get(`/employee/dms-employee/${dmsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dealershipId,
        },
      })

      return {
        id: response.data.data.id,
        name: response.data.data.firstName + " " + response.data.data.lastName,
      }
    } catch (error) {
      console.error("Error fetching salesperson data:", error)
      throw error
    }
  },

  saveDeal: async (
    dealData: any,
    token: string
    //  CustomerVisitId: string | null
  ) => {
    const { user } = useAuthStore.getState()
    const certified = dealData.certified === "Certified"
    const dealToSave = {
      companyId: user?.companyId,
      dealershipId: user?.dealershipId,
      createdBy: user?.id,
      // visitId: CustomerVisitId ?? null,
      dealershipDealNo: dealData.dealershipDealNo,
      stock: dealData.stock,
      vehicleStatus: dealData.vehicleStatus,
      relayDealType: dealData.relayDealType || null,
      salesType: dealData.salesType,
      paymentMethod: dealData.paymentMethod || null,
      source: dealData.source || null,
      dealStatus: "Sold",
      contractStatus: "Pending",
      contractFundedDate: null,
      salesperson01: dealData.salesperson1,
      salesperson02: dealData.salesperson2 || null,
      salesmanagerId: user?.id,
      financeManagerId: null,
      estimatedDelivery: null,
      estimatedSalesGross: parseInt(dealData.estimatedSalesGross) || 0,
      dealDate: dealData.dealDate === "" ? null : dealData.dealDate,
      businessMonth: dealData.businessMonth ? businessMonthFormatter(dealData.businessMonth) : null,
      vehicleCondition: "New",
      financeCompleteDate: null,
      contractAmount: 0,
      payoff: 0,
      vehicleAge: 0,
      accountingStatus: "Pending",
      originalReturnDate: null,
      returnedBy: null,
      year: parseInt(dealData.year, 10) || 0,
      make: dealData.make || null,
      model: dealData.model || null,
      modelNumber: dealData.modelNo || null,
      vin: dealData.vin,
      color: dealData.color || null,
      interiorColor: dealData.interiorColor || null,
      miles: parseInt(dealData.miles, 10) || 0,
      tradeYear: parseInt(dealData.tradeYear) ?? null,
      tradeMake: dealData.tradeMake ?? null,
      tradeModel: dealData.tradeModel ?? null,
      tradeVin: dealData.tradeVin ?? null,
      tradePayoff: dealData.tradePayoff ?? null,
      tradeMiles: dealData.tradeMileage ?? null,
      tradeAcv: parseInt(dealData.totalTradesACV, 10) | 0,
      equipment: "",
      certified: certified,
      customerName: dealData.customer,
      customerPhone: dealData.customerPhone,
      customerVerificationNo: dealData.personaVerificationId,
    }

    try {
      const response = await api.post("/deal", dealToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const deal = response.data.data.data
      if (dealData.comment) {
        await dealService.saveComment(EntityType.Deal, deal.id, dealData.comment)
      }
      return deal
    } catch (error) {
      console.error("Error saving deal:", error)
      const errorMessage =
        error.response?.data?.message?.message || "Failed to save deal, try again."
      toast.error(errorMessage)
    }
  },
  updateDeal: async (dealId: string, formData: Partial<InvoiceFormData>) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const businessMonth =
      formData.businessMonth === formatBusinessMonth(formData.businessMonth)
        ? formData.businessMonth
        : businessMonthMap[formData.businessMonth ?? ""] || ""

    const rawPayload = {
      salesType: formData.salesType,
      stock: formData.stock,
      vehicleStatus: formData.vehicleStatus,
      salesperson01: formData.salesperson1?.id?.toString()?.trim(),
      salesperson02: formData.salesperson2?.id?.toString()?.trim() || null,
      ...(formData.businessMonth && {
        businessMonth: businessMonthFormatter(formData.businessMonth),
      }),
      dealDate: formData.dealDate === "" ? null : formData.dealDate,
      relayDealType: formData.relayDealType,
      paymentMethod: formData.paymentMethod,
      source: formData.source,
      estimatedSalesGross: parseInt(formData.estimatedSalesGross ?? ""),
      contractType: formData.contractType,
      contractStatus: formData.contractStatus,
      contractFundedDate: formData.contractFundedDate
        ? new Date(formData.contractFundedDate)
        : null,

      year: parseInt(formData.year ?? "", 10),
      make: formData.make,
      model: formData.model,
      modelNumber: formData.modelNumber,
      color: formData.color,
      interiorColor: formData.interiorColor,
      miles: parseInt(formData.miles ?? "", 10),

      tradeAcv: parseInt(formData.tradeAcv ?? "", 10),
      tradeYear: parseInt(formData.tradeYear ?? "", 10),
      tradeMake: formData.tradeMake,
      tradeModel: formData.tradeModel,
      tradeMiles: parseInt(formData.tradeMiles ?? "", 10),
    }

    try {
      const updatedData = { ...rawPayload, dealershipId }
      const response = await api.patch(`/deal/${dealId}`, updatedData)
      if (formData.comment) await dealService.saveComment(EntityType.Deal, dealId, formData.comment)
      return response.data.data
    } catch (error) {
      console.error("Error updating deal:", error)
      throw error
    }
  },
  updateContractStatusAndDate: async (dealId: string, formData: Partial<InvoiceFormData>) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()

    const rawPayload = {
      contractStatus: formData.contractStatus,
      contractFundedDate: formData.contractFundedDate
        ? new Date(formData.contractFundedDate)
        : null,
    }

    try {
      const updatedData = { ...rawPayload, dealershipId }
      const response = await api.patch(`/deal/${dealId}`, updatedData)
      return response.data.data
    } catch (error) {
      console.error("Error updating contract status or date: ", error)
      throw error
    }
  },
  updateDealContractType: async (dealId: string, formData: Partial<InvoiceFormData>) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const rawPayload = { contractType: formData.contractType }

    try {
      const updatedData = { ...rawPayload, dealershipId }
      const response = await api.patch(`/deal/${dealId}`, updatedData)
      return response.data.data
    } catch (error) {
      console.error("Error updating contract type: ", error)
      throw error
    }
  },
  updateDealStatus: async (dealId: string, dealStatus: PrismaDealStatus, gross?: number) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const companyId = (user?.companyId ?? "").toString()
    const estimatedFinanceGross = parseFloat(gross) || 0

    const payload = {
      dealId,
      dealershipId,
      companyId,
      dealStatus,
      ...(estimatedFinanceGross && { estimatedFinanceGross }),
    }

    try {
      const response = await api.patch(`/deal/update-status`, payload)
      return response.data.data
    } catch (error) {
      console.error("Error updating deal:", error)
      throw error
    }
  },
  getSalespersonOptions: async (): Promise<SalespersonOptionsResponse> => {
    const { user } = useAuthStore.getState()
    const dealershipId = user?.dealershipId?.toString() ?? ""

    try {
      const response = await api.get("/employee/salespersons", {
        params: { dealershipId },
      })

      const allSalespeople = response?.data?.data ?? []

      const salespersonOptions = allSalespeople.map((person: any) => ({
        name: `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim(),
        id: person.id ?? "",
      }))
      return {
        salespersonOptions,
      }
    } catch (error) {
      console.error("Failed to fetch salespeople:", error)
      return {
        salespersonOptions: [],
      }
    }
  },

  fetchExistingDeal: async (dealNo: string, dealershipId: string, token: string) => {
    try {
      const dealershipDealNo = dealNo
      const response = await api.get(`/deal/dealNo/${dealershipDealNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dealershipId,
        },
      })

      return response.data.data.data
    } catch (error) {
      console.error("Error fetching deal data:", error)
      return error
    }
  },

  fetchRealDealById: async (id: string, dealershipId: string, token: string) => {
    try {
      const response = await api.get(`/deal/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dealershipId,
        },
      })

      return response.data.data.data
    } catch (error) {
      console.error("Error fetching deal data:", error)
      throw error
    }
  },
  fetchDocumentTypes: async (dealershipId: string) => {
    try {
      const response = await api.get(`/deal-doc/types`, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error fetching deal document types: ", error)
      return error
    }
  },
  fetchDealDocuments: async (dealId: string, dealershipId: string) => {
    try {
      const response = await api.get(`/deal-doc/${dealId}`, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error fetching deal documents: ", error)
      return error
    }
  },
  addDealDocument: async (dealId: string, docTypeId: number, comment: string) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const companyId = (user?.companyId ?? "").toString()

    const payload = {
      dealId,
      docTypeId,
      isReceived: false,
      companyId,
      dealershipId,
      comment,
    }

    try {
      const response = await api.post(`/deal-doc/upload`, payload, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error adding deal document: ", error)
      throw error.response?.data?.message || error
    }
  },
  updateDocumentStatus: async (docId: string, dealershipId: string) => {
    try {
      const response = await api.post(`/deal-doc/receive`, { docId }, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error updating deal document status: ", error)
      throw error
    }
  },
  deleteDealDocument: async (docId: string, dealershipId: string) => {
    try {
      const response = await api.delete(`/deal-doc/${docId}`, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error deleting deal document: ", error)
      throw error
    }
  },
  fetchManagers: async (dealershipId: string) => {
    try {
      const response = await api.get("/finance/getAvailableFIManagers", {
        params: { dealershipId },
      })
      return response.data.data
    } catch (err) {
      console.error("Error fetching finance managers", err)
    }
  },
  fetchSalesPerson: async (dealershipId: string) => {
    try {
      const response = await api.get("/employee/available/salesperson", {
        params: { dealershipId },
      })

      return response.data.data
    } catch (err) {
      console.error("Error fetching salespersons", err)
    }
  },
  AssignDealToFinManager: async (dealId: string, fiManagerId: string, dealershipId: string) => {
    try {
      const response = await api.patch(
        "/finance/assignDeal",
        {
          dealId,
          fiManagerId,
        },
        { params: { dealershipId } }
      )

      return response.data
    } catch (err) {
      console.error("Error assigning deal to finance manager", err)
      throw err
    }
  },

  SendDealToRotation: async (dealId: string, dealershipId: string) => {
    try {
      const response = await api.post(
        `/finance/dealAssignFinance/${dealId}?dealershipId=${dealershipId}`
      )
      return response.data
    } catch (err) {
      console.error("Error assigning deal to finance manager", err)
      throw err
    }
  },

  SetDealAsPriority: async (dealId: string, dealershipId: string) => {
    try {
      const response = await api.post(
        `/finance/setDealAsPriority/${dealId}?dealershipId=${dealershipId}`
      )

      return response.data
    } catch (err) {
      console.error("Error assigning deal to finance manager", err)
      throw err
    }
  },

  getDealStatusHistory: async (dealId: string, dealershipId: string) => {
    try {
      const response = await api.get(`/deal/status-history/${dealId}`, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error fetching deal status history: ", error)
      return error
    }
  },
  updateAccountingStatus: async (data: {
    dealId: string
    dealershipId: string
    status: string
    comment: string
  }) => {
    try {
      const response = await api.patch(`/deal/accounting/update`, data)
      return response.data.data
    } catch (error) {
      console.error("Error updating accounting status: ", error)
      return error
    }
  },

  getDealsBySearch: async (search: string, dealershipId: string) => {
    try {
      const response = await api.get(`/deal/search/${search}`, { params: { dealershipId } })
      return response.data.data
    } catch (error) {
      console.error("Error fetching deal(s) by search: ", error)
      throw error
    }
  },

  createDealDocumentType: async (docTypeName: string, dealershipId: string, companyId: string) => {
    try {
      const response = await api.post(`/deal-doc/type?dealershipId=${dealershipId}`, {
        docTypeName,
        companyId,
      })
      return response.data.data
    } catch (error) {
      console.error("Error creating deal document type: ", error)
      throw error
    }
  },
}
