import React from "react";
import { Add, WhiteAddIcon } from "../../../assets/index";
import CustomButton from "../buttons/CustomButton";
import Modal from "../modal/NewModal";
import DealCreate from "@/features/invoice/components/DealCreate";
import { useModalStore } from "../modal/store/modalStore";
import { useDealStore } from "@/features/invoice/store/dealStore";
import { useSalesTypeStore } from "@/common/components/salesFilterBar/store";
import { SalesTypes } from "@/common/components/salesFilterBar/types";
import { AssignDealToFin } from "@/features/invoice/components/AssignToF&I";

const SalesHeader: React.FC = () => {
  const {
    isCreateDealOpen,
    isMakeReadyOpen,
    openCreateDealModal,
    closeCreateDealModal,
    openMakeReadyModal,
    isAssigDealToFinOpen,
    closeAssignDeal,
  } = useModalStore();
  const { setCreatedDealId } = useDealStore();
  const { selectedSalesType, setSelectedSalesType } = useSalesTypeStore();

  React.useEffect(() => {
    if (!isMakeReadyOpen) {
      setCreatedDealId("");
    }
  }, [isMakeReadyOpen]);

  return (
    <div className="flex h-full items-center justify-between border-b border-gray-200 bg-white pl-[1.5rem] pr-[1.5rem]">
      <div className="flex h-full space-x-4">
        {SalesTypes.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedSalesType(tab)}
            className={`h-full px-3 py-1 text-[15px] font-medium transition-all ${
              selectedSalesType.value === tab.value
                ? "border-b-[1px] border-cerulean-700 bg-cerulean-100 text-cerulean-700"
                : "text-shark-500 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <div>
          <CustomButton
            text="Create Make Ready"
            variant="outlined"
            onClick={openMakeReadyModal}
            icon={<img src={Add} alt="plus icon" />}
          />
        </div>

        <div>
          <CustomButton
            text="Create a Deal"
            variant="contained"
            onClick={openCreateDealModal}
            icon={<img src={WhiteAddIcon} alt="plus icon" />}
          />
        </div>
      </div>

      {/* Deal Modal */}
      <Modal
        isOpen={isCreateDealOpen}
        onClose={closeCreateDealModal}
        title="Create a Deal"
      >
        <DealCreate />
      </Modal>

      <Modal
        isOpen={isAssigDealToFinOpen}
        onClose={closeAssignDeal}
        title="Assign Deal to F&I(Create)"
        widthClass="w-[630px]"
      >
        <AssignDealToFin />
      </Modal>
    </div>
  );
};

export default SalesHeader;
