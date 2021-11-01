import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getPermitOfRouteTransport, getRouteTransport, onRetry } from "../../utils/managementBackendData";
import moment from "moment";
import { DATE_TIME_FORMAT_MIN } from "../../utils/constants";
import "./Transport.css";
import { map } from "ionicons/icons";

interface TransportProps {
  routeTransportId: string;
}

const Transport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.supervisionReducer);

  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { routeTransportId = "3" } = useParams<TransportProps>();

  const { data: selectedRouteTransportDetails } = useQuery(
    ["getRouteTransport", routeTransportId],
    () => getRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
    }
  );

  const { data: selectedPermitDetails } = useQuery(
    ["getPermitOfRouteTransport", routeTransportId],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );

  const noNetworkNoData = selectedRouteTransportDetails === undefined;

  const departureTime = selectedRouteTransportDetails?.plannedDepartureTime;

  return (
    <IonPage>
      <Header title={t("transports.transport.header.title")} somethingFailed={isFailed.getRouteTransport} />
      <IonContent class="ion-padding" color="light">
        {noNetworkNoData || !selectedRouteTransportDetails || !selectedPermitDetails ? (
          <NoNetworkNoData />
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol class="ion-text-end">
                <IonText>
                  {t("transports.transport.permitLabel")} {selectedPermitDetails.permitNumber} (pdf)
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <h3>
                  <IonText>{`${moment(departureTime).format(DATE_TIME_FORMAT_MIN)}`}</IonText>
                </h3>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText>
                  {t("transports.transport.routeLabel")} {selectedRouteTransportDetails.route?.name}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">
                <IonButton color="#ffffff">
                  <IonIcon slot="start" icon={map}></IonIcon>
                  {t("transports.transport.mapButtonLabel")}
                </IonButton>
              </IonCol>
              <IonCol>
                <div>{selectedRouteTransportDetails.route?.departureAddress.streetAddress}</div>
                <div>{selectedRouteTransportDetails.route?.arrivalAddress.streetAddress}</div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-text-left">
                <IonText>{t("transports.transport.transportStatusLabel")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-text-center">
                <div className="statusBox">{t("transports.transport.transportStatusBoxLabel.notStarted")}</div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-text-left">
                <IonButton>{t("transports.transport.startDrivingButtonLabel")}</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Transport;
