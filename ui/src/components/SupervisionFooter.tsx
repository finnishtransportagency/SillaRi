import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  reportId?: number;
  isSummary: boolean;
  isLoading: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
}

const SupervisionFooter = ({ reportId, isSummary, isLoading, saveChanges, cancelChanges }: SupervisionFooterProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" expand="block" size="large" disabled={!reportId || reportId < 0 || isLoading} onClick={() => saveChanges()}>
            {isSummary ? t("supervision.buttons.saveToSendList") : t("supervision.buttons.summary")}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="tertiary" expand="block" size="large" disabled={!reportId || reportId < 0} onClick={() => cancelChanges()}>
            {isSummary ? t("common.buttons.edit") : t("common.buttons.cancel")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
