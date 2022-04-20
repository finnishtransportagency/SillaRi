import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonFooter, IonRow, IonText, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

interface RouteTransportFooterProps {
  isEditable: boolean;
  routeTransportId: number;
  deleteTransport: () => void;
  saveTransport: () => void;
  deleteDisabled: boolean;
  cancelDisabled: boolean;
  saveDisabled: boolean;
}

const RouteTransportFooter = ({
  isEditable,
  routeTransportId,
  deleteTransport,
  saveTransport,
  deleteDisabled,
  cancelDisabled,
  saveDisabled,
}: RouteTransportFooterProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <IonFooter>
      <IonToolbar>
        {isEditable && (
          <IonRow className="ion-margin ion-justify-content-end">
            {!!routeTransportId && routeTransportId > 0 && (
              <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
                <IonButton color="tertiary" expand="block" size="large" disabled={deleteDisabled} onClick={() => deleteTransport()}>
                  <IonText>{t("management.transportDetail.buttons.deleteTransport")}</IonText>
                </IonButton>
              </IonCol>
            )}
            <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
              <IonButton color="secondary" expand="block" size="large" disabled={cancelDisabled} onClick={() => history.goBack()}>
                <IonText>{t("common.buttons.cancel")}</IonText>
              </IonButton>
            </IonCol>
            <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
              <IonButton color="primary" expand="block" size="large" disabled={saveDisabled} onClick={() => saveTransport()}>
                <IonText>{t("common.buttons.save")}</IonText>
              </IonButton>
            </IonCol>
          </IonRow>
        )}

        {!isEditable && (
          <IonRow className="ion-margin ion-justify-content-end">
            <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
              <IonButton color="primary" expand="block" size="large" disabled={cancelDisabled} onClick={() => history.goBack()}>
                <IonText>{t("common.buttons.back2")}</IonText>
              </IonButton>
            </IonCol>
          </IonRow>
        )}
      </IonToolbar>
    </IonFooter>
  );
};

export default RouteTransportFooter;
