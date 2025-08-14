import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";

import {
  CloseIcon,
  DownloadIcon,
  DropDownIcon,
  SearchIcon,
  SettingsIcon,
  Sort,
  UploadIcon,
  WhiteAddIcon,
} from "@/assets";
import { FullPageLoader } from "@/common/components/FullPageLoader";
import { ROUTES } from "@/common/routes";
import { getStatusBadge } from "@/common/utils/getStatusBadge";
import {
  DataTableProps,
  getConstantNameByHeaders,
  getEditTableRowModalConfig,
} from "@/core/config/tableConfig";
import { useGetSalesPersons } from "@/features/table/services/tableDataApi";
import TextField from "../inputs/CustomTextField";
import { useModalStore } from "../modal/store/modalStore";
import Modal from "@/common/components/modal/NewModal";
import CustomButton from "../buttons/CustomButton";
import { useDealStore } from "@/features/invoice/store/dealStore";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { productionBusinessMonth } from "../forms/data-fields/filters";
import NotificationTableAction from "@/features/notifications/components/NotificationTableAction";
import NotificationDetailsModal from "@/features/notifications/components/NotificationDetailsModal";
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore";
import { tabToRoleMap } from "@/common/utils/routesUtils";
import { useTableConfig } from "./hooks/useFetchDataTableConfiguration";
import { upsertTableConfig } from "./services/saveTableConfigApi";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadDealershipCsv } from "@/features/dashboard/components/SuperAdmin/hook/useUploadCSV";
import { useDownloadDealershipCsv } from "@/features/dashboard/components/SuperAdmin/hook/useDownloadCSV";
import { CurrencyLabel } from "../currency/CurrencyComponent";

type DraggableHeaderProps = {
  id: string;
  label: string;
  index: number;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  color: string;
  handleSort: (key: string) => void;
  columnVisibility: Record<string, boolean>;
  headerKey: string;
  setDraggingColumn: (columnId: string | null) => void;
  setSettingsChanged: (value: boolean) => void;
};

type FormData = {
  verificationId: string;
  assignedSalespersonId?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  salesType?: string;
  source?: string;
  vehicleInterest?: string;
  visitStatus?: string;
};

