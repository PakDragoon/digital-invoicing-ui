import colors from "@/common/constants/tailwind-colors"

export const metricData = [
  {
    key: "estimatedSalesGross",
    label: "Sales Gross",
    value: 0.0,
    iconColor: colors.oldlace["600"],
    iconBgColor: colors.oldlace["100"],
  },
  {
    key: "estimatedFinanceGross",
    label: "Finance Gross",
    value: 0.0,
    iconColor: colors.oldlace["600"],
    iconBgColor: colors.oldlace["100"],
  },
  {
    key: "totalGross",
    label: "Total Gross",
    value: 0.0,
    iconColor: colors.oldlace["600"],
    iconBgColor: colors.oldlace["100"],
  },
]

export const infoData = [
  {
    title: "Deal & Customer Info",
    sections: [
      {
        title: "Deal Info",
        data: [
          { key: "dealershipDealNo", label: "Deal Number:" },
          { key: "customer", label: "Customer Name:",magnifiedView:false},
          { key: "stock", label: "Stock Number:" },
          { key: "dealDate", label: "Deal Date:" },
          { key: "dealStatus", label: "Relay Deal Status:" },
          { key: "businessMonth", label: "Business Month:" },
          { key: "source", label: "Source:" },
          { key: "salesperson1", label: "Sales Person 1:" },
          { key: "salesperson2", label: "Sales Person 2:" },
          { key: "salesmanager", label: "Sales Manager:" },
          { key: "financeManager", label: "Finance Manager:" },
        ],
      },
      {
        title: "Customer Info",
        data: [
          { key: "customer", label: "Customer Name:" },
          { key: "customerAddress", label: "Address" },
          { key: "customerCity", label: "City:" },
          { key: "customerState", label: "State:" },
          { key: "customerZip", label: "Zip:" },
          { key: "customerPhone", label: "Phone:" },
          { key: "customerEmail", label: "Email Address:" },
        ],
      },
       {
        title: "CoBuyer Info",
        data: [
          { key: "coBuyerAddress", label: "Address:" },
          { key: "coBuyerCity", label: "City :" },
          { key: "coBuyerName", label: "Name:" },
          { key: "coBuyerState", label: "State:" },
          { key: "coBuyerZipCode", label: "Zip Code:" },
         ],
         display: false

      },
    ],
  },
  {
    title: "Vehicle Info",
    sections: [
      {
        title: "Vehicle Info",
        data: [
          { key: "vehicleStatus", label: "Vehicle Status:" },
          { key: "year", label: "Year:" },
          { key: "make", label: "Make:" },
          { key: "model", label: "Model:" },
          { key: "modelNumber", label: "Model Number:" },
          { key: "vin", label: "VIN:" },
          { key: "color", label: "Exterior Color:" },
        ],
      },
      {
        title: "Trade Info",
        data: [
          { key: "tradeYear", label: "Year:" },
          { key: "tradeMake", label: "Make:" },
          { key: "tradeModel", label: "Model:" },
          { key: "tradeModelNo", label: "Model Number:" },
          { key: "tradeVin", label: "VIN:" },
          { key: "tradeMiles", label: "Miles:" },
          { key: "tradePayoff", label: "ACV:" },
          { key: "tradeAcv", label: "Payoff:" },
        ],
      },
    ],
  },
  {
    title: "Finance & Sales Info",
    sections: [
      {
        title: "Finance Info",
        data: [
          { key: "paymentMethod", label: "Payment Method:" },
          { key: "lienHolder", label: "Finance Source / Lienholder:" },
          { key: "term", label: "Term" },
          { key: "msrp", label: "MSRP:" }, // TODO: monthly payment
          { key: "paymentAmount", label: "Payment Amount:" },
          { key: "payoffDate", label: "Payoff Date:" }, // TODO: payoff amount
          { key: "cashDown", label: "Cash Down:" },
          { key: "totalAmountFinanced", label: "Amount Financed:" },
        ],
      },
      {
        title: "MBI Info",
        data: [
          { key: "mbiCarrier", label: "Carrier:" },
          { key: "mbiMileageExpected", label: "Mileage Expected:" },
          { key: "mbiExpiration", label: "Expiration:" },
          { key: "mbiGross", label: "Gross:" },
        ],
      },
      {
        title: "Lease Info",
        data: [
          { key: "leasePayment", label: "Payment:" },
          { key: "leaseMileageAllowance", label: "Mileage Allowance:" },
          { key: "leaseEndValue", label: "End Value:" },
        ],
      },
    ],
  },
  {
    title: "Finance Products",
    sections: [
      {
        title: "Finance Products",
        data: [
          { key: "gapIncome", label: "GAP" },
          { key: "wheelIncome", label: "Wheel & Tire:" },
          { key: "windshieldIncome", label: "Windshield:" },
          { key: "chemicalIncome", label: "Chemical:" },
          { key: "pdrIncome", label: "PDR:" },
          { key: "maintenanceIncome", label: "Maintenance:" },
        ],
      },
    ],
  },
]
