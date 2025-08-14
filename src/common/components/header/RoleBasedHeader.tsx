import { useAuthStore } from "@/features/auth/stores/authStore";
import React from "react";
import SalesHeader from "../salesFilterBar/salesFilterBar";
import SalesPersonHeader from "./Salesperson/SalespersonHeader";

const RoleBasedHeader: React.FC = () => {
  const { user } = useAuthStore.getState();
  const role = user?.role;

  if (role === "SalesManager") return <SalesHeader />;
  if (role === "SalesPerson") return <SalesPersonHeader />;
};

export default RoleBasedHeader;
