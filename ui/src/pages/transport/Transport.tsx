import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import PermitLinkText from "../../components/PermitLinkText";
import RouteAccordion from "../../components/RouteAccordion";
import TransportStatusGrid from "../../components/transport/TransportStatusGrid";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import { useTypedSelector, RootState } from "../../store/store";
import { onRetry } from "../../utils/backendData";
import { getRouteTransport, getPermitOfRouteTransport } from "../../utils/transportBackendData";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";

interface TransportProps {
  transportPassword: string;
}

const Transport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state: RootState) => state.rootReducer);

  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { transportPassword = "" } = useParams<TransportProps>();

  const { data: selectedRouteTransportDetail } = useQuery(
    ["transport/getRouteTransport", transportPassword],
    () => getRouteTransport(transportPassword, dispatch),
    {
      retry: onRetry,
    }
  );

  const { data: selectedPermitDetail } = useQuery(
    ["getPermitOfRouteTransport", transportPassword],
    () => getPermitOfRouteTransport(transportPassword, dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );

  const { plannedDepartureTime, route, currentStatus, statusHistory = [] } = selectedRouteTransportDetail || {};
  const { name: routeName } = route || {};
  const { status, time } = currentStatus || {};

  const departureTime = useMemo(() => statusHistory.find((history) => history.status === TransportStatus.DEPARTED), [statusHistory]);

  const noNetworkNoData =
    (isFailed.getRouteTransport && selectedRouteTransportDetail === undefined) ||
    (isFailed.getPermitOfRouteTransport && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header title={routeName ?? ""} somethingFailed={isFailed.getRouteTransport || isFailed.getPermitOfRouteTransport} />
      <IonContent color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <IonGrid className="ion-no-padding" fixed>
              {departureTime && departureTime.time ? (
                <IonRow className="ion-margin">
                  <IonCol size="12" size-sm="3" size-lg="2">
                    <IonText className="headingText">{t("transports.transport.departureTime")}</IonText>
                  </IonCol>
                  <IonCol size="12" size-sm="9" size-lg="10">
                    <IonText>{`${moment(departureTime.time).format(DATE_TIME_FORMAT_MIN)}`}</IonText>
                  </IonCol>
                </IonRow>
              ) : (
                <IonRow className="ion-margin">
                  <IonCol size="12" size-sm="3" size-lg="2">
                    <IonText className="headingText">{t("transports.transport.estimatedDepartureTime")}</IonText>
                  </IonCol>
                  <IonCol size="12" size-sm="9" size-lg="10">
                    <IonText>{`${moment(plannedDepartureTime).format(DATE_TIME_FORMAT_MIN)}`}</IonText>
                  </IonCol>
                </IonRow>
              )}

              <IonRow className="ion-margin">
                <IonCol size="12" size-sm="3" size-lg="2">
                  <IonText className="headingText">{t("transports.transport.permitLabel")}</IonText>
                </IonCol>
                <IonCol size="12" size-sm="9" size-lg="10">
                  <PermitLinkText permit={selectedPermitDetail as IPermit} />
                </IonCol>
              </IonRow>

              <IonRow className="ion-margin-top ion-margin-bottom">
                <IonCol size="12">
                  <RouteAccordion route={route as IRoute} />
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
                        {status && (
                          <IonText>{`${t(`transports.transport.statusInfo.${status.toLowerCase()}`)} ${
                            status !== TransportStatus.PLANNED && time ? moment(time).format(DATE_TIME_FORMAT_MIN) : ""
                          }`}</IonText>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>

            <TransportStatusGrid
              transportPassword={transportPassword}
              selectedRouteTransportDetail={selectedRouteTransportDetail as IRouteTransport}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Transport;
