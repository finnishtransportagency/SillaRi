import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import ISupervision from "../interfaces/ISupervision";

interface SupervisionFooterProps {
  supervision: ISupervision;
  summaryClicked: () => void;
}

const SupervisionFooter = ({ supervision, summaryClicked }: SupervisionFooterProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  const { report } = supervision || {};
  const { id: supervisionReportId = -1 } = report || {};

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" disabled={supervisionReportId <= 0} onClick={() => summaryClicked()}>
            {t("supervision.buttons.summary")}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="secondary" onClick={() => history.goBack()}>
            {t("supervision.buttons.cancel")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
