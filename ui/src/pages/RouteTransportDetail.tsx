import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { onlineManager, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteAccordion from "../components/RouteAccordion";
import RouteTransportDetailHeader from "../components/RouteTransportDetailHeader";
import TransportInfoAccordion from "../components/TransportInfoAccordion";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import { useTypedSelector, RootState } from "../store/store";
import { getUserData, onRetry } from "../utils/backendData";
import { getRouteTransportOfSupervisor } from "../utils/supervisionBackendData";
import BridgeCardList from "../components/BridgeCardList";
import IRouteTransport from "../interfaces/IRouteTransport";
import { sortSupervisionsByBridgeOrder } from "../utils/supervisionUtil";

interface RouteTransportDetailProps {
  routeTransportId: string;
  message: string;
}

const RouteTransportDetail = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const { routeTransportId = "0", message = "" } = useParams<RouteTransportDetailProps>();
  const [toastMessage, setToastMessage] = useState(message);

  const { data: supervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const { username = "" } = supervisorUser || {};

  const { data: routeTransport } = useQuery(
    ["getRouteTransportOfSupervisor", Number(routeTransportId)],
    () => getRouteTransportOfSupervisor(Number(routeTransportId), username, null, dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: !!username,
    }
  );

  const openRouteMap = (routeId?: number) => {
    if (routeId) {
      history.push(`/routemap/${routeId}`);
    }
  };

  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => setOnline(onlineManager.isOnline()));
  }, []);

  const { route, transportNumber, supervisions = [] } = routeTransport || {};
  const { name = "", permit } = route || {};

  // Sort the supervisions into permit bridge order so the list is the same regardless of whether each supervision has started or not
  sortSupervisionsByBridgeOrder(supervisions);

  const noNetworkNoData = isFailed.getRouteTransportOfSupervisor && routeTransport === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteTransportOfSupervisor} includeSendingList includeOfflineBanner />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <RouteTransportDetailHeader permit={permit as IPermit} routeTransport={routeTransport as IRouteTransport} />
            <RouteAccordion route={route as IRoute} transportNumber={transportNumber} mapDisabled={!isOnline} openMap={openRouteMap} />
            <TransportInfoAccordion permit={permit as IPermit} />

            <BridgeCardList username={username} routeTransport={routeTransport as IRouteTransport} supervisions={supervisions} isOnline={isOnline} />
          </>
        )}
        <IonToast
          isOpen={toastMessage.length > 0}
          message={toastMessage}
          onDidDismiss={() => setToastMessage("")}
          duration={5000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default RouteTransportDetail;