const DraggableHeader: React.FC<DraggableHeaderProps> = ({
  id,
  label,
  index,
  moveColumn,
  color,
  handleSort,
  headerKey,
  setDraggingColumn,
  setSettingsChanged,
}) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const [columnWidth, setColumnWidth] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      setColumnWidth(ref.current.offsetWidth);
    }
  }, []);

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { id, index, columnWidth },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragItem = item as { id: string; index: number };
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveColumn(dragIndex, hoverIndex);
      (item as { id: string; index: number }).index = hoverIndex;
      setSettingsChanged(true);
    },
  });

  React.useEffect(() => {
    setDraggingColumn(isDragging ? id : null);
  }, [isDragging, id, setDraggingColumn]);

  drag(drop(ref));

  return (
    <div
      ref={ref}
      key={headerKey}
      className="cursor-pointer bg-white px-[1.25rem] py-4 text-left font-bold"
      style={{
        color: color,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        userSelect: "none",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">{label}</span>
        <span onClick={() => handleSort(headerKey)} className="cursor-pointer">
          <img src={Sort} alt="Sort Icon" />
        </span>
      </div>

      <div className="resize-handle"></div>
    </div>
  );
};

const Resizer: React.FC<{
  headerKey: string;
  onResize: (width: number, headerKey: string) => void;
}> = ({ headerKey, onResize }) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.clientX);
    const width = resizerRef.current?.previousElementSibling?.clientWidth ?? 0;
    setStartWidth(width);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const offset = e.clientX - startX;
    const newWidth = startWidth + offset;

    onResize(Math.max(0, Math.min(250, newWidth)), headerKey);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={resizerRef}
      className="absolute bottom-0 right-0 top-0"
      style={{
        width: "5px",
        cursor: "ew-resize",
        zIndex: 1,
        transition: "width 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

const DataTable: React.FC<DataTableProps> = ({
  color,
  rowColor,
  headers,
  dealStatus,
  mrStatus,
  visitStatus,
  empStatus,
  carMakes,
  data,
  isLoading,
  isError,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  searchBoxPlaceholder,
  showSearchBox = true,
  editField = false,
  objectiveData,
  setObjectiveData,
  button,
  selectedTab,
}) => {
  const queryClient = useQueryClient();
  const initialColumnVisibility = headers.reduce<Record<string, boolean>>(
    (acc, { key, checked }, index) => {
      if (
        (index < 10 || key === "actions") &&
        (checked === undefined || checked)
      )
        acc[key] = true;
      else acc[key] = false;
      return acc;
    },
    {},
  );

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(initialColumnVisibility);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    verificationId: "",
    assignedSalespersonId: "",
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    salesType: "",
    source: "",
    vehicleInterest: "",
    visitStatus: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [draggingColumn, setDraggingColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    headers.map((header) => header.key),
  );
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    headers.reduce<Record<string, number>>((acc, header) => {
      acc[header.key] = 0;
      return acc;
    }, {}),
  );

  const handleColumnResize = (width: number, headerKey: string) => {
    setSettingsChanged(true);
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [headerKey]: width,
    }));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder];
    const [movedColumn] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedColumn);
    setColumnOrder(newOrder);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null,
  );
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<
    Record<string, boolean>
  >({});
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRowData, setSelectedRowData] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>(
    {},
  );
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const { user } = useAuthStore.getState();
  const { data: salesPersonsList } = useGetSalesPersons(user?.dealershipId);
  const {
    isTableRowEditOpen,
    closeTableRowEdit,
    openTableRowEdit,
    openAssignDeal,
    isNotifySalesPersonOpen,
    closeNotifySalesperson,
    setCurrentModal,
  } = useModalStore();
  const { HideRotation, setCreatedDealId } = useDealStore();
  const {
    isFilterOpen,
    toggleFilterModal,
    openNewObjModal,
    openUsedObjModal,
    openFinanceObjModal,
  } = useModalStore();
  const userRole: string | undefined = useAuthStore(
    (state) => state.user?.role,
  );
  const inputId = useId();
  const currentModalConfig = getEditTableRowModalConfig()[currentPath];
  const isCustomerLogsRoute =
    userRole !== "MakeReady" &&
    (currentPath === ROUTES.DASHBOARD || currentPath === ROUTES.CUSTOMER_LOG);
  const isGMOnAllowedRoute =
    userRole === "GeneralManager" && currentPath === ROUTES.MANAGERS_OVERVIEW;
  const isSalesManagerOnAllowedRoute =
    userRole === "SalesManager" && currentPath === ROUTES.SALESPERSON;
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  const userId = user?.id ? BigInt(user.id) : undefined;
  const dealershipId: string | undefined = user?.dealershipId?.toString();
  const companyId: string | undefined = user?.companyId?.toString();
  const headerName = getConstantNameByHeaders(headers);

  const {
    data: tableConfig,
    isLoading: isConfigurationLoading,
    isError: isConfigurationError,
  } = useTableConfig({
    userId: user?.id ?? "",
    headerKey: headerName ?? "",
    dealershipId: dealershipId ?? "",
    role: userRole,
  });

  useEffect(() => {
    if (tableConfig && tableConfig.length > 0) {
      const visibility: Record<string, boolean> = {};
      const order: string[] = [];
      const widths: Record<string, number> = {};

      tableConfig.forEach((column) => {
        visibility[column.key] = column.isShow;
        order.push(column.key);
        widths[column.key] = column.width;
      });

      setColumnVisibility(visibility);
      setColumnOrder(order);
      setColumnWidths(widths);
    } else {
      const initialVisibility = headers.reduce<Record<string, boolean>>(
        (acc, { key, checked }, index) => {
          if (
            (index < 8 || key === "actions") &&
            (checked === undefined || checked)
          )
            acc[key] = true;
          else acc[key] = false;
          return acc;
        },
        {},
      );

      const initialOrder = headers.map((header) => header.key);
      const initialWidths: Record<string, number> = headers.reduce<
        Record<string, number>
      >((acc, header) => {
        acc[header.key] = 200;
        return acc;
      }, {});

      setColumnVisibility(initialVisibility);
      setColumnOrder(initialOrder);
      setColumnWidths(initialWidths);
    }
  }, [tableConfig, headers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node),
      );
      if (clickedOutside) setShowDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (salesPersonsList)
      setFilterOptions((prev) => ({
        ...prev,
        salesperson: Array.isArray((salesPersonsList as any)?.data)
          ? (salesPersonsList as any).data.map(
              (emp: any) => `${emp.firstName} ${emp.lastName}`,
            )
          : [],
      }));
    setFilterOptions((prev) => ({
      ...prev,
      dealStatus: dealStatus,
      visitStatus: visitStatus,
      empStatus: empStatus,
      status: mrStatus,
      make: carMakes || [],
    }));
  }, [salesPersonsList, dealStatus, visitStatus, empStatus, carMakes]);

  useEffect(() => setLocalSearchQuery(searchQuery), [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        localSearchQuery !== searchQuery && onSearchChange(localSearchQuery),
      500,
    );
    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange, searchQuery]);

  const filterableHeaders = headers.filter((h) => h.filtered);

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? data.map((row) => row.id) : []);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key)
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key, direction: "asc" };
    });
  };

  const toggleColumnVisibility = (key: string) => {
    if (key === "actions" || key === "checkbox") return;
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    if (!columnOrder.includes(key)) {
      setColumnOrder([...columnOrder, key]);
    }
    setSettingsChanged(true);
  };

  const handleColumnDropdownToggle = () => {
    setShowColumnDropdown((prev) => !prev);
  };

  const toggleDropdown = (key: string) =>
    setFilterDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalSearchQuery(e.target.value);

  const handleChange = (index: number, value: number, key: string) => {
    const updated = [...objectiveData];
    updated[index][key] = value;
    setObjectiveData(updated);
  };

  const openTableRowEditModal = (data: any) => {
    setSelectedRowData(data);
    openTableRowEdit();
  };
  const AssignToFinance = (dealId: string) => {
    setCreatedDealId(dealId);
    HideRotation();
    openAssignDeal();
  };
  const { setViewingEmployee, isViewingOtherDashboard } =
    useViewingEmployeeStore();
  const navigate = useNavigate();

  function handleRowClick(row: Record<string, any>) {
    if (isCustomerLogsRoute) {
      openTableRowEditModal(row);
      return;
    }

    if (isGMOnAllowedRoute || isSalesManagerOnAllowedRoute) {
      const formattedTab =
        selectedTab && selectedTab === "SalesPerson"
          ? "Sales Persons"
          : selectedTab;

      const roleData = formattedTab
        ? tabToRoleMap[formattedTab as keyof typeof tabToRoleMap]
        : undefined;

      if (!roleData) {
        console.warn("No role mapping found for selected tab:", selectedTab);
        return;
      }

      setViewingEmployee({
        id: row.id,
        role: roleData.role ?? "",
        name: row.FullName || row.name,
      });
      navigate({ to: roleData.route });
    }
  }

  const [modalData, setModalData] = React.useState<{
    id: number;
    type: "make-ready" | "customer";
  } | null>(null);

  const resetColumnVisibility = () => {
    setColumnVisibility(initialColumnVisibility);
    setColumnOrder(headers.map((header) => header.key));

    const initialWidths: Record<string, number> = headers.reduce<
      Record<string, number>
    >((acc, header) => {
      acc[header.key] = 0;
      return acc;
    }, {});

    setColumnWidths(initialWidths);

    setSearchTerm("");
    setSettingsChanged(true);
    setShowColumnDropdown(false);
  };

  const saveSettings = async () => {
    setIsSettingsSaved(true);

    const payload = {
      tableHeaderKey: headerName ?? "",
      columns: columnOrder
        .map((key, index) => {
          const header = headers.find((h) => h.key === key);
          if (header) {
            return {
              label: header.label,
              key: key,
              isShow: columnVisibility[key],
              order: index,
              width:
                typeof columnWidths[key] === "number"
                  ? columnWidths[key]
                  : parseFloat(columnWidths[key]) || 9,
            };
          }
          return null;
        })
        .filter((column) => column !== null),
    };

    try {
      if (userId === undefined) {
        console.error("User ID is undefined. Cannot save table configuration.");
        return;
      }

      await upsertTableConfig(userId, dealershipId, payload, userRole);
      queryClient.invalidateQueries({ queryKey: ["tableConfig"] });
      toast.success("Table configuration saved successfully");
      await queryClient.invalidateQueries({ queryKey: ["tableConfig"] });
    } catch (error) {
      toast.error("Error while updating table configurations");
      console.error("Error saving table configuration:", error);
    } finally {
      setIsSettingsSaved(false);
      setSettingsChanged(false);
      setShowColumnDropdown(false);
    }
  };

  const filteredHeaders = headers.filter((header) =>
    header.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const modalActions: Record<string, () => void> = {
    New: openNewObjModal,
    Used: openUsedObjModal,
    Finance: openFinanceObjModal,
  };
  const handleNotify = async () => {
    closeNotifySalesperson();
  };

  const { mutate: uploadCsv } = useUploadDealershipCsv();

  const handleCSVUpload = (
    file: File,
    dealershipId: string,
    companyId: string,
  ) => {
    uploadCsv({ file, dealershipId, companyId });
  };
  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: any,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleCSVUpload(files[0], row.id, row.companyId);
    }
  };
  const { mutate: downloadCsv } = useDownloadDealershipCsv();

  const handleCsvDownload = (csvKey: string, originalFileName: string) => {
    downloadCsv({ csvKey, originalFileName });
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (localSearchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [localSearchQuery]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full flex-col   ">
        <div className="flex items-center justify-between gap-2 px-4 py-[0.75rem]  overflow-visible">
          {showSearchBox ? (
            <React.Fragment>
              <div className="flex gap-4">
                <div className="relative mt-[1.4rem] ">
                  {!isLoading &&
                    !isConfigurationLoading &&
                    !isError &&
                    data.length > 0 && (
                      <CustomButton
                        text={settingsChanged ? "Save" : "Settings"}
                        variant="contained"
                        disabled={isSettingsSaved}
                        onClick={
                          settingsChanged
                            ? saveSettings
                            : handleColumnDropdownToggle
                        }
                        icon={
                          !settingsChanged && (
                            <img
                              src={SettingsIcon}
                              alt="plus icon"
                              className="w-4"
                            />
                          )
                        }
                      />
                    )}

                  {showColumnDropdown && (
                    <div className="absolute left-0 z-[50] max-h-[20rem] w-[15rem] overflow-y-auto rounded-md bg-white shadow-md">
                      <input
                        type="text"
                        className="border-rounded text-md m-2 w-[12.7rem] flex-1 border bg-transparent p-2 text-sm text-gray-500 outline-none placeholder:text-gray-400"
                        placeholder="Search columns"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <div className="max-h-[15rem] space-y-2 overflow-y-auto px-3 py-2">
                        <button
                          onClick={resetColumnVisibility}
                          className="w-full rounded-md py-2 text-center text-sm text-blue-500 hover:bg-gray-100"
                        >
                          Restore Defaults
                        </button>

                        {filteredHeaders.map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-gray-100"
                            onClick={() => toggleColumnVisibility(key)}
                          >
                            <span className="text-gray-700">{label}</span>
                            <input
                              type="checkbox"
                              checked={columnVisibility[key]}
                              className="h-4 w-4"
                              disabled={key === "actions" || key === "checkbox"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-full">
                {searchBoxPlaceholder && (
                  <div className="mt-6 flex w-full max-w-md items-center rounded-[0.25rem] border border-shark-200 bg-white px-3 py-2">
                    <span className="text-sm text-shark-200">
                      <img
                        src={SearchIcon}
                        alt="Search icon"
                        className="filter-gray h-5 w-5"
                      />
                    </span>
                    <input
                      type="text"
                      ref={inputRef}
                      className="ml-2 flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-400"
                      placeholder={searchBoxPlaceholder}
                      value={localSearchQuery}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                )}

                {button === "filter button" ? (
                  <div>
                    <div className="flex flex-wrap gap-4 sm:flex-row">
                      <CustomButton
                        onClick={toggleFilterModal}
                        text="Filters"
                        width="6rem"
                        variant="contained"
                        icon={
                          <img
                            src={`${WhiteAddIcon}`}
                            alt="More Icon"
                            className="w-4"
                          />
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex gap-4">
                {filterableHeaders.map(({ key, filterKey, label }) => {
                  const keyToDisplay = filterKey || key;
                  const placeholder =
                    filters[keyToDisplay] ??
                    (filterKey === "salesperson"
                      ? "Filter by Salesperson"
                      : `Filter by ${label}`);

                  return (
                    <div
                      key={key}
                      className={`relative ${key === "startDate" || key === "endDate" ? "w-[150px]" : "w-[219px]"}`}
                      ref={(el) => {
                        dropdownRefs.current[key] = el;
                      }}
                    >
                      {key !== "startDate" && key !== "endDate" ? (
                        <div
                          className={`mt-6 flex cursor-pointer items-center rounded-[0.25rem] px-3 py-3 ${
                            filters[keyToDisplay]
                              ? "border border-[#3455DB] bg-[#EBF2FF]"
                              : "bg-shark-100"
                          } `}
                          onClick={() => {
                            toggleDropdown(key);
                            setShowDropdown((prev) =>
                              prev === key ? null : key,
                            );
                          }}
                        >
                          <span
                            className={`flex-1 text-xs ${
                              filters[keyToDisplay]
                                ? "font-medium text-[#3455DB]"
                                : "text-shark-500"
                            } `}
                          >
                            {placeholder}
                          </span>
                          <span className="text-sm text-shark-300">
                            <img
                              src={
                                showDropdown === key ? CloseIcon : DropDownIcon
                              }
                              alt={
                                showDropdown === key
                                  ? "Close filter"
                                  : "Open filter"
                              }
                              className="filter-gray h-4 w-4"
                            />
                          </span>
                        </div>
                      ) : (
                        <div>
                          {" "}
                          {label && (
                            <label
                              htmlFor={inputId}
                              className="mb-2 text-sm font-normal text-shark-500"
                            >
                              {label}
                            </label>
                          )}
                          <div
                            className={`p-1 ${
                              filters[keyToDisplay]
                                ? "border border-[#3455DB] bg-[#EBF2FF]"
                                : "border border-shark-200 bg-shark-50"
                            }`}
                          >
                            <input
                              className={`appearance-none rounded px-1 py-1 text-sm outline-none focus:border-transparent focus:outline-none focus:ring-0 ${filters[keyToDisplay] ? "bg-[#EBF2FF]" : "bg-shark-50"}`}
                              type="date"
                              value={filters[keyToDisplay] || ""}
                              onChange={(e) => {
                                onFilterChange(keyToDisplay, e.target.value);
                                setShowDropdown(null);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {showDropdown === key && (
                        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md bg-white shadow-md">
                          {
                            <ul className="max-h-[20rem] overflow-y-auto">
                              <li
                                className="cursor-pointer px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                                onClick={() => {
                                  onFilterChange(keyToDisplay, null);
                                  setShowDropdown(null);
                                }}
                              >
                                Clear Filter
                              </li>

                              {(key === "businessMonth"
                                ? productionBusinessMonth
                                : filterOptions[filterKey || key] || []
                              ).map((option) => {
                                const isActive =
                                  filters[keyToDisplay] === option;
                                return (
                                  <li
                                    key={option}
                                    className={`cursor-pointer px-3 py-2 text-sm ${
                                      isActive
                                        ? "bg-[#E3E9FF] font-medium text-[#3455DB]"
                                        : "text-gray-700 hover:bg-gray-100"
                                    } `}
                                    onClick={() => {
                                      onFilterChange(keyToDisplay, option);
                                      setShowDropdown(null);
                                    }}
                                  >
                                    {option}
                                  </li>
                                );
                              })}
                            </ul>
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ) : (
            <></>
          )}
        </div>

        <div className="flex-1 overflow-hidden px-2 py-2">
          {isLoading && isConfigurationLoading && (
            <div className="flex h-full items-center justify-center">
              <FullPageLoader />
            </div>
          )}
          {isError && isConfigurationError && (
            <div className="py-8 text-center text-red-500">
              Failed to load data.
            </div>
          )}
          {!isLoading &&
            !isConfigurationLoading &&
            !isError &&
            data.length === 0 &&
            (userRole === "GeneralManager" ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="text-gray-500">No data to show.</div>
                <div className="text-gray-500">
                  Please Set {selectedTab} Objective.
                </div>
                <button
                  className="mb-10 mt-3 w-fit rounded-md bg-[#F0F4FE] px-3 py-1 text-[14px] font-normal text-[#3455DB] transition hover:bg-white/20"
                  onClick={selectedTab ? modalActions[selectedTab] : undefined}
                >
                  <span className="mr-1 text-base">＋</span> {selectedTab}{" "}
                  objective
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No data found.
              </div>
            ))}

          {data.length > 0 && (
            <div className="h-full overflow-auto max-h-[40vh]">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-20 bg-white shadow-sm">
                  {/*TODO: duplicate action buttons*/}
                  <tr>
                    {columnOrder.map((columnKey, index) => {
                      const header = headers.find((h) => h.key === columnKey);
                      if (!header) return null;

                      if (!columnVisibility[header.key]) return null;

                      if (header.key === "checkbox") {
                        return (
                          <th key={header.key} className="px-3 py-4">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-orange-600"
                              checked={selectAll}
                              onChange={toggleSelectAll}
                            />
                          </th>
                        );
                      }

                      return (
                        // TODO: duplicate action buttons
                        <React.Fragment key={header.key}>
                          {!header.hidden && (
                            <th
                              className="relative"
                              style={{
                                width: columnWidths[header.key],
                              }}
                            >
                              <DraggableHeader
                                id={header.key}
                                label={header.label}
                                index={index}
                                moveColumn={moveColumn}
                                color={color}
                                handleSort={handleSort}
                                headerKey={header.key}
                                setDraggingColumn={setDraggingColumn}
                                columnVisibility={columnVisibility}
                                setSettingsChanged={setSettingsChanged}
                              />
                              <Resizer
                                headerKey={header.key}
                                onResize={handleColumnResize}
                              />
                            </th>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? rowColor : "white",
                      }}
                    >
                      {columnOrder.map((columnKey) => {
                        const header = headers.find((h) => h.key === columnKey);
                        if (!header || header.hidden) return null;
                        const { key, status, editable, isCurrency } = header;
                        if (key === "checkbox") {
                          return (
                            <td key={key} className="px-3 py-2">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-center text-orange-600"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => toggleRowSelection(row.id)}
                              />
                            </td>
                          );
                        }

                        if (!columnVisibility[key]) return null;

                        if (
                          key === "actions" &&
                          currentPath === ROUTES.INVOICES &&
                          userRole !== "Accountant"
                        ) {
                          return (
                            <td key={key} className="px-3 py-2">
                              <Link
                                to={ROUTES.INVOICE_DETAIL}
                                params={{ id: row.dealershipDealNo }}
                                className="text-sm underline"
                                style={{ color }}
                              >
                                View
                              </Link>
                            </td>
                          );
                        }

                        if (
                          key === "actions" &&
                          [ROUTES.DASHBOARD, ROUTES.INVOICES].includes(
                            currentPath,
                          ) &&
                          userRole !== "Admin"
                        ) {
                          return (
                            // TODO: duplicate action buttons
                            <td key={key} className="px-3 py-2">
                              <CustomButton
                                text={
                                  userRole === "SalesPerson" ||
                                  userRole?.startsWith("Finance")
                                    ? "View"
                                    : "Edit"
                                }
                                variant="outlined"
                                onClick={() => openTableRowEditModal(row)}
                                width="min-w-[5rem]"
                                disabled={isViewingOtherDashboard}
                              />
                            </td>
                          );
                        }

                        if (
                          key === "actions" &&
                          currentPath === ROUTES.NOTIFICATIONS
                        ) {
                          return (
                            <td key={key} className="px-3 py-2">
                              <NotificationTableAction
                                notification={{
                                  id: row.id,
                                  entityId: row.entityId,
                                  notificationType: row.notificationType,
                                }}
                                onModalOpen={setModalData}
                              />
                            </td>
                          );
                        }

                        if (key === "actions" && userRole === "Admin") {
                          return (
                            <td
                              key={key}
                              className="flex items-center gap-2 px-3 py-2"
                            >
                              <input
                                type="file"
                                id={`csvUpload-${row.id}`}
                                accept=".csv"
                                onChange={(e) => handleFileInput(e, row)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`csvUpload-${row.id}`}
                                className="cursor-pointer"
                              >
                                <img src={UploadIcon} alt="Upload CSV" />
                              </label>
                              {row.csvS3Key && (
                                <button
                                  onClick={() =>
                                    handleCsvDownload(
                                      row.csvS3Key,
                                      row.csvOriginalFileName,
                                    )
                                  }
                                  className="cursor-pointer border-none bg-transparent"
                                >
                                  <img src={DownloadIcon} alt="Download CSV" />
                                </button>
                              )}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={key}
                            className={`font-inter px-3 py-[0.85rem] text-[0.875rem] text-[#666b74] ${isGMOnAllowedRoute || isCustomerLogsRoute || isSalesManagerOnAllowedRoute ? "cursor-pointer" : ""}`}
                            onClick={() => handleRowClick(row)}
                          >
                            {status && headers[0].key !== "Variable" ? (
                              getStatusBadge(row[key])
                            ) : editField && editable ? (
                              <TextField
                                type="text"
                                border="border-shark-100"
                                variant="contained"
                                hideFocusedLabel
                                value={String(row[key])}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    parseInt(e.target.value) || 0,
                                    key,
                                  )
                                }
                              />
                            ) : (
                              <span className="whitespace-pre-line">
                                {Array.isArray(row[key]) ? (
                                  row[key].join("\n")
                                ) : row[key] !== null &&
                                  row[key] !== undefined &&
                                  row[key] !== "" ? (
                                  isCurrency ? (
                                    <CurrencyLabel
                                      value={Number(row[key])}
                                      fractionDigits={2}
                                    />
                                  ) : (
                                    row[key]
                                  )
                                ) : (
                                  " "
                                )}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {currentModalConfig && isTableRowEditOpen && selectedRowData && (
          <Modal
            isOpen={isTableRowEditOpen}
            onClose={() => {
              closeTableRowEdit();
            }}
            title={currentModalConfig.title}
          >
            <currentModalConfig.Component
              data={selectedRowData}
              setData={setFormData}
            />
          </Modal>
        )}

        {modalData && (
          <NotificationDetailsModal
            id={modalData.id}
            type={modalData.type}
            onClose={() => setModalData(null)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default DataTable;
