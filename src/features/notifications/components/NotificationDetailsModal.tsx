import React, { useEffect } from "react";
import { customerVisitApi, makeReadyApi } from "../services/notificationApi";
import Modal from "@/common/components/modal/NewModal";
import { useAuthStore } from "@/features/auth/stores/authStore";

type Props = {
  type: "customer" | "make-ready";
  id: number | string;
  onClose: () => void;
};

const NotificationDetailsModal: React.FC<Props> = ({ type, id, onClose }) => {
  const { user } = useAuthStore.getState();
  const companyId = user?.companyId;
  const [modalData, setModalData] = React.useState(null);

  useEffect(() => {
    if (!id || !type) return;
    void fetchData(); // explicitly handle promise

    async function fetchData() {
      const idStr = String(id);
      try {
        const response =
          type === "make-ready"
            ? await makeReadyApi.getMakeReadyById(idStr, companyId!)
            : await customerVisitApi.getVisitById(idStr, companyId!);

        if (response?.data) {
          setModalData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      }
    }
  }, [id, type]);

  const renderModalContent = () => {
    if (!modalData) return null;

    return null;
  };

  return (
    <Modal
      isOpen={!!modalData}
      onClose={onClose}
      title={`Edit ${type === "make-ready" ? "Make-Ready" : "Customer"}`}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default NotificationDetailsModal;
