import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText, useIonAlert } from "@ionic/react";
import IRouteTransport from "../../interfaces/IRouteTransport";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import arrowLeft from "../../theme/icons/arrow-left.svg";
import { onRetry } from "../../utils/backendData";
import { changeRouteTransportStatus } from "../../utils/managementBackendData";
import { TransportStatus } from "../../utils/constants";
import "./TransportStatusGrid.css";

interface TransportStatusGridProps {
  selectedRouteTransportDetail: IRouteTransport;
}

const TransportStatusGrid = ({ selectedRouteTransportDetail }: TransportStatusGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [present] = useIonAlert();

  const { id: routeTransportId, currentStatus } = selectedRouteTransportDetail || {};
  const { status } = currentStatus || {};

  const routeTransportStatusMutation = useMutation(
    (routeTransportStatus: IRouteTransportStatus) => changeRouteTransportStatus(routeTransportStatus, dispatch),
    {
      retry: onRetry,
      onSuccess: () => {
        // Update the route transport detail to force the grid to update
        // queryClient.setQueryData(["getRouteTransport", routeTransportId], data);
        queryClient.invalidateQueries("getRouteTransport");
      },
    }
  );

  const { isLoading: isChangingTransportStatus } = routeTransportStatusMutation;

  const changeStatus = (newStatus: TransportStatus) => {
    const newTransportStatus: IRouteTransportStatus = { id: 0, routeTransportId, status: newStatus };
    routeTransportStatusMutation.mutate(newTransportStatus);
  };

  const confirmArrival = () => {
    // Ask the user to confirm that they want to end the transport
    present({
      header: t("transports.transport.stopAlert.title"),
      message: t("transports.transport.stopAlert.message"),
      buttons: [
        { text: t("transports.transport.stopAlert.confirm"), handler: () => changeStatus(TransportStatus.ARRIVED) },
        t("common.buttons.back2"),
      ],
    });
  };

  return (
    <IonGrid className="ion-no-padding" fixed>
      <IonRow>
        <IonCol size="12" className="whiteBackground">
          <IonGrid className="ion-no-padding">
            {(status === TransportStatus.DEPARTED ||
              status === TransportStatus.IN_PROGRESS ||
              status === TransportStatus.STOPPED ||
              status === TransportStatus.ARRIVED) && (
              <IonRow className="ion-margin">
                <IonCol className={`ion-padding ion-text-center statusBox status_${status.toLowerCase()}`}>
                  <IonText className="headingBoldText">{t(`transports.transport.status.${status.toLowerCase()}`).toUpperCase()}</IonText>
                </IonCol>
              </IonRow>
            )}

            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="6" className="ion-padding-bottom">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-no-margin ion-justify-content-start">
                    <IonCol size="12">
                      {status === TransportStatus.PLANNED && (
                        <IonButton
                          color="primary"
                          expand="block"
                          size="large"
                          disabled={isChangingTransportStatus}
                          onClick={() => changeStatus(TransportStatus.DEPARTED)}
                        >
                          {t("transports.transport.buttons.startDriving")}
                        </IonButton>
                      )}
                      {(status === TransportStatus.DEPARTED || status === TransportStatus.IN_PROGRESS) && (
                        <IonButton
                          color="primary"
                          expand="block"
                          size="large"
                          disabled={isChangingTransportStatus}
                          onClick={() => changeStatus(TransportStatus.STOPPED)}
                        >
                          {t("transports.transport.buttons.startBreak")}
                        </IonButton>
                      )}
                      {status === TransportStatus.STOPPED && (
                        <IonButton
                          color="primary"
                          expand="block"
                          size="large"
                          disabled={isChangingTransportStatus}
                          onClick={() => changeStatus(TransportStatus.IN_PROGRESS)}
                        >
                          {t("transports.transport.buttons.stopBreak")}
                        </IonButton>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

              <IonCol size="12" size-sm="6" className="ion-padding-bottom">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-no-margin ion-justify-content-end">
                    <IonCol size="12" size-sm="8" size-lg="6">
                      {(!status || status === TransportStatus.PLANNED || status === TransportStatus.ARRIVED) && (
                        <IonButton color="tertiary" expand="block" size="large" disabled={isChangingTransportStatus} onClick={() => history.goBack()}>
                          <IonIcon className="otherIcon" icon={arrowLeft} slot="start" />
                          {t("common.buttons.back2")}
                        </IonButton>
                      )}

                      {(status === TransportStatus.DEPARTED || status === TransportStatus.IN_PROGRESS || status === TransportStatus.STOPPED) && (
                        <IonButton color="tertiary" expand="block" size="large" disabled={isChangingTransportStatus} onClick={confirmArrival}>
                          {t("transports.transport.buttons.stopDriving")}
                        </IonButton>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TransportStatusGrid;
