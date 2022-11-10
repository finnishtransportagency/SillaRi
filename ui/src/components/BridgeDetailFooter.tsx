import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow, useIonAlert } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import { SILLARI_SYSTEM_USER, SupervisionStatus, TransportStatus } from "../utils/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import IStartCrossingInput from "../interfaces/IStartCrossingInput";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { getUserData, onRetry } from "../utils/backendData";
import { startSupervision } from "../utils/supervisionBackendData";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SupervisionStatusInfo from "./SupervisionStatusInfo";
import PermitLinkItem from "./PermitLinkItem";
import { isCustomerUsesSillariPermitSupervision } from "../utils/supervisionUtil";

interface BridgeDetailFooterProps {
  permit: IPermit;
  supervision: ISupervision;
  username: string;
  isLoadingSupervision: boolean;
  setConformsToPermit: (conforms: boolean) => void;
}

const BridgeDetailFooter = ({ permit, supervision, username, isLoadingSupervision, setConformsToPermit }: BridgeDetailFooterProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [present] = useIonAlert();

  const { data: supervisorUser, isLoading: isLoadingSupervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const { username: currentSupervisor = "" } = supervisorUser || {};
  console.log("currentSupervisor: " + currentSupervisor);
  const {
    id: supervisionId,
    routeTransportId,
    conformsToPermit = false,
    currentStatus,
    finishedTime,
    routeTransport,
    supervisorType,
  } = supervision || {};
  const { status: supervisionStatus, time: statusTime, username: statusUser } = currentStatus || {};
  const { currentStatus: currentTransportStatus } = routeTransport || {};
  const { status: transportStatus } = currentTransportStatus || {};

  const transportInProgress =
    !isCustomerUsesSillariPermitSupervision(supervision) || (transportStatus && transportStatus !== TransportStatus.PLANNED);
  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const supervisionPending =
    !isLoadingSupervision &&
    (supervisionStatus === SupervisionStatus.PLANNED ||
      supervisionStatus === SupervisionStatus.OWN_LIST_PLANNED ||
      supervisionStatus === SupervisionStatus.CANCELLED);
  const supervisionInProgress = !isLoadingSupervision && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const crossingDenied = !isLoadingSupervision && supervisionStatus === SupervisionStatus.CROSSING_DENIED;
  const supervisionFinished =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.FINISHED || supervisionStatus === SupervisionStatus.REPORT_SIGNED);

  console.log("supervisorType: " + supervisorType);
  const statusByCurrentSupervisor =
    statusUser === SILLARI_SYSTEM_USER || (!isLoadingSupervisorUser && currentSupervisor && statusUser === currentSupervisor);
  const startingAllowed =
    username && supervisionId && (routeTransportId || !isCustomerUsesSillariPermitSupervision(supervision)) && conformsToPermit && !crossingDenied;

  // Set-up mutations for modifying data later
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const supervisionStartMutation = useMutation(
    (startCrossingInput: IStartCrossingInput) => startSupervision(startCrossingInput, username, dispatch),
    {
      retry: onRetry,
      onMutate: async (newData: IStartCrossingInput) => {
        // onMutate fires before the mutation function

        // Cancel any outgoing refetches so they don't overwrite the optimistic update below
        await queryClient.cancelQueries(supervisionQueryKey);

        // Optimistically update to the new report
        // Set the current status to IN_PROGRESS here otherwise the Supervision page won't work when offline since the backend won't be called yet
        queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
          return {
            ...oldData,
            report: { ...oldData?.report, ...newData.initialReport },
            currentStatus: { ...oldData?.currentStatus, status: SupervisionStatus.IN_PROGRESS, time: newData.startTime },
            startedTime: newData.startTime,
          } as ISupervision;
        });

        // Since onSuccess doesn't fire when offline, the page transition needs to be done here instead
        history.push(`/supervision/${supervisionId}`);
      },
      onSuccess: (data) => {
        // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

        // Update "getSupervision" query to return the updated data
        queryClient.setQueryData<ISupervision>(supervisionQueryKey, data);
      },
    }
  );

  const supervisionStartClicked = (): void => {
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
    const startCrossingInput: IStartCrossingInput = { initialReport: defaultReport, routeTransportId, startTime: new Date() };
    supervisionStartMutation.mutate(startCrossingInput);
  };

  const continueSupervisionClicked = (): void => {
    history.push(`/supervision/${supervisionId}`);
  };

  const denyCrossingClicked = (): void => {
    history.push(`/denyCrossing/${supervisionId}`);
  };

  const confirmTransportInProgress = (onClickMethod: () => void, headerText: string) => {
    if (transportInProgress) {
      onClickMethod();
    } else {
      present({
        header: headerText,
        message: t("bridge.warning.transportNotStarted"),
        buttons: [
          t("common.buttons.back2"),
          {
            text: t("common.buttons.continue"),
            handler: () => {
              onClickMethod();
            },
          },
        ],
      });
    }
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
          disabled={!username || !supervisionId || !supervisionPending}
          onClick={() => setConformsToPermit(!conformsToPermit)}
        />
        <IonLabel>{t("bridge.conformsToPermit")}</IonLabel>
      </IonItem>

      <IonGrid>
        <IonRow>
          <IonCol className="ion-text-center">
            {(supervisionPending || crossingDenied) && (
              <IonButton
                disabled={!startingAllowed}
                color="primary"
                expand="block"
                size="large"
                onClick={() => confirmTransportInProgress(supervisionStartClicked, t("bridge.warning.confirmStartSupervision"))}
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
                onClick={() => confirmTransportInProgress(continueSupervisionClicked, t("bridge.warning.confirmContinueSupervision"))}
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
              onClick={() => confirmTransportInProgress(denyCrossingClicked, t("bridge.warning.confirmDenyCrossing"))}
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
