import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../buttons/CustomButton";
import DealInputField from "@/features/invoice/components/DealInputField";
import {
  DealFields,
  DealFormData,
} from "@/features/invoice/deal-form/AccountantDealFieldsConfig";
import { humanize } from "@/common/utils/humanize";
import { useDealDocuments } from "@/features/invoice/hooks";
import { useAuthStore } from "@/features/auth/stores/authStore";
import TextField from "@/common/components/inputs/CustomTextField";
import Modal from "@/common/components/modal/NewModal";
import MissingDocumentsForm from "@/common/components/forms/MissingDocumentsForm";
import ListComments from "@/features/comment/components/ListComments";
import { EntityType } from "@/common/constants/comment";
import DealDocumentForm from "./DealDocumentForm";
import { ButtonConfig } from "./DealForm";

interface Props {
  dealId: string;
  dealNo?: string;
  accountingStatus: string;
  dealFields: DealFields[];
  initialFormData: DealFormData;
  loading: Record<string, boolean>;
  buttons: ButtonConfig[];
  dealStatus: string;
}

const AccountantDealForm: React.FC<Props> = ({
  dealId,
  dealNo,
  accountingStatus,
  dealFields,
  initialFormData,
  loading,
  buttons,
  dealStatus,
}) => {
  const { user } = useAuthStore.getState();
  const userRole = user?.role;
  const companyId: string = useAuthStore(
    (state) => state.user?.companyId?.toString() ?? "",
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
    getValues,
    resetField,
  } = useForm({
    mode: "onChange",
    defaultValues: initialFormData,
  });
  const { data } = useDealDocuments(dealId, companyId);
  const dealDocuments = data || [];
  const formSections = [{ title: "Deal Information", fields: dealFields }];

  const wrappedButtons = buttons.map(
    ({ key, idleText, loadingText, onClick, variant, popup, hidden }) => ({
      key,
      text: loading[key] ? (loadingText ?? idleText) : idleText,
      variant,
      onClick: handleSubmit(async (data) => {
        await onClick(data);
        resetField("comment");
      }),
      disabled: loading[key],
      popup,
      hidden,
    }),
  );

  const handleMissingDocuments = (data: {
    allSelectedDocuments: { value: string; label: string }[];
  }) => {
    setIsOpen(false);
  };

  let isDisabled: (key: string, base: boolean) => boolean;

  if (userRole === "Accountant") {
    isDisabled = (key: string, base: boolean) => {
      if (key === "accountingReturned") return true;
      return base || !isValid;
    };
  } else if (
    ["FinanceManager", "FinanceDirector", "FinanceAssistant"].includes(
      userRole ?? "",
    )
  ) {
    isDisabled = (key: string, base: boolean) => {
      if (key !== "accountingReturned" && key !== "save") return true;
      return base;
    };
  }
  isDisabled = (key: string, base: boolean) => {
    if (key === "financeReturned") {
      return base || !isValid;
    }
    return base;
  };

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        {formSections.map(({ title, fields }, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between">
              <span className="semibold-atext-sm text-cerulean-600">
                {title}
              </span>
              <span className="semibold-text-md text-oldlace-700">
                Status: {humanize(accountingStatus)}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem] shadow-md">
              {fields.map((item) => (
                <DealInputField {...{ dealNo, data: item, control }} />
              ))}
            </div>
          </React.Fragment>
        ))}

        {["FinanceManager", "FinanceDirector", "FinanceAssistant"].includes(
          userRole ?? "",
        ) ? (
          <div></div>
        ) : (
          <div className="mb-8 flex h-[10rem] justify-between gap-6">
            <div className="flex-1">
              <span className="semibold-text-sm text-cerulean-600">
                Available Documents
              </span>
              <div className="mt-2 h-full space-y-4 overflow-y-auto rounded-lg bg-gray-100 p-4 px-8 text-shark-900">
                {dealDocuments.length > 0 &&
                  dealDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between"
                    >
                      <p>{doc.docTypeName}</p>
                      {doc.isReceived && (
                        <span className="text-xs font-semibold text-green-600">
                          ✓ Received
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <span className="semibold-text-sm text-cerulean-600">
          Reason of Return
        </span>
        <Controller
          name="comment"
          control={control}
          className="border-cerulean-500"
          render={({ field }) => (
            <TextField
              {...field}
              type="textarea"
              placeholder="Comment"
              height="h-auto"
              border="border-cerulean-500 "
              textAreaRows={2}
              disabled={dealStatus === "Finalized"}
            />
          )}
        />
        <ListComments
          entityId={dealId}
          entityNo={dealNo}
          entityType={EntityType.Deal}
          isReadOnly={true}
        />
      </div>

      <div className="flex place-content-end gap-[1rem]">
        {wrappedButtons.map(
          ({ key, text, variant, onClick, disabled, popup, hidden }) => {
            if (hidden) return null;
            return (
              <CustomButton
                key={key}
                text={text}
                variant={variant}
                onClick={onClick}
                disabled={isDisabled(key, disabled)}
                {...(popup && { popup })}
              />
            );
          },
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Missing Documents"
        widthClass="w-[39.3rem]"
      >
        {["FinanceManager", "FinanceDirector", "FinanceAssistant"].includes(
          userRole ?? "",
        ) ? (
          <DealDocumentForm dealId={initialFormData.id} setIsOpen={setIsOpen} />
        ) : (
          <MissingDocumentsForm
            handleSubmit={handleMissingDocuments}
            dealDocuments={dealDocuments}
          />
        )}
      </Modal>
    </div>
  );
};

export default AccountantDealForm;
