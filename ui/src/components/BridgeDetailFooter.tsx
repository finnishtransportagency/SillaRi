import React from "react";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import file from "../theme/icons/file.svg";
import { DATE_TIME_FORMAT_MIN, SupervisionStatus } from "../utils/constants";
import { useMutation, useQueryClient } from "react-query";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { onRetry, startSupervision } from "../utils/supervisionBackendData";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

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

  const { permitNumber } = permit || {};
  const { id: supervisionId, conformsToPermit = false, currentStatus, startedTime } = supervision || {};
  const supervisionStarted = currentStatus && currentStatus.status !== SupervisionStatus.PLANNED;

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((initialReport: ISupervisionReport) => startSupervision(initialReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      history.push(`/supervision/${supervisionId}`);
    },
  });

  const start = () => {
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

  return (
    <>
      <IonItem className="itemIcon" detail detailIcon={file} lines="none">
        <IonLabel className="headingText">{t("bridge.transportPermit")}</IonLabel>
        <IonLabel>{permitNumber}</IonLabel>
      </IonItem>

      {!isLoadingSupervision && !supervisionId && (
        <IonItem color="danger" className="itemIcon" detail detailIcon="" lines="none">
          <IonLabel className="headingText">{t("bridge.supervisionMissing")}</IonLabel>
        </IonItem>
      )}
      {!isLoadingSupervision && supervisionStarted && (
        <IonItem color="success" className="itemIcon" detail detailIcon="" lines="none">
          <IonLabel className="headingText">{t("bridge.supervisionStarted")}</IonLabel>
          <IonLabel>{startedTime ? <Moment format={DATE_TIME_FORMAT_MIN}>{startedTime}</Moment> : ""}</IonLabel>
        </IonItem>
      )}

      <IonItem lines="none">
        <IonCheckbox
          slot="start"
          value="conforms"
          checked={conformsToPermit}
          disabled={!supervisionId || supervisionStarted}
          onClick={() => setConformsToPermit(!conformsToPermit)}
        />
        <IonLabel>{t("bridge.conformsToPermit")}</IonLabel>
      </IonItem>

      <IonGrid>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton
              disabled={!supervisionId || !conformsToPermit || supervisionStarted}
              color="primary"
              expand="block"
              size="large"
              onClick={() => start()}
            >
              {t("bridge.startSupervision")}
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton
              disabled={!supervisionId || supervisionStarted}
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
