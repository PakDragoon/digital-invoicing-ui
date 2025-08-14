import { WhiteAddIcon } from "@/assets";
import React from "react";
import CustomButton from "../../buttons/CustomButton";
import { SalesTypes } from "@/common/components/salesFilterBar/types";
import { useSalesTypeStore } from "@/common/components/salesFilterBar/store";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { toast } from "react-toastify";

const SalesPersonHeader: React.FC = () => {
  const { selectedSalesType, setSelectedSalesType } = useSalesTypeStore();

  const getTabButtonClass = (isSelected: boolean) => {
    return `px-3 py-1 text-[15px] font-medium transition-all h-full ${
      isSelected
        ? "text-cerulean-700 border-b-[1px] border-cerulean-700 bg-cerulean-100"
        : "text-shark-500 hover:text-blue-600"
    }`;
  };
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-full w-full border-b border-gray-200 bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex h-full space-x-4">
          {SalesTypes.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedSalesType(tab)}
              className={`h-full px-3 py-1 text-[15px] font-medium transition-all ${getTabButtonClass(selectedSalesType.value === tab.value)}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CustomButton
          text="Add Customer"
          variant="contained"
          onClick={() => {
            if (user?.status !== "1") {
              toast.info('Please update your status to "Available"');
              return;
            }
          }}
          icon={<img src={WhiteAddIcon} alt="plus icon" />}
        />
      </div>
    </header>
  );
};

export default SalesPersonHeader;
