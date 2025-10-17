import api from "@/core/config/api";

export interface FBRInvoiceData {
  // Basic Invoice Information
  invoiceType: string;
  invoiceDate: string;
  invoiceRefNo: string;
  scenarioId: string;
  
  // Seller Information
  sellerNTNCNIC: string;
  sellerBusinessName: string;
  sellerProvince: string;
  sellerAddress: string;
  
  // Buyer Information
  buyerRegistrationType: string;
  buyerNTNCNIC: string;
  buyerBusinessName: string;
  buyerProvince: string;
  buyerAddress: string;
  
  // Invoice Items
  items: FBRInvoiceItem[];
}

export interface FBRInvoiceItem {
  hsCode: string;
  productDescription?: string;
  rate?: string;
  uoM: string;
  quantity: number;
  valueSalesExcludingST: number;
  salesTaxApplicable?: number;
  furtherTax?: number;
  fedPayable?: number;
  discount?: number;
  fixedNotifiedValueOrRetailPrice?: number;
  saleType: string;
  totalValues?: number;
  salesTaxWithheldAtSource?: number;
  extraTax?: string;
  sroScheduleNo?: string;
  sroItemSerialNo?: string;
}

export interface FBRInvoiceResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export const fbrApiService = {
  /**
   * Submit invoice data to FBR
   */
  submitInvoiceData: async (invoiceData: FBRInvoiceData): Promise<FBRInvoiceResponse> => {
    try {
      const response = await api.post('/fbr/post_invoice_data_sb', invoiceData);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting invoice to FBR:', error);
      
      // Handle different error scenarios
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Failed to submit invoice',
          errors: error.response.data.errors || [error.response.data.message]
        };
      }
      
      return {
        success: false,
        message: 'Network error occurred while submitting invoice',
        errors: ['Network error']
      };
    }
  },

  /**
   * Validate invoice data before submission
   */
  validateInvoiceData: (invoiceData: FBRInvoiceData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate basic information
    if (!invoiceData.invoiceType) errors.push('Invoice type is required');
    if (!invoiceData.invoiceDate) errors.push('Invoice date is required');
    if (!invoiceData.invoiceRefNo) errors.push('Invoice reference number is required');
    if (!invoiceData.scenarioId) errors.push('Scenario ID is required');

    // Validate seller information
    if (!invoiceData.sellerNTNCNIC) errors.push('Seller NTN/CNIC is required');
    if (!invoiceData.sellerBusinessName) errors.push('Seller business name is required');
    if (!invoiceData.sellerProvince) errors.push('Seller province is required');
    if (!invoiceData.sellerAddress) errors.push('Seller address is required');

    // Validate buyer information
    if (!invoiceData.buyerRegistrationType) errors.push('Buyer registration type is required');
    if (!invoiceData.buyerNTNCNIC) errors.push('Buyer NTN/CNIC is required');
    if (!invoiceData.buyerBusinessName) errors.push('Buyer business name is required');
    if (!invoiceData.buyerProvince) errors.push('Buyer province is required');
    if (!invoiceData.buyerAddress) errors.push('Buyer address is required');

    // Validate items
    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push('At least one invoice item is required');
    } else {
      invoiceData.items.forEach((item, index) => {
        if (!item.hsCode) errors.push(`Item ${index + 1}: HS Code is required`);
        if (!item.uoM) errors.push(`Item ${index + 1}: UOM is required`);
        if (item.quantity <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
        if (item.valueSalesExcludingST <= 0) errors.push(`Item ${index + 1}: Sales value must be greater than 0`);
        if (!item.saleType) errors.push(`Item ${index + 1}: Sale type is required`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
