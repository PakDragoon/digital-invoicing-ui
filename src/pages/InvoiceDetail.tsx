import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { BreadCrumb } from "@/common/components/breadcrumb/BreadCrumb";
import MetricCard from "@/common/components/cards/MetricCard";
import DealInfo from "@/features/invoice/components/DealInfo";
import InfoCard from "@/common/components/cards/InfoCard";
import { useAuthStore } from "@/features/auth/stores/authStore";
import {
  useDealDetail,
  useDealInAssignQueue,
  useRouteOneByVin,
} from "@/features/invoice/hooks";
import { humanize } from "@/common/utils/humanize";
import { FullPageLoader } from "@/common/components/FullPageLoader";
import CustomButton from "../common/components/buttons/CustomButton";
import { EditIcon, CommentIconWhite } from "@/assets";
import Modal from "@/common/components/modal/NewModal";
import DealEdit from "@/features/invoice/components/DealEdit";
import CommentForm from "@/common/components/forms/CommentForm";
import { metricData, infoData } from "@/core/config/deal-detail-config";
import { useModalStore } from "@/common/components/modal/store/modalStore";
import { EntityType } from "@/common/constants/comment";
import { useDealStore } from "@/features/invoice/store/dealStore";
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore";
import { getDashboardRouteByRole } from "@/common/utils/routesUtils";
import { DealConfig } from "@/features/invoice/deal-form/CreateDealFieldConfig";
import { Deal } from "@/core/entities";

