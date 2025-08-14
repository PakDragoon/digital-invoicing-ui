import CreatableSelect from "react-select/creatable"
import { useEffect, useState } from "react"
import colors from "../constants/tailwind-colors"
import { dealService } from "@/features/invoice/services/dealApi"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { useQueryClient } from "@tanstack/react-query"

type Option = { label: string; value: string } | { id: string; name: string; value?: string }

interface IProps {
  options?: Option[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  allowCreate?: boolean
  size?: "small" | "medium" | "large" | "default"
  useTextFieldStyle?: boolean
  create?:string
}

const CreatableSelectComponent = (props: IProps) => {
  const {
    size = "default",
    options,
    value,
    onChange,
    placeholder,
    error,
    allowCreate = true,
    useTextFieldStyle = false,
    create
  } = props

  const [optionsList, setOptionsList] = useState<{ label: string; value: string }[]>([])
  const [localValue, setLocalValue] = useState(value)
  const [isCreating, setIsCreating] = useState(false)

  const { user } = useAuthStore.getState()
  const dealershipId = (user?.dealershipId ?? "").toString()
  const companyId = (user?.companyId ?? "").toString()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!options || options.length === 0) {
      setOptionsList([])
      return
    }

    const converted = options.map((opt) => {
      const value = "value" in opt ? opt.value : opt.id
      const label = "label" in opt ? opt.label : opt.name
      return { label, value }
    })

    setOptionsList(converted)
  }, [options])

  useEffect(() => {
    if (!isCreating) {
      setLocalValue(value)
    }
  }, [value, isCreating])

  const handleCreateOption = async (inputValue: string) => {
    setIsCreating(true)
    try {
      const newOption = { value: inputValue, label: inputValue }

      setOptionsList((prev) => [...prev, newOption])
      setLocalValue(inputValue)
      onChange(inputValue)
      if (create === 'dealDoc') {
        await dealService.createDealDocumentType(inputValue, dealershipId, companyId)
        await queryClient.invalidateQueries({ queryKey: ["getDocumentTypes"] })
      }
    } catch (error) {
      console.error("Failed to create new document type:", error)

      setOptionsList((prev) => prev.filter((opt) => opt.value !== inputValue))
      onChange("")
      setLocalValue("")
    } finally {
      setIsCreating(false)
    }
  }

  const selectedOption =
    optionsList.find((opt) => opt.value === localValue) || (value ? { value, label: value } : null)

  const sizeClasses = {
    small: "2rem",
    medium: "2.5rem",
    large: "3rem",
    default: "3rem",
  } as const

  const heightClass = sizeClasses[size]

  return (
    <div className="relative w-full">
      <CreatableSelect
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value || "")}
        options={optionsList}
        placeholder={placeholder}
        isClearable={false}
        isValidNewOption={() => allowCreate}
        onCreateOption={handleCreateOption}
        styles={{
          control: (base, state) => {
            const hasValue = !!selectedOption?.label

            if (useTextFieldStyle) {
              return {
                ...base,
                height: sizeClasses.small,
                backgroundColor: hasValue ? colors.cerulean[50] : colors.shark[100],
                border:
                  state.isFocused || hasValue
                    ? `1px solid ${colors.cerulean[500]}`
                    : "1px solid transparent",
                boxShadow: state.isFocused ? `0 0 0 2px ${colors.cerulean[500]}` : "none",
                borderRadius: "0.375rem",
                fontSize: "12px",
                paddingLeft: "10px",
                color: "#333",
                "&:hover": {
                  border: "1px solid #2B8FD6",
                },
              }
            }

            return {
              ...base,
              minHeight: heightClass,
              height: heightClass,
              borderRadius: "0.25rem",
              borderColor: "#D0D5DD",
              boxShadow: state.isFocused ? "0 0 0 2px #3B82F6" : "none",
              paddingLeft: "0.5rem",
              fontSize: "1rem",
              color: "#666B74",
              backgroundColor: "#ffffff",
              "&:hover": { borderColor: "#3B82F6" },
            }
          },
          placeholder: (base) => ({
            ...base,
            color: "#666B74",
          }),
        }}
        classNamePrefix="custom-select"
      />
      {error && <p className="mt-1 text-sm font-normal text-red-500">{error}</p>}
    </div>
  )
}

export default CreatableSelectComponent
