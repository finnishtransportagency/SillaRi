import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SupervisionFooterProps {
  report: ISupervisionReport;
  isLoading: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
}

const SupervisionFooter = ({ report, isLoading, saveChanges, cancelChanges }: SupervisionFooterProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: supervisionReportId, draft } = report || {};

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" disabled={supervisionReportId <= 0 || isLoading} onClick={() => saveChanges()}>
            {draft ? t("supervision.buttons.summary") : t("supervision.buttons.saveToSendList")}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="secondary" onClick={() => cancelChanges()}>
            {draft ? t("common.buttons.cancel") : t("common.buttons.edit")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

SupervisionFooter.defaultProps = {
  setToastMessage: undefined,
};

export default SupervisionFooter;
