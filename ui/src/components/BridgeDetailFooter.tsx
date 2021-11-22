import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import file from "../theme/icons/file.svg";
import { SupervisionStatus } from "../utils/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { getSupervisorUser, onRetry, startSupervision } from "../utils/supervisionBackendData";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SupervisionStatusInfo from "./SupervisionStatusInfo";

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

  const { data: supervisorUser, isLoading: isLoadingSupervisorUser } = useQuery(["getSupervisor"], () => getSupervisorUser(dispatch), {
    retry: onRetry,
  });

  const { username: currentSupervisor = "" } = supervisorUser || {};
  const { permitNumber } = permit || {};
  const { id: supervisionId, conformsToPermit = false, currentStatus, finishedTime } = supervision || {};
  const { status: supervisionStatus, time: statusTime, username: statusUser } = currentStatus || {};

  const supervisionPending =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.PLANNED || supervisionStatus === SupervisionStatus.CANCELLED);
  const supervisionInProgress = !isLoadingSupervision && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const crossingDenied = !isLoadingSupervision && supervisionStatus === SupervisionStatus.CROSSING_DENIED;
  const supervisionFinished =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.FINISHED || supervisionStatus === SupervisionStatus.REPORT_SIGNED);

  const statusByCurrentSupervisor = !isLoadingSupervisorUser && currentSupervisor && statusUser === currentSupervisor;

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((initialReport: ISupervisionReport) => startSupervision(initialReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      history.push(`/supervision/${supervisionId}`);
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
      <IonItem className="itemIcon" detail detailIcon={file} lines="none">
        <IonLabel className="headingText">{t("bridge.transportPermit")}</IonLabel>
        <IonLabel>{permitNumber}</IonLabel>
      </IonItem>

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
