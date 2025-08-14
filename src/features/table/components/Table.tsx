import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  useEmployeeStatus,
  useTableData,
} from "@/features/table/services/tableDataApi";
import DataTable from "@/common/components/datatable/DataTable";
import Pagination from "./Pagination";
import { TableCard } from "@/common/components/cards/TableCard";
import { ITab } from "@/core/config/tableConfig";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useSalesTypeStore } from "@/common/components/salesFilterBar/store";
import { getTabName } from "@/common/utils/tabNameMapper";

type TableComponentProps = {
  tabs: ITab[];
  dealershipId: string;
  tablePageName: string;
};

const Table: React.FC<TableComponentProps> = ({
  tabs,
  dealershipId,
  tablePageName,
}) => {
  const userId = useAuthStore((state) => state.user?.id?.toString() ?? "");
  const userRole = useAuthStore((state) => state.user?.role?.toString() ?? "");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromQuery: string | null = searchParams.get("tab");
  const { selectedSalesType } = useSalesTypeStore();

  const defaultTab: string | null = useMemo(() => {
    if (!tabs.length) return null;
    const found = tabs.find((tab) => tab.key === tabFromQuery);
    return found?.label || tabs[0]?.label;
  }, [tabFromQuery, tabs]);

  if (!defaultTab) return <div>No tabs found</div>;

  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState(10);
  const selectedTabConfig = useMemo(
    () => tabs.find((tab) => tab.label === selectedTab),
    [tabs, selectedTab],
  );
  useEffect(() => {
    const label = tabs.find((tab) => tab.key === tabFromQuery)?.label;
    if (label && label !== selectedTab) {
      setSelectedTab(label);
      setFilters({});
      setPage(1);
    }
  }, [tabFromQuery, tabs]);

  const {
    headers = [],
    api = "",
    color = "",
    rowColor = "",
    dealStatus = [],
    mrStatus = [],
    visitStatus = [],
    empStatus = [],
    hidden = [],
    searchPlaceholder = "Search by Deal#, Salesperson, Customer Name",
  } = selectedTabConfig || {};

  const getEffectiveUserId = (): string => {
    return userId;
  };

  const getEffectiveRole = (): string => {
    return userRole;
  };

  const { data, isLoading, isError } = useTableData(api, {
    page,
    limit,
    search,
    filters,
    dealershipId,
    salesType: selectedSalesType?.value,
    userId: getEffectiveUserId(),
    viewAsRole: getEffectiveRole(),
  });

  const deals = data?.data || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  };

  const user = useAuthStore((state) => state.user);

  const empStatusQuery = useEmployeeStatus(
    user?.roleId,
    user?.companyId,
    user?.dealershipId,
  );
  const statusNames =
    empStatusQuery.data?.data?.map((item: any) => item.statusName) ?? [];

  const handlePagination = (direction: "next" | "prev" | number) => {
    if (typeof direction === "number") {
      setPage(direction);
    } else {
      setPage((prev) =>
        direction === "next" && page < pagination.totalPages
          ? prev + 1
          : direction === "prev" && page > 1
            ? prev - 1
            : prev,
      );
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setFilters({});
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    if (selectedTab !== "Quote Deals") {
      const tab = getTabName(userRole, tablePageName);
      console.log("tab: ", tab);
      if (tab) {
        handleTabChange(tab);
      }
    }
    setSearch(query);
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value === null) delete updated[key];
      else updated[key] = value;
      return updated;
    });
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <>
      <TableCard
        component={DataTable}
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        hidden={hidden}
        componentProps={{
          color,
          rowColor,
          headers,
          hidden,
          dealStatus,
          mrStatus,
          visitStatus,
          empStatus: empStatus || statusNames,
          data: deals?.data || [],
          isLoading,
          isError,
          searchQuery: search,
          onSearchChange: handleSearchChange,
          filters,
          onFilterChange: handleFilterChange,
          searchBoxPlaceholder: searchPlaceholder,
          selectedTab,
        }}
      />

      {deals?.data?.length > 0 && tablePageName !== "FinanceProduction" && (
        <Pagination
          color={color}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.total}
          perPage={pagination.limit}
          limit={limit}
          onPageChange={handlePagination}
          onLimitChange={handleLimitChange}
        />
      )}
    </>
  );
};

export default Table;
