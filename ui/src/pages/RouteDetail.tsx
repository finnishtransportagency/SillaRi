import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonCheckbox, IonContent, IonItem, IonLabel, IonPage } from "@ionic/react";
import Header from "../components/Header";
import BridgeCardList from "../components/BridgeCardList";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteAccordion from "../components/RouteAccordion";
import RouteDetailHeader from "../components/RouteDetailHeader";
import TransportAccordion from "../components/TransportAccordion";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import { useTypedSelector } from "../store/store";
import { getPermitOfRoute, getRoute, onRetry } from "../utils/backendData";

interface RouteDetailProps {
  routeId: string;
}

const RouteDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [transportValid, setTransportValid] = useState(false);

  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedPermitDetail,
    selectedRouteDetail,
    networkStatus: { isFailed = {} },
  } = crossingsState;
  const { name = "", routeBridges = [] } = selectedRouteDetail || {};

  const { routeId = "0" } = useParams<RouteDetailProps>();

  useQuery(["getRoute", routeId], () => getRoute(Number(routeId), dispatch, selectedRouteDetail), { retry: onRetry });
  useQuery(["getPermitOfRoute", routeId], () => getPermitOfRoute(Number(routeId), dispatch, selectedRouteDetail), { retry: onRetry });

  const noNetworkNoData =
    (isFailed.getRoute && selectedRouteDetail === undefined) || (isFailed.getPermitOfRoute && selectedPermitDetail === undefined);

  // TODO - check if the transportValid checkbox is still needed
  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRoute || isFailed.getPermitOfRoute} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <RouteDetailHeader permit={selectedPermitDetail as IPermit} />
            <RouteAccordion route={selectedRouteDetail as IRoute} />
            <TransportAccordion permit={selectedPermitDetail as IPermit} />

            <IonItem lines="none">
              <IonCheckbox slot="start" checked={transportValid} onIonChange={(e) => setTransportValid(e.detail.checked)} />
              <IonLabel>{t("route.transportValid")}</IonLabel>
            </IonItem>

            <BridgeCardList routeBridges={routeBridges} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
