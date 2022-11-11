import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonFooter, IonGrid, IonRow, IonText, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

interface RouteTransportFooterProps {
  isEditable: boolean;
  allowedToDelete: boolean;
  routeTransportId: number;
  deleteTransport: () => void;
  saveTransport: () => void;
  deleteDisabled: boolean;
  cancelDisabled: boolean;
  saveDisabled: boolean;
}

const RouteTransportFooter = ({
  isEditable,
  allowedToDelete,
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
      <IonToolbar color="light">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-end">
            {!!routeTransportId && routeTransportId > 0 && (isEditable || allowedToDelete) && (
              <IonCol size-sm className="ion-text-center">
                <IonButton color="tertiary" expand="block" size="large" disabled={deleteDisabled} onClick={() => deleteTransport()}>
                  <IonText>{t("management.transportDetail.buttons.deleteTransport")}</IonText>
                </IonButton>
              </IonCol>
            )}
            {isEditable && (
              <>
                <IonCol size-sm className="ion-text-center">
                  <IonButton color="secondary" expand="block" size="large" disabled={cancelDisabled} onClick={() => history.goBack()}>
                    <IonText>{t("common.buttons.cancel")}</IonText>
                  </IonButton>
                </IonCol>
                <IonCol size-sm className="ion-text-center">
                  <IonButton color="primary" expand="block" size="large" disabled={saveDisabled} onClick={() => saveTransport()}>
                    <IonText>{t("common.buttons.save")}</IonText>
                  </IonButton>
                </IonCol>
              </>
            )}
            {!isEditable && (
              <IonCol size-sm className="ion-text-center">
                <IonButton color="primary" expand="block" size="large" disabled={cancelDisabled} onClick={() => history.goBack()}>
                  <IonText>{t("common.buttons.back2")}</IonText>
                </IonButton>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonFooter>
  );
};

export default RouteTransportFooter;
