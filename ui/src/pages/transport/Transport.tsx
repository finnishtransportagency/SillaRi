import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import RouteAccordion from "../../components/RouteAccordion";
import IRoute from "../../interfaces/IRoute";
import { useTypedSelector } from "../../store/store";
import arrowLeft from "../../theme/icons/arrow-left.svg";
import { getPermitOfRouteTransport, getRouteTransport, onRetry } from "../../utils/managementBackendData";
import { DATE_TIME_FORMAT_MIN } from "../../utils/constants";

interface TransportProps {
  routeTransportId: string;
}

const Transport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const management = useTypedSelector((state) => state.supervisionReducer);

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

  const { plannedDepartureTime, route } = selectedRouteTransportDetail || {};
  const { permitNumber } = selectedPermitDetail || {};
  const { name: routeName } = route || {};

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
                    <IonCol size="12" size-sm="4" size-lg="3">
                      <IonText className="headingText">{t("transports.transport.transportStatusLabel")}</IonText>
                    </IonCol>
                    <IonCol size="12" size-sm="8" size-lg="9">
                      <IonText>{t("transports.transport.transportStatusBoxLabel.notStarted")}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12" className="whiteBackground">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-margin">
                    <IonCol size="12" size-sm="6" size-lg="5" className="ion-padding-end ion-padding-bottom">
                      <IonButton color="primary" expand="block" size="large">
                        {t("transports.transport.startDrivingButtonLabel")}
                      </IonButton>
                    </IonCol>
                    <IonCol size="12" size-sm="4" size-lg="3" className="ion-padding-end ion-padding-bottom">
                      <IonButton color="tertiary" expand="block" size="large" onClick={() => history.goBack()}>
                        <IonIcon className="otherIcon" icon={arrowLeft} slot="start" />
                        {t("common.buttons.back2")}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Transport;
