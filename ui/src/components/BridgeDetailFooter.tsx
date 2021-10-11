import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import { document } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import { SupervisionStatus } from "../utils/constants";
import "./BridgeDetailFooter.css";

interface BridgeDetailFooterProps {
  permit: IPermit;
  supervision: ISupervision;
  isLoadingSupervision: boolean;
  setConformsToPermit: (conforms: boolean) => void;
}

const BridgeDetailFooter = ({ permit, supervision, isLoadingSupervision, setConformsToPermit }: BridgeDetailFooterProps): JSX.Element => {
  const { t } = useTranslation();

  const { permitNumber } = permit || {};
  const { id: supervisionId, routeBridgeId, conformsToPermit = false, currentStatus } = supervision || {};
  const supervisionStarted = currentStatus && currentStatus.status !== SupervisionStatus.PLANNED;

  return (
    <>
      <IonItem className="bridgeDetailFooter" detail detailIcon={document} lines="none">
        <IonLabel className="headingText">{t("bridge.permitNumber")}</IonLabel>
        <IonLabel>{permitNumber}</IonLabel>
      </IonItem>

      {!isLoadingSupervision && !supervisionId && (
        <IonItem lines="none">
          <IonLabel class="crossingLabelWarning">{t("bridge.supervisionMissing")}</IonLabel>
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
            <IonButton disabled={!supervisionId || supervisionStarted} color="primary" routerLink={`/denyCrossing/${routeBridgeId}`}>
              {t("bridge.denyCrossing")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default BridgeDetailFooter;
