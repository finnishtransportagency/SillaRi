import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonCheckbox, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import Header from "../components/Header";
import BridgeCardList from "../components/BridgeCardList";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RoutePermit from "../components/RoutePermit";
import RouteTransport from "../components/RouteTransport";
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
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name = "", routeBridges = [] } = selectedRouteDetail || {};

  const { routeId = "0" } = useParams<RouteDetailProps>();

  useQuery(["getRoute", routeId], () => getRoute(Number(routeId), dispatch, selectedRouteDetail), { retry: onRetry });
  useQuery(["getPermitOfRoute", routeId], () => getPermitOfRoute(Number(routeId), dispatch, selectedRouteDetail), { retry: onRetry });

  const noNetworkNoData =
    (isFailed.getRoute && selectedRouteDetail === undefined) || (isFailed.getPermitOfRoute && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header title={`${permitNumber} - ${name}`} somethingFailed={isFailed.getRoute || isFailed.getPermitOfRoute} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <RoutePermit selectedPermit={selectedPermitDetail as IPermit} selectedRoute={selectedRouteDetail as IRoute} />
            <RouteTransport selectedPermit={selectedPermitDetail as IPermit} />

            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  <IonCheckbox checked={transportValid} onIonChange={(e) => setTransportValid(e.detail.checked)} />
                </IonCol>
                <IonCol>
                  <IonText>{t("route.transportValid")} </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>

            <BridgeCardList routeBridges={routeBridges} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
