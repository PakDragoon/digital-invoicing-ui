import React, { useState } from "react"
import { TabItem } from "../TabItem"
import CustomButton, { VariantType } from "../buttons/CustomButton"
import { ITab } from "@/core/config/tableConfig"
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore"

type ButtonConfig = {
  key: string
  idleText: string
  loadingText?: string
  onClick: (data: any) => void | Promise<void>
  variant: VariantType
  popup?: string
  disabled?: boolean
}

type CardContainerProps<T = {}> = {
  component: React.ComponentType<T>
  componentProps: T
  tabs: ITab[]
  selectedTab: string
  onTabChange: (tab: string) => void
  isEdit?: boolean
  hidden?: boolean
  isLoading?: boolean
  buttons?: ButtonConfig[]
}

const TableCardContainer = <T extends object = {}>({
  component: Component,
  componentProps,
  tabs,
  selectedTab,
  onTabChange,
  isEdit,
  hidden,
  isLoading = false,
  buttons = [],
}: CardContainerProps<T>) => {
  const { isViewingOtherDashboard } = useViewingEmployeeStore()
  const [internalLoading, setInternalLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(selectedTab)
  const handleTabChange = (tab: string) => {
    if (tab !== currentTab) {
      setInternalLoading(true)
      setCurrentTab(tab)
      onTabChange(tab)
    }
  }

  React.useEffect(() => {
    if (selectedTab === currentTab) {
      setInternalLoading(false)
    }
  }, [selectedTab, currentTab])

  React.useEffect(() => {
  if (selectedTab !== currentTab) {
    setCurrentTab(selectedTab)
  }
}, [selectedTab])

  const showLoader = isLoading !== undefined ? isLoading : internalLoading

  const leftTabs = tabs.filter(({ alignment }) => alignment !== "right")
  const rightTabs = tabs.filter(({ alignment }) => alignment === "right")

  // Get button configurations
  const saveButton = buttons.find((button) => button.key === "save")
  const editButton = buttons.find((button) => button.key === "edit")
  const cancelButton = buttons.find((button) => button.key === "cancel")

  // Determine if we should show edit/save buttons
  const showEditButton = !isEdit && currentTab !== "Total" && editButton
  const showSaveCancelButtons = isEdit && saveButton

  const Tab = ({ tab }: { tab: ITab }) => {
    const isSelected = currentTab === tab.label
    const disabled = isEdit && !isSelected
    return (
      <TabItem
        isSelected={isSelected}
        key={tab.key}
        tab={tab.label}
        color={tab.color}
        onTabChange={handleTabChange}
        disabled={disabled || showLoader}
      />
    )
  }

  return (
    <div
      className="flex h-full w-full max-w-full flex-col overflow-visible rounded-[0.5rem] border border-borderGray bg-lightBg"
      style={{ minWidth: 0 }}
    >
      <div className="flex h-[3.25rem] items-baseline justify-between border-b border-borderGray px-4 pt-[1rem]">
        <div className="flex flex-grow items-baseline gap-[1.5rem]">
          <div className="no-scrollbar w-full overflow-x-auto">
            <div className="flex w-full min-w-max items-center justify-between gap-2">
              <div className="flex min-w-max gap-2 border-gray-200">
                {leftTabs.map((tab) => (
                  <Tab tab={tab} key={tab.key} />
                ))}
              </div>
              <div className="flex min-w-max gap-2 border-gray-200">
                {rightTabs.map((tab) => (
                  <Tab tab={tab} key={tab.key} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative bottom-3 mr-2 flex items-center gap-[1.5rem]">
          {/* Save/Cancel buttons in edit mode */}
          {showSaveCancelButtons && (
            <>
              {cancelButton && (
                <CustomButton
                  text={cancelButton.idleText}
                  size="small"
                  variant="outlined"
                  onClick={() => cancelButton.onClick(undefined)}
                  disabled={showLoader || cancelButton.disabled}
                />
              )}
              <CustomButton
                text={saveButton.idleText}
                size="small"
                variant="contained"
                onClick={() => saveButton.onClick(undefined)}
                disabled={showLoader || saveButton.disabled}
              />
            </>
          )}

          {/* Edit button in view mode */}
          {showEditButton && (
            <CustomButton
              text={editButton.idleText}
              size="small"
              variant="outlined"
              onClick={() => editButton.onClick(undefined)}
              disabled={isViewingOtherDashboard || showLoader || editButton.disabled}
            />
          )}
        </div>
      </div>

      <div className="relative h-full overflow-visible p-2">
        {showLoader && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        <Component {...componentProps} />
      </div>
    </div>
  )
}

export const TableCard = React.memo(TableCardContainer)
