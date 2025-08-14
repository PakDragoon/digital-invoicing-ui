import React, { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import CustomButton, { VariantType } from "../buttons/CustomButton"
import ObjInputField from "@/features/dashboard/components/GeneralManager/components/objectives/ObjInputField"
import {
  FinanceObjFields,
  InitialFormData,
  NewObjFields,
  NewObjFormData,
  UsedObjFields,
} from "@/features/dashboard/components/GeneralManager/config/ObjFieldConfig";
import { useStepStore } from "@/features/dashboard/components/GeneralManager/store.tsx/UseStepsStore";
import { useGetCarMakes } from "@/features/dashboard/components/GeneralManager/hooks/useCarMakeModel";
import { useModelStore } from "@/features/dashboard/components/GeneralManager/store.tsx/useModelStore";

export interface ButtonConfig<TFormData> {
  key: string;
  idleText: string;
  loadingText?: string;
  onClick: (data: TFormData) => Promise<void>;
  variant: VariantType;
  popup?: string;
  disabled?: boolean;
}

interface Props<TFormData> {
  title?: string;
  dealNo?: string;
  step1Fields: NewObjFields[] | UsedObjFields[] | FinanceObjFields[];
  step2Fields?: NewObjFields[] | UsedObjFields[];
  step3Fields?: NewObjFields[] | UsedObjFields[];
  initialFormData?: InitialFormData;
  loading: Record<string, boolean>;
  buttons: ButtonConfig<TFormData>[];
  setDealershipDealNo?: React.Dispatch<React.SetStateAction<string>>;
  populatedData?: NewObjFormData;
  type?: "New" | "Used" | "Finance";
}

const ObjectiveForm = <TFormData extends Record<string, any>>({
  dealNo,
  step1Fields,
  step2Fields,
  step3Fields,
  loading,
  buttons,
  setDealershipDealNo,
  type,

}: Props<TFormData>) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  })

  const dealershipDealNo = watch("dealershipDealNo");
  const salesTypes = watch("carline") ?? false;
  const certified_PRU = watch("Certified_PRU_Check") ?? false;
  const carline = watch("carline");

  useEffect(() => {
    if (carline === "" || !carline) {
      setValue("carline", "");
      setValue("model", "");
    } else {
      setValue("model", "");
    }
  }, [carline, setValue]);

  useEffect(() => {
    if (dealershipDealNo && setDealershipDealNo) {
      setDealershipDealNo(dealershipDealNo)
    }
  }, [dealershipDealNo, setDealershipDealNo])

  const formSections = [
    { title: "step1", fields: step1Fields },
    { title: "step2", fields: step2Fields ?? [] },
    { title: "step3", fields: step3Fields ?? [] },
  ]

  const step = useStepStore((s) => s.step)
  const setStep = useStepStore((s) => s.setStep)

  const visibleFields = formSections[step]?.fields?.filter((item) => {
    if (!item) return false;
    switch (item.field) {
      case "factoryObjective":
        return salesTypes === 'Certified' || type === 'New';
      case "internalObjective":
        return salesTypes === 'Certified' || salesTypes === 'Retail' || type === 'New';
      case "Certified_PRU":
        return certified_PRU;
      default:
        return true;
    }
  }) ?? [];

  const wrappedButtons = buttons.map(({ key, idleText, loadingText, onClick, variant, popup }) => ({
    key,
    text: loading[key] ? (loadingText ?? idleText) : idleText,
    variant,
    onClick: handleSubmit((data) => onClick(data as TFormData)),
    disabled: !isValid || loading[key],
    popup,
  }))

  const nextStep = () => {
    if (step < formSections.length - 1) {
      setStep(step + 1)
    }
  };

  // Check if all required fields in current step are valid
  const areRequiredFieldsValid = visibleFields.every((field) => {
    if (!field.require) return true;

    const value = watch(field.field);

    return value !== undefined &&
      value !== null &&
      (typeof value === 'boolean' || value !== '');
  });


  const wrappedButtonsElements = wrappedButtons.map(
    ({ key, text, variant, onClick, disabled, popup }) => (
      <CustomButton
        key={key}
        text={text}
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        {...(popup && { popup })}
      />
    )
  );

  const { data: makeModelData } = useGetCarMakes();
  const { setModels, resetModels } = useModelStore();

  const handleCarlineChange = (models: any[]) => {
    setModels(models);
  };

  useEffect(() => {
    return () => { resetModels() };
  }, []);

  return (
    <div className="flex w-fit flex-col items-center justify-center gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">

      {formSections[step]?.fields && (
        <div className="grid w-[476px] grid-cols-1 items-center gap-[1.25rem] rounded-md px-[1rem] py-[1rem]">
          {visibleFields.map((item) => (
            <ObjInputField
              key={item.field}
              dealNo={dealNo}
              data={item}
              control={control}
              makeModelData={makeModelData?.data}
              onCarlineChange={handleCarlineChange}
            />
          ))}
        </div>
      )}


      <div className="flex items-center justify-between gap-[1rem]">
        {step < formSections.length - 1 && formSections[step + 1]?.fields?.length ? (
          <CustomButton
            text="Next"
            variant="contained"
            onClick={nextStep}
            disabled={!areRequiredFieldsValid}
          />
        ) : (
          <div className="flex place-content-end gap-[1rem]">{wrappedButtonsElements}</div>
        )}
      </div>
    </div>
  )
}

export default ObjectiveForm
