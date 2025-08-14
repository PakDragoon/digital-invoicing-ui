import React, { useState } from "react";
import AccountantDealForm from "@/common/components/forms/AccountantDealForm";
import {
  DealConfig,
  DealFormData,
  initialData,
} from "../deal-form/AccountantDealFieldsConfig";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { dealService } from "@/features/invoice/services/dealApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntityType } from "@/common/constants/comment";
import { useModalStore } from "@/common/components/modal/store/modalStore";
import { Deal } from "@/core/entities";

interface Props {
  data: Partial<DealFormData>;
  onClose?: () => void;
}

const EditDeal: React.FC<Props> = ({ data, onClose }) => {
  const { role } = useAuthStore((state) => state.user);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const dealEditFields = DealConfig.fields.deal([], true);
  const dealershipId: string = useAuthStore(
    (state) => state.user?.dealershipId?.toString() ?? "",
  );
  if (!data?.id) return null;
  const dealId = data.id.toString();
  const dealNo = data?.dealershipDealNo;
  const initialFormData = initialData(dealNo ?? "", data);
  const [accountingStatus, setAccountingStatus] = useState<string>(
    initialFormData.accountingStatus!,
  );
  const { closeTableRowEdit } = useModalStore();
  const queryClient = useQueryClient();
  const updateDealStatusMutation = useMutation({
    mutationFn: ({ status, comment }) =>
      dealService.updateAccountingStatus({
        dealId,
        dealershipId,
        status,
        comment,
      }),
    onSuccess: (updatedData) => {
      setAccountingStatus(updatedData.accountingStatus);
      queryClient.invalidateQueries({
        queryKey: ["/deal/tab/finance-complete"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/deal/tab/returned-in-accounting"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getComments"],
      });

      queryClient.setQueryData(
        ["getDealByDealNo", data.dealershipDealNo],
        (oldData?: Deal) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            dealStatus: updatedData.dealStatus,
          };
        },
      );

      toast.success("Accounting status updated successfully!");
      closeTableRowEdit();
      if (onClose) onClose();
    },

    onError: () =>
      toast.error("Unable to update accounting status, try again."),
    onSettled: () =>
      setLoadingStates((prev) => ({
        ...prev,
        financeReturned: false,
        completed: false,
        save: false,
      })),
  });

  const onSubmit = async (data, status) => {
    setLoadingStates((prev) => ({
      ...prev,
      financeReturned: true,
      completed: true,
    }));
    updateDealStatusMutation.mutate({ status, comment: data.comment });
  };

  const updateDealCommentMutation = useMutation({
    mutationFn: ({ comment }) =>
      dealService.saveComment(EntityType.Deal, dealId, comment),
    onSuccess: () => {
      toast.success(`Comment added successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["getComments"],
      });
    },
    onError: () => toast.error("Unable to save comment, try again."),
    onSettled: () =>
      setLoadingStates((prev) => ({
        ...prev,
        financeReturned: false,
        completed: false,
        save: false,
      })),
  });

  const onCommentSubmit = async (data) => {
    setLoadingStates((prev) => ({
      ...prev,
      financeReturned: true,
      completed: true,
      save: true,
    }));

    updateDealCommentMutation.mutate({ comment: data.comment });
  };

  return (
    <AccountantDealForm
      dealId={dealId}
      dealNo={dealNo}
      accountingStatus={accountingStatus}
      dealFields={dealEditFields}
      initialFormData={initialFormData}
      loading={loadingStates}
      dealStatus={data.dealStatus === "Finalized"}
      buttons={[
        {
          key: "accountingReturned",
          idleText: "Return to Accounting",
          loadingText: "Returning Deal...",
          onClick: (data) => onSubmit(data, "ReturnedToAccounting"),
          variant: "outlined",
          disabled: data.dealStatus === "Finalized",
          hidden: role === "Accountant",
        },
        {
          key: "save",
          idleText: "Save",
          loadingText: "Saving...",
          onClick: (data) => onCommentSubmit(data),
          variant: "outlined",
          disabled: data.dealStatus === "Finalized",
        },
        {
          key: "financeReturned",
          idleText: "Return to Finance",
          loadingText: "Returning Deal...",
          onClick: (data) => onSubmit(data, "ReturnedToFinance"),
          variant: "outlined",
          disabled: data.dealStatus === "Finalized",
          hidden:
            role === "FinanceManager" ||
            (data.dealStatus !== "FinanceComplete" &&
              data.dealStatus !== "FinanceReturned"),
        },
        {
          key: "completed",
          idleText: "Completed",
          loadingText: "Completing Deal...",
          onClick: (data) => onSubmit(data, "Completed"),
          variant: "contained",
          disabled: data.dealStatus === "Finalized",
        },
      ]}
    />
  );
};

export default EditDeal;
