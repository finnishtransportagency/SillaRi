import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  reportId?: number;
  isDraft: boolean;
  isLoading: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
}

const SupervisionFooter = ({ reportId, isDraft, isLoading, saveChanges, cancelChanges }: SupervisionFooterProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" disabled={!reportId || reportId < 0 || isLoading} onClick={() => saveChanges()}>
            {isDraft ? t("supervision.buttons.summary") : t("supervision.buttons.saveToSendList")}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="secondary" onClick={() => cancelChanges()}>
            {isDraft ? t("common.buttons.cancel") : t("common.buttons.edit")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
