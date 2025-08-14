import { LinkSentIcon } from "@/assets"
import { formatPhoneNumber } from "@/common/utils"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { useCustomerVisitMutation } from "@/features/customers/hooks/useCustomerVisitMutation"
import { useGetSalesPersons } from "@/features/table/services/tableDataApi"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import CustomButton from "../buttons/CustomButton"
import Chip from "../chip/Chip"
import CustomDropdown from "../inputs/CustomDropdown"
import TextField from "../inputs/CustomTextField"
import Modal from "../modal/Modal"
import {
  addCustomerOptions,
  locationOptions,
  Salesperson,
  SalespersonResponse,
  sourceOptions,
} from "./data-fields/addCustomer"

interface CreateCustomerProps {
  setIsCustomerModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCustomerForm: React.FC<CreateCustomerProps> = ({ setIsCustomerModalOpen }) => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const companyId = useAuthStore((state) => state.user?.companyId)
  const dealershipId = useAuthStore((state) => state.user?.dealershipId)
  const user = useAuthStore((state) => state.user)
  const isSalesPerson = user?.role === "SalesPerson"

  const initialFormData = {
    phone: "",
    source: "",
    location: "",
    vehicleInterest: "",
    visitStatus: "Waiting",
    requestedSalespersonId: isSalesPerson ? user.id : "",
    assignedSalespersonId: isSalesPerson ? user.id : "",
    firstName: "",
    lastName: "",
    email: "",
  }

  const navigate = useNavigate()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const {
    mutate: createVisit,
    isError,
    data,
    isPending,
  } = useCustomerVisitMutation((errorMessage) => {
    toast.error(errorMessage)
    console.error("Validation Error:", errorMessage)
  })

  const { data: salespersons, isLoading, error } = useGetSalesPersons()
  const salespersonOptions: Salesperson[] = (salespersons as SalespersonResponse)?.data || []

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: initialFormData,
  })

  const onSubmit = (data: any) => {
    createVisit(
      { companyId, dealershipId, ...data },
      {
        onSuccess: () => {
          openModal()
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "/customer-visit",
          })
        },
      }
    )
  }

  const handleClose = () => {
    closeModal()
    setIsCustomerModalOpen(false)
    navigate({ to: "/dashboard" })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
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
                <div className="flex gap-[2rem]">
                  {addCustomerOptions.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      checked={field.value === option}
                      onSelect={() => field.onChange(option)}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">
            Customer Information
          </span>

          <div className="grid grid-cols-4 gap-[1.25rem] rounded-md px-[1rem] pb-[1.5rem] shadow-md">
            <TextField placeholder="ID Verification #" variant="contained" />

            <Controller
              name="firstName"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder="First Name" variant="contained" required />
              )}
            />

            <Controller
              name="lastName"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder="Last Name" variant="contained" required />
              )}
            />

            <Controller
              name="source"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  value={field.value}
                  onSelect={field.onChange}
                  label="Source"
                  options={sourceOptions}
                  required
                />
              )}
            />

            <Controller
              name="requestedSalespersonId"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  label="Request Salesperson"
                  value={
                    salespersonOptions.find((sp) => sp.id === field.value)
                      ? `${salespersonOptions.find((sp) => sp.id === field.value)?.firstName} ${salespersonOptions.find((sp) => sp.id === field.value)?.lastName}`
                      : ""
                  }
                  onSelect={(selectedName) => {
                    if (selectedName === "None") {
                      field.onChange("")
                    } else {
                      const selected = salespersonOptions.find(
                        (sp) => `${sp.firstName} ${sp.lastName}` === selectedName
                      )
                      field.onChange(selected?.id)
                    }
                  }}
                  disabled={isSalesPerson}
                  options={[
                    "None",
                    ...salespersonOptions.map((sp) => `${sp.firstName} ${sp.lastName}`),
                  ]}
                  maxOptionsHeight="15rem"
                />
              )}
            />

            {/* <Controller
                        name="newUsed"
                        control={control}
                        render={({ field }) => (
                            <CustomDropdown {...field} value={field.value} onSelect={field.onChange} label='New/Used' options={['New', 'Used']} />
                        )}
                    /> */}
            <CustomDropdown value="New" label="New/Used" options={["New", "Used"]} />

            <Controller
              name="vehicleInterest"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder="Interested Model" variant="contained" required />
              )}
            />

            <Controller
              name="location"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  value={field.value}
                  onSelect={field.onChange}
                  label="Location"
                  options={locationOptions}
                  required
                />
              )}
            />

            <Controller
              name="assignedSalespersonId"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  label="Assigned Salesperson"
                  value={
                    salespersonOptions.find((sp) => sp.id === field.value)
                      ? `${salespersonOptions.find((sp) => sp.id === field.value)?.firstName} ${salespersonOptions.find((sp) => sp.id === field.value)?.lastName}`
                      : ""
                  }
                  onSelect={(selectedName) => {
                    if (selectedName === "None") {
                      field.onChange("")
                    } else {
                      const selected = salespersonOptions.find(
                        (sp) => `${sp.firstName} ${sp.lastName}` === selectedName
                      )
                      field.onChange(selected?.id)
                    }
                  }}
                  disabled={isSalesPerson}
                  options={[
                    "None",
                    ...salespersonOptions.map((sp) => `${sp.firstName} ${sp.lastName}`),
                  ]}
                  maxOptionsHeight="15rem"
                />
              )}
            />

            <Controller
              name="phone"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Phone Number"
                  variant="contained"
                  required
                  value={formatPhoneNumber(field.value)}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              )}
            />

            <Controller
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder="Email" variant="contained" required />
              )}
            />

            <TextField placeholder="ID Scan" variant="contained" />
          </div>

          <span className="semibold-text-sm text-cerulean-600">Add Comment</span>

          <textarea
            className="regular-text-sm h-[98px] w-full rounded-md border border-gray-300 p-[10px] text-shark-300 focus:border-gray-300 focus:outline-none focus:ring-0"
            placeholder="Comment"
          ></textarea>
        </div>

        <div className="flex place-content-center gap-[1rem]">
          <CustomButton
            text="Notify"
            type="submit"
            variant="outlined"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            loading={isPending}
            size="large"
            popup="Fill the Required Fields!"
          />
          <CustomButton
            text="Save"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            loading={isPending}
            size="large"
            popup="Fill the Required Fields!"
          />
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="w-[31.25rem] h-auto h-max-[26.75rem] p-8"
        icon={LinkSentIcon}
      >
        <div className="flex flex-col items-center gap-[2.625rem]">
          <div className="flex flex-col text-shark-700">
            <span className="medium-display-xs">Customer Added Successfully!</span>
            <span className="medium-text-lg">Click done to go back to the dashboard</span>
          </div>
          <CustomButton variant="contained" text="Done" onClick={handleClose} size="medium" />
        </div>
      </Modal>
    </>
  )
}

export default CreateCustomerForm
