import { useAuthStore } from "@/features/auth/stores/authStore";
import React from "react";
import InvoiceHeader from "./InvoiceHeader";

const RoleBasedHeader: React.FC = () => {
  const { user } = useAuthStore.getState();
  const role = user?.role;

  // All roles now use the same invoice header
  return <InvoiceHeader />;
};

export default RoleBasedHeader;
