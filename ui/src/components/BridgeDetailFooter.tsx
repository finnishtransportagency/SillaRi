import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import { SupervisionStatus } from "../utils/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { getUserData, onRetry } from "../utils/backendData";
import { startSupervision } from "../utils/supervisionBackendData";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SupervisionStatusInfo from "./SupervisionStatusInfo";
import PermitLinkItem from "./PermitLinkItem";

interface BridgeDetailFooterProps {
  permit: IPermit;
  supervision: ISupervision;
  isLoadingSupervision: boolean;
  setConformsToPermit: (conforms: boolean) => void;
}

const BridgeDetailFooter = ({ permit, supervision, isLoadingSupervision, setConformsToPermit }: BridgeDetailFooterProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { data: supervisorUser, isLoading: isLoadingSupervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const { username: currentSupervisor = "" } = supervisorUser || {};
  const { id: supervisionId, conformsToPermit = false, currentStatus, finishedTime } = supervision || {};
  const { status: supervisionStatus, time: statusTime, username: statusUser } = currentStatus || {};

  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const supervisionPending =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.PLANNED || supervisionStatus === SupervisionStatus.CANCELLED);
  const supervisionInProgress = !isLoadingSupervision && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const crossingDenied = !isLoadingSupervision && supervisionStatus === SupervisionStatus.CROSSING_DENIED;
  const supervisionFinished =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.FINISHED || supervisionStatus === SupervisionStatus.REPORT_SIGNED);

  const statusByCurrentSupervisor = !isLoadingSupervisorUser && currentSupervisor && statusUser === currentSupervisor;

  // Set-up mutations for modifying data later
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const supervisionStartMutation = useMutation((initialReport: ISupervisionReport) => startSupervision(initialReport, dispatch), {
    retry: onRetry,
    onMutate: async (newData: ISupervisionReport) => {
      // onMutate fires before the mutation function
      console.log("startSupervision onMutate", newData);

      // Cancel any outgoing refetches so they don't overwrite the optimistic update below
      await queryClient.cancelQueries(supervisionQueryKey);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<ISupervision>(supervisionQueryKey);

      // Optimistically update to the new value
      // Set the current status to IN_PROGRESS here otherwise the Supervision page won't work when offline since the backend won't be called yet
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
        return {
          ...oldData,
          report: { ...oldData?.report, ...newData },
          currentStatus: { ...oldData?.currentStatus, status: SupervisionStatus.IN_PROGRESS },
        } as ISupervision;
      });

      // Since onSuccess doesn't fire when offline, the page transition needs to be done here instead
      history.push(`/supervision/${supervisionId}`);

      // Return a context object with the snapshotted value
      // TODO - check if this is needed
      return { previousData };
    },
    onError: (err, newData, context) => {
      // onError doesn't fire when offline due to the retry option, but may fire when online again
      console.log("startSupervision onError", err, newData, context);

      // If the mutation fails, use the context returned from onMutate to roll back
      // TODO - check if this is needed
      /*
      if (context?.previousData) {
        queryClient.setQueryData<ISupervision>(queryKey, context.previousData);
      }
      */
    },
    onSettled: (data) => {
      // onSettled doesn't fire when offline due to the retry option
      console.log("startSupervision onSettled", data);

      // Always refetch after error or success
      // TODO - check if this is needed
      // queryClient.invalidateQueries(queryKey);
    },
    onSuccess: (data) => {
      // onSuccess doesn't fire when offline due to the retry option, but should fire when online again
      console.log("startSupervision onSuccess", data);

      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, data);

      // Note: moved to onMutate
      // history.push(`/supervision/${supervisionId}`);
    },
  });

  const supervisionStartClicked = () => {
    const defaultReport: ISupervisionReport = {
      id: -1,
      supervisionId: Number(supervisionId),
      drivingLineOk: false,
      drivingLineInfo: "",
      speedLimitOk: false,
      speedLimitInfo: "",
      anomalies: true,
      anomaliesDescription: "",
      surfaceDamage: false,
      jointDamage: false,
      bendOrDisplacement: false,
      otherObservations: false,
      otherObservationsInfo: "",
      additionalInfo: "",
      draft: true,
    };
    supervisionStartMutation.mutate(defaultReport);
  };

  const continueSupervisionClicked = () => {
    history.push(`/supervision/${supervisionId}`);
  };

  return (
    <>
      <PermitLinkItem permit={permit} />

      {!isLoadingSupervision && !supervisionId && <SupervisionStatusInfo color="danger" infoText={t("bridge.supervisionMissing")} />}
      {supervisionInProgress && <SupervisionStatusInfo color="success" infoText={t("bridge.supervisionStarted")} time={statusTime} />}
      {crossingDenied && <SupervisionStatusInfo color="warning" infoText={t("bridge.crossingDenied")} time={statusTime} />}
      {supervisionFinished && <SupervisionStatusInfo color="secondary" infoText={t("bridge.supervisionFinished")} time={finishedTime} />}

      <IonItem lines="none">
        <IonCheckbox
          slot="start"
          value="conforms"
          checked={conformsToPermit}
          disabled={!supervisionId || !supervisionPending}
          onClick={() => setConformsToPermit(!conformsToPermit)}
        />
        <IonLabel>{t("bridge.conformsToPermit")}</IonLabel>
      </IonItem>

      <IonGrid>
        <IonRow>
          <IonCol className="ion-text-center">
            {(supervisionPending || crossingDenied) && (
              <IonButton
                disabled={!supervisionId || !conformsToPermit || crossingDenied}
                color="primary"
                expand="block"
                size="large"
                onClick={() => supervisionStartClicked()}
              >
                {t("bridge.startSupervision")}
              </IonButton>
            )}
            {!supervisionPending && !crossingDenied && (
              <IonButton
                disabled={!supervisionInProgress || !statusByCurrentSupervisor}
                color="primary"
                expand="block"
                size="large"
                onClick={() => continueSupervisionClicked()}
              >
                {t("bridge.continueSupervision")}
              </IonButton>
            )}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton
              disabled={!supervisionId || !supervisionPending}
              color="tertiary"
              expand="block"
              size="large"
              routerLink={`/denyCrossing/${supervisionId}`}
            >
              {t("bridge.denyCrossing")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default BridgeDetailFooter;