function InvoiceDetail() {
  const [isCommentModal, setIsCommentModal] = React.useState(false);
  const { id } = useParams({ strict: false });
  const [dealExistsInQueue, setDealExistsInQueue] = useState(false);
  const dealershipId = useAuthStore((state) => state.user?.dealershipId);
  const role = useAuthStore((state) => state.user?.role ?? null);
  const { viewingEmployee } = useViewingEmployeeStore();
  const ViewinguserRole = viewingEmployee?.role ? viewingEmployee.role : role;
  const humanizedRole = humanize(ViewinguserRole);
  const canEditDeal = ["SalesManager", "FinanceDirector"].includes(role!);
  const { data, isLoading, isError } = useDealDetail(id, dealershipId);
  const {
    closeEditDeal,
    openEditDeal,
    isDealEditOpen,
    isSendToFinanceEdit,
    setSendToFinanceEdit,
    openAssignDeal,
  } = useModalStore();
  const { setCreatedDealId, DisplayRotation, toggleReassign } = useDealStore();
  const dealDetail = data || null;
  const dealId = dealDetail?.id;
  const dealNo = dealDetail?.dealershipDealNo;
  const vin = dealDetail?.vin;
  const enableEditGross = data?.dealStatus
    ? ["CustomerSigned", "FinanceComplete"].includes(data.dealStatus)
    : false;
  const rootPath = viewingEmployee
    ? getDashboardRouteByRole(viewingEmployee.role)
    : getDashboardRouteByRole(role);

  const { data: routeOneData } = useRouteOneByVin(dealershipId, vin);

  const toggleCommentModal = () => setIsCommentModal((prev) => !prev);

  const computedMetrics = metricData.map((metric) => {
    if (metric.key === "totalGross") {
      const salesGross =
        parseFloat(dealDetail?.estimatedSalesGross?.toString() || "0") || 0;
      const financeGross =
        parseFloat(dealDetail?.estimatedFinanceGross?.toString() || "0") || 0;
      const totalGross = salesGross + financeGross;
      return { ...metric, value: `$${totalGross.toFixed(2)}` };
    } else {
      const metricValue =
        parseFloat((dealDetail?.[metric.key] ?? 0).toString()) || 0;
      return { ...metric, value: `$${metricValue.toFixed(2)}` };
    }
  });

  const shouldCheckQueue =
    dealDetail?.financeManagerId === "" && role === "SalesManager";
  const { data: dealExistsInAssignQueue } = useDealInAssignQueue(
    dealershipId,
    dealId,
    {
      enabled: shouldCheckQueue,
    },
  );

  useEffect(() => {
    if (dealDetail?.financeManagerId) toggleReassign(true);
    return () => toggleReassign(false);
  }, [dealId]);

  // TODO: no more needed as we are showing send to finance indefinitely
  useEffect(() => {
    DisplayRotation();
    const dealExists = shouldCheckQueue
      ? !!dealExistsInAssignQueue?.dealId
      : false;
    if (!shouldCheckQueue) setDealExistsInQueue(true);
    else setDealExistsInQueue(dealExists);
    setCreatedDealId(dealId);
  }, [dealExistsInAssignQueue, dealId]);

  const getMissingRequiredFields = (
    section: keyof typeof DealConfig.fields,
    dealDetail: Deal,
    option?: Array<{ name: string; id: string }>,
  ): string[] => {
    const fields = DealConfig.fields[section](option);

    return fields
      .filter((field) => field.require)
      .filter((field) => {
        const value = dealDetail[field.field];
        if (field.field === "estimatedSalesGross")
          return typeof value !== "number" || value <= 0;
        return value === null || value === "";
      })
      .map((field) => field.label || field.field);
  };

  const handleSendToFinance = () => {
    const missingDeal = getMissingRequiredFields("deal", dealDetail!, []);
    const missingVehicle = getMissingRequiredFields("vehicle", dealDetail!);
    const allMissing = [...missingDeal, ...missingVehicle];

    if (allMissing.length === 0) openAssignDeal();
    else setSendToFinanceEdit(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <BreadCrumb rootLabel={humanizedRole} rootPath={rootPath} />
        <div className="flex gap-2 px-2">
          {canEditDeal && data?.dealStatus != "Finalized" && (
            <CustomButton
              text="Edit a Deal"
              disabled={isLoading}
              width="min-w-[7.5rem]"
              variant="outlined"
              onClick={openEditDeal}
              icon={<img src={`${EditIcon}`} alt="edit icon" />}
            />
          )}

          {(canEditDeal || !dealExistsInQueue) && (
            <CustomButton
              text="Send To Finance"
              disabled={isLoading}
              width="min-w-[7.5rem]"
              variant="outlined"
              onClick={handleSendToFinance}
            />
          )}

          <CustomButton
            variant="contained"
            disabled={isLoading}
            width="min-w-[2.625rem]"
            onClick={toggleCommentModal}
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
      {isLoading && (
        <div className="flex h-[calc(90%-2rem)]">
          <FullPageLoader />
        </div>
      )}
      {isError && (
        <div className="py-8 text-center text-red-500">
          Failed to load data.
        </div>
      )}
      {!isLoading && !isError && !dealDetail && (
        <div className="py-8 text-center text-gray-500">
          No data found for Deal ID: {id}
        </div>
      )}
      {!isError && dealDetail && (
        <div className="flex">
          <div className="flex w-full flex-wrap">
            <div className="w-full p-[0.35rem] md:w-1/2">
              <div className="-mx-2 mb-2 flex flex-wrap">
                {computedMetrics.map((metric) => (
                  <div key={metric.key} className="mb-2 w-full px-2 md:w-1/3">
                    <MetricCard
                      id={metric.key}
                      objectiveName={metric.label}
                      achievedObjective={metric.value}
                      iconColor={metric.iconColor}
                      iconBgColor={metric.iconBgColor}
                      path={metric.path}
                      enableEdit={enableEditGross}
                    />
                  </div>
                ))}
              </div>

              <div className="-mx-2 flex flex-wrap">
                {infoData.map((info, index) => {
                  return (
                    <div key={index} className="mb-4 w-full px-2 md:w-1/2">
                      <InfoCard
                        component={DealInfo}
                        title={info.title}
                        componentProps={{ data: dealDetail }}
                        sections={info.sections}
                        maxVisibleFields={6}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isDealEditOpen}
        onClose={closeEditDeal}
        title="Edit a Deal"
      >
        <DealEdit data={dealDetail} />
      </Modal>
      <Modal
        isOpen={isSendToFinanceEdit}
        onClose={() => setSendToFinanceEdit(false)}
        title="Edit a Deal"
      >
        <DealEdit data={dealDetail} />
      </Modal>
      <Modal
        isOpen={isCommentModal}
        onClose={toggleCommentModal}
        title="Deal Comment"
        widthClass="w-[59.3rem]"
      >
        <CommentForm
          entityId={dealId}
          entityType={EntityType.Deal}
          entityNo={dealNo}
        />
      </Modal>
    </>
  );
}

export default InvoiceDetail;
