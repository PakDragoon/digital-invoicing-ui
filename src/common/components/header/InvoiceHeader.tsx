import React from "react";
import { WhiteAddIcon } from "../../../assets";
import CustomButton from "../buttons/CustomButton";
import Modal from "../modal/NewModal";
import InvoiceCreate from "@/features/invoice/components/InvoiceCreate";
import { useModalStore } from "../modal/store/modalStore";

const InvoiceHeader: React.FC = () => {
  const {
    isCreateDealOpen,
    openCreateDealModal,
    closeCreateDealModal,
  } = useModalStore();

  return (
    <div className="flex h-full items-center justify-between border-b border-gray-200 bg-white pl-[1.5rem] pr-[1.5rem]">
      <div className="flex h-full space-x-4">
        <h2 className="text-lg font-semibold text-gray-800">Digital Invoicing</h2>
      </div>

      <div className="flex space-x-2">
        <div>
          <CustomButton
            text="Send Invoice"
            variant="contained"
            onClick={openCreateDealModal}
            icon={<img src={WhiteAddIcon} alt="plus icon" />}
          />
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={isCreateDealOpen}
        onClose={closeCreateDealModal}
        title="Create Invoice"
        widthClass="w-[90vw] max-w-[1200px]"
      >
        <InvoiceCreate />
      </Modal>
    </div>
  );
};

export default InvoiceHeader;
