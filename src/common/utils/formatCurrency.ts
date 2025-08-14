  // Function to format numbers as currency
  export const formatCurrency = (value: number,isCurrency:boolean) => {
    return isCurrency ? `$${value.toLocaleString()}` : value.toString()
  }