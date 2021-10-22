import React from "react";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import { document } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import { DATE_TIME_FORMAT_MIN, SupervisionStatus } from "../utils/constants";

interface BridgeDetailFooterProps {
  permit: IPermit;
  supervision: ISupervision;
  isLoadingSupervision: boolean;
  setConformsToPermit: (conforms: boolean) => void;
}

const BridgeDetailFooter = ({ permit, supervision, isLoadingSupervision, setConformsToPermit }: BridgeDetailFooterProps): JSX.Element => {
  const { t } = useTranslation();

  const { permitNumber } = permit || {};
  const { id: supervisionId, conformsToPermit = false, currentStatus, startedTime } = supervision || {};
  const supervisionStarted = currentStatus && currentStatus.status !== SupervisionStatus.PLANNED;

  return (
    <>
      <IonItem className="itemIcon" detail detailIcon={document} lines="none">
        <IonLabel className="headingText">{t("bridge.permitNumber")}</IonLabel>
        <IonLabel>{permitNumber}</IonLabel>
      </IonItem>

      {!isLoadingSupervision && !supervisionId && (
        <IonItem color="danger" lines="none">
          <IonLabel>{t("bridge.supervisionMissing")}</IonLabel>
        </IonItem>
      )}
      {!isLoadingSupervision && supervisionStarted && (
        <IonItem color="success" lines="none">
          <IonLabel>{t("bridge.supervisionStarted")}</IonLabel>
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
              routerLink={`/supervision/${supervisionId}`}
            >
              {t("bridge.startSupervision")}
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton disabled={!supervisionId || supervisionStarted} color="secondary" routerLink={`/denyCrossing/${supervisionId}`}>
              {t("bridge.denyCrossing")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default BridgeDetailFooter;
