import React, { useState } from "react";
import { ROUTES } from "@/common/routes";
import { useNavigate } from "@tanstack/react-router";
import { getStatusBadge } from "@/common/utils/getStatusBadge";
import colors from "@/common/constants/tailwind-colors";
import { useAuthStore } from "@/features/auth/stores/authStore";
import Modal from "@/common/components/modal/NewModal";
import AccountantDealEdit from "@/features/invoice/components/AccountantDealEdit";
import { Deal, MakeReadyEntity } from "@/core/entities";
import { CustomerVisitEntity } from "@/core/entities/customer-visit";

interface Props {
  data: Deal[] | MakeReadyEntity[] | CustomerVisitEntity[];
  setIsOpen: (value: boolean) => void;
}

interface ModalConfig {
  title: string;
  Component: React.ComponentType<{ data: Deal }>;
  data: Deal | MakeReadyEntity | CustomerVisitEntity;
}

const getHeadersByRole = (role) => {
  const configs = {
    Receptionist: [
      { key: "createdAt", label: "Created At" },
      { key: "visitStatus", label: "Visit Status" },
      { key: "customerName", label: "Customer" },
      { key: "phone", label: "Phone" },
      { key: "source", label: "Source" },
      { key: "assignedSalespersonName", label: "Assigned Salesperson" },
    ],
    MakeReady: [
      { key: "createdAt", label: "Created At" },
      { key: "dealStatus", label: "Deal Status" },
      { key: "customerName", label: "Customer" },
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "salesperson1", label: "Salesperson" },
    ],
    default: [
      { key: "dealershipDealNo", label: "Deal#" },
      { key: "dealDate", label: "Deal Date" },
      { key: "dealStatus", label: "Deal Status" },
      { key: "stock", label: "Stock#" },
      { key: "salesperson1", label: "Salesperson" },
      { key: "customer", label: "Customer" },
    ],
  };

  return configs[role] || configs.default;
};

export const getRowClickConfig = () => {
  return {
    default: {
      action: "navigate",
      route: ROUTES.INVOICE_DETAIL,
      getParams: (row) => ({ id: row.dealershipDealNo }),
    },
    Accountant: {
      action: "modal",
      title: "Edit Deal",
      Component: AccountantDealEdit,
    },
  };
};

const GlobalSearchedDeals: React.FC<Props> = ({ data, setIsOpen }) => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = getRowClickConfig();
  const role = useAuthStore((state) => state.user?.role?.toString() ?? "");
  const actionConfig = config[role] || config.default;
  const headers = getHeadersByRole(role);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    if (actionConfig.action === "navigate") {
      const params = actionConfig.getParams
        ? actionConfig.getParams(row)
        : { id: row.dealershipDealNo };
      navigate({ to: actionConfig.route, params });
      setIsOpen(false);
    } else if (actionConfig.action === "modal") {
      setModalConfig({
        title: actionConfig.title,
        Component: actionConfig.Component,
        data: row,
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem] px-[2.25rem] py-[0.5rem]">
      <div className="flex flex-col gap-[0.5rem]">
        {data.length > 0 && (
          <div className="flex gap-[1.25rem] rounded-md px-[1rem] py-[1rem]">
            <div className="max-h-[16rem] w-full gap-2.5 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#fcfcfc]">
                  <tr>
                    {headers.map(({ key, label }) => (
                      <th
                        key={key}
                        className="cursor-pointer px-[1.5rem] py-4 text-cerulean-600"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-cerulean-600">
                            {label}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          index % 2 === 0 ? colors.oldlace[50] : "white",
                      }}
                    >
                      {headers.map(({ key }) => {
                        const isStatusKey = [
                          "dealStatus",
                          "visitStatus",
                        ].includes(key);
                        const content = isStatusKey
                          ? getStatusBadge(row[key])
                          : row[key] || "N/A";

                        return (
                          <td
                            key={key}
                            className="font-inter cursor-pointer px-3 py-[0.85rem] text-[0.875rem] text-shark-500"
                            onClick={() => handleRowClick(row)}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalConfig && selectedRow && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalConfig.title}
        >
          <modalConfig.Component data={selectedRow} />
        </Modal>
      )}
    </div>
  );
};

export default GlobalSearchedDeals;
