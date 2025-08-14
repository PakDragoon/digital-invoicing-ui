import React from "react"
import { Controller, useForm } from "react-hook-form"
import Chip from "../chip/Chip"
import CustomButton, { VariantType } from "../buttons/CustomButton"
import TextField from "../inputs/CustomTextField"
import { addCustomerOptions } from "./data-fields/addCustomer"
import { humanize } from "@/common/utils/humanize"
import ListComments from "@/features/comment/components/ListComments"
import { EntityType } from "@/common/constants/comment"
import { CustomerFields } from "@/features/customers/form/CreateCustomerFieldConfig"
import DealInputField from "@/features/invoice/components/DealInputField"
import Modal from "../modal/NewModal"
import CustomerHistoryForm from "@/features/customers/components/CustomerHistory"
import { CommentIconWhite } from "@/assets"

interface CustomerFormProps {
  initialData: any
  customerFields: CustomerFields[]
  firstRequestedSalespersonName?: string
  onSubmit: (data: any, revisit: boolean) => void
  buttons: {
    key: string
    idleText: string
    loadingText?: string
    onClick: (data: any) => void | Promise<void>
    variant: VariantType
    popup?: string
  }[]
  isPending: boolean
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  customerFields,
  firstRequestedSalespersonName,
  onSubmit,
  buttons,
  isPending,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: initialData,
  })
  const [isCustomerHistoryModal, setIsCustomerHistoryModal] = React.useState(false)
  const toggleCustomerHistoryModal = () => setIsCustomerHistoryModal((prev) => !prev)
  return (
    <>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data, false))}
        className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]"
      >
        <div className="flex flex-col gap-[0.938rem]">
          <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Status</span>
          <div className="mb-[32px] rounded-md">
            <Controller
              control={control}
              name="visitStatus"
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex justify-between">
                  <div className="flex gap-[2rem]">
                    {addCustomerOptions.map((option) => (
                      <Chip
                        key={option}
                        label={humanize(option)}
                        checked={field.value === option}
                        onSelect={() => field.onChange(option)}
                      />
                    ))}
                  </div>
                  <div>
                    <CustomButton
                      type="button"
                      variant="contained"
                      width="min-w-[2.625rem]"
                      onClick={toggleCustomerHistoryModal}
                      icon={
                        <img
                          src={`${CommentIconWhite}`}
                          className="h-[1.3134rem] w-[1.3134rem]"
                          alt="comment icon"
                        />
                      }
                    />
                  </div>
                </div>
              )}
            />
          </div>

          <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">
            Customer Information
          </span>

          <div className="grid grid-cols-4 gap-[1.25rem] rounded-md px-[1rem] pb-[1.5rem] shadow-md">
            {customerFields.map((item) => (
              <DealInputField key={item.field} {...{ data: item, control }} />
            ))}
          </div>

          <span className="semibold-text-sm text-cerulean-600">Add Comment</span>

          {initialData.id !== undefined ? (
            <ListComments entityId={initialData.id} entityType={EntityType.Customer} />
          ) : (
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="textarea"
                  placeholder="Comment"
                  textAreaRows={5}
                  height="h-auto"
                />
              )}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex place-content-center gap-[1rem]">
          {buttons.map((btn) => (
            <CustomButton
              key={btn.key}
              text={btn.idleText}
              type="submit"
              variant={btn.variant}
              onClick={handleSubmit(btn.onClick)}
              disabled={!isValid || isPending}
              loading={isPending}
              popup={btn.popup}
              size="large"
            />
          ))}
        </div>
      </form>
      <Modal
        isOpen={isCustomerHistoryModal}
        onClose={toggleCustomerHistoryModal}
        title="Customer History"
        widthClass="w-[59.3rem]"
      >
        <CustomerHistoryForm
          visitId={initialData.verificationId}
          firstRequestedSalesPersonName={firstRequestedSalespersonName}
        />
      </Modal>
    </>
  )
}

export default CustomerForm
