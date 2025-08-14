import { CURRENCIES } from "@/common/constants/currency";
import React from "react";

interface CurrencyLabelProps {
  value: number | string;
  currency?: string;
  fractionDigits?: number;
}

export const CurrencyLabel: React.FC<CurrencyLabelProps> = ({
  value,
  currency = CURRENCIES.USD.code,
  fractionDigits = 2,
}) => {
  const amount = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(amount)) {
    return <span>Invalid amount</span>;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return <span>{formatter.format(amount)}</span>;
};
