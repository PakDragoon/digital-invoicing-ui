import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { generateBusinessMonthMap } from "@/common/utils/businessMonthMapper";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { dealService } from "@/features/invoice/services/dealApi";
import { Deal } from "@/features/invoice/types/deal-types";

import {
  DealConfig,
  InvoiceFormData,
  initialFormData,
  useSalespersonOptions,
} from "../deal-form/CreateDealFieldConfig";
import { buildFormDataFromResult } from "../utils/dealUtils";
import { useDebounceEffect } from "../hooks/dealHook";
import DealForm from "@/common/components/forms/DealForm";
import { useModalStore } from "@/common/components/modal/store/modalStore";
import { useDealStore } from "../store/dealStore";
import { sanitizePhoneNumber } from "@/common/utils/cleanPhoneNumber";
import { toast } from "react-toastify";

interface Props {}
const CreateDealForm: React.FC<Props> = ({}) => {
  const token = useAuthStore((state) => state.accessToken);
  const { user } = useAuthStore.getState();
  const { reset } = useForm({
    mode: "onChange",
    defaultValues: {
      ...initialFormData,
    },
  });

  const { setCreatedDealId } = useDealStore();
  const companyId: string = user!.companyId!.toString();
  const [deal, setDeal] = useState<Deal | null>(null);
  const businessMonthMap = generateBusinessMonthMap(7);
  const salespersonOptions = useSalespersonOptions();
  const dealFields = DealConfig.fields.deal(salespersonOptions);
  const vehicleFields = DealConfig.fields.vehicle();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const tradeFields = DealConfig.fields.trade();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [dealershipDealNo, setDealershipDealNo] = useState("");
  const [fetchedDealData, setFetchedDealData] =
    useState<InvoiceFormData>(initialFormData);
  const {
    setCurrentModal,
    toggleDisableModalButton,
    openAssignDeal,
    closeCreateDealModal,
  } = useModalStore();
  const { DisplayRotation } = useDealStore();

  const fetchDealData = async (
    dealNo: string,
    companyId: string,
    token: string,
  ) => {
    try {
      const existingDealData = await dealService.fetchExistingDeal(
        dealNo,
        companyId,
        token,
      );
      if (existingDealData.status !== 500) {
        setCurrentModal("existingDeal");
        return null;
      }
      const result = await dealService.fetchDealData(
        dealNo,
        companyId,
        token,
      );
      return result;
    } catch (error) {
      console.error("Error fetching deal data:", error);
      return null;
    }
  };

  const fetchSalespersonData = async (
    salespersonId: string,
    companyId: string,
    token: string,
  ) => {
    if (!salespersonId) return null;
    try {
      return await dealService.getRelaySalesperson(
        salespersonId,
        companyId,
        token,
      );
    } catch (error) {
      console.error("Error fetching salesperson:", error);
      return null;
    }
  };
  const checkAndFetchDeal = async () => {
    if (dealershipDealNo && dealershipDealNo.length > 2) {
      try {
        setIsFetchingData(true);
        const result = await fetchDealData(
          dealershipDealNo,
            companyId,
          token ?? "",
        );

        setDeal(result);

        const [RelaySalesperson1, RelaySalesperson2] = await Promise.all([
          fetchSalespersonData(result?.salesperson1, companyId, token ?? ""),
          fetchSalespersonData(result?.salesperson2, companyId, token ?? ""),
        ]);

        if (result?.dealershipDealNo) {
          const data = buildFormDataFromResult(
            result,
            RelaySalesperson1,
            RelaySalesperson2,
          );
          setFetchedDealData({
            ...initialFormData,
            ...data,
          });
        }
      } catch (error) {
        console.error("Error in check and fetch deal flow:", error);
      } finally {
        setIsFetchingData(false);
      }
    }
  };
  useDebounceEffect(
    () => {
      checkAndFetchDeal();
    },
    [companyId, token, reset, dealershipDealNo],
    1000,
  );

  const onSubmit = async (data: any) => {
    try {
      toggleDisableModalButton();
      setLoadingStates((prev) => ({
        ...prev,
        save: true,
        sendToFinance: true,
      }));
      return createDeal(data);
    } catch (error) {
      console.error("Deal creation failed ", error);
    } finally {
      toggleDisableModalButton();
      setLoadingStates((prev) => ({
        ...prev,
        save: false,
        sendToFinance: false,
      }));
    }
  };

  const createDeal = async (data: any) => {
    const created_deal = await dealService.saveDeal(
      {
        ...data,
        salesperson1: data.salesperson1.id,
        salesperson2: data.salesperson2?.id,
        businessMonth:
          data.businessMonth || (businessMonthMap[data.businessMonth] ?? ""),
        customerPhone:
          deal?.homePhone && deal.homePhone.trim() !== ""
            ? sanitizePhoneNumber(deal.homePhone)
            : data?.customerPhone
              ? sanitizePhoneNumber(data.customerPhone)
              : "",
      },
      token!,
    );

    if (created_deal) {
      setCurrentModal("dealCreated");
      setCreatedDealId(created_deal.id);
    }
  };

  const sendToFinance = async (data: any) => {
    try {
      const sanitizedPhone =
        deal?.homePhone && deal.homePhone.trim() !== ""
          ? sanitizePhoneNumber(deal.homePhone)
          : data?.customerPhone
            ? sanitizePhoneNumber(data.customerPhone)
            : "";

      if (!sanitizedPhone) {
        toast.error("Customer phone number is required to send to finance.");
        return;
      }
      DisplayRotation();
      toggleDisableModalButton();
      setLoadingStates((prev) => ({
        ...prev,
        save: true,
        sendToFinance: true,
      }));
      let created_deal;
      created_deal = await dealService.saveDeal(
        {
          ...data,
          salesperson1: data.salesperson1.id,
          salesperson2: data.salesperson2?.id,
          businessMonth:
            data.businessMonth || (businessMonthMap[data.businessMonth] ?? ""),
          customerPhone: sanitizedPhone,
        },
        token!,
      );

      if (created_deal) {
        setCreatedDealId(created_deal.id);
        closeCreateDealModal();
        openAssignDeal();
      }
    } catch (error) {
      console.error("Deal creation failed ", error);
    } finally {
      toggleDisableModalButton();
      setLoadingStates((prev) => ({
        ...prev,
        save: false,
        sendToFinance: false,
      }));
    }
  };

  return (
    <React.Fragment>
      {isFetchingData ? (
        <div className="relative">
          <div className="semibold-text-sm absolute right-[2.5rem] top-[2.5rem] text-cerulean-600">
            Fetching data...
          </div>
        </div>
      ) : null}

      <DealForm
        dealFields={dealFields}
        tradeFields={tradeFields}
        vehicleFields={vehicleFields}
        initialFormData={initialFormData}
        loading={loadingStates}
        setDealershipDealNo={setDealershipDealNo}
        populatedData={fetchedDealData}
        buttons={[
          {
            key: "save",
            idleText: "Save Deal",
            loadingText: "Saving Deal...",
            onClick: onSubmit,
            variant: "outlined",
            popup: "Fill the Required Fields!",
          },
          {
            key: "sendToFinance",
            idleText: "Send To Finance ",
            onClick: sendToFinance,
            variant: "contained",
            popup: "Fill the Required Fields!",
          },
        ]}
      />
    </React.Fragment>
  );
};

export default CreateDealForm;
