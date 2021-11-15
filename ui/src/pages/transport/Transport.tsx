import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import RouteAccordion from "../../components/RouteAccordion";
import TransportStatusGrid from "../../components/management/TransportStatusGrid";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import { useTypedSelector } from "../../store/store";
import { getPermitOfRouteTransport, getRouteTransport, onRetry } from "../../utils/managementBackendData";
import { DATE_TIME_FORMAT_MIN } from "../../utils/constants";

interface TransportProps {
  routeTransportId: string;
}

const Transport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);

  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { routeTransportId = "0" } = useParams<TransportProps>();

  const { data: selectedRouteTransportDetail } = useQuery(
    ["getRouteTransport", routeTransportId],
    () => getRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
    }
  );

  const { data: selectedPermitDetail } = useQuery(
    ["getPermitOfRouteTransport", routeTransportId],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );

  const { plannedDepartureTime, route, currentStatus } = selectedRouteTransportDetail || {};
  const { permitNumber } = selectedPermitDetail || {};
  const { name: routeName } = route || {};
  const { status, time } = currentStatus || {};

  const headerText = `${moment(plannedDepartureTime).format(DATE_TIME_FORMAT_MIN)} - ${routeName}`;

  const noNetworkNoData =
    (isFailed.getRouteTransport && selectedRouteTransportDetail === undefined) ||
    (isFailed.getPermitOfRouteTransport && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header title={headerText} somethingFailed={isFailed.getRouteTransport || isFailed.getPermitOfRouteTransport} />
      <IonContent fullscreen color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <IonGrid className="ion-no-padding" fixed>
              <IonRow>
                <IonCol size="12" className="whiteBackground">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="3" size-lg="2">
                        <IonText className="headingText">{t("transports.transport.permitLabel")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="9" size-lg="10">
                        <IonText>{permitNumber}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol className="whiteBackground">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol>
                        <RouteAccordion route={route as IRoute} isPanelOpen />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12" className="whiteBackground">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="3" size-lg="2">
                        <IonText className="headingText">{t("transports.transport.transportStatusLabel")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="9" size-lg="10">
                        {!!status && (
                          <IonText>{`${t(`transports.transport.statusInfo.${status.toLowerCase()}`)} ${
                            time ? moment(time).format(DATE_TIME_FORMAT_MIN) : ""
                          }`}</IonText>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>

            <TransportStatusGrid selectedRouteTransportDetail={selectedRouteTransportDetail as IRouteTransport} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Transport;
