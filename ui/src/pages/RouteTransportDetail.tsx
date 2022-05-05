import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteAccordion from "../components/RouteAccordion";
import RouteTransportDetailHeader from "../components/RouteTransportDetailHeader";
import TransportInfoAccordion from "../components/TransportInfoAccordion";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import { useTypedSelector, RootState } from "../store/store";
import { onRetry } from "../utils/backendData";
import { getRouteTransportOfSupervisor } from "../utils/supervisionBackendData";
import BridgeCardList from "../components/BridgeCardList";
import IRouteTransport from "../interfaces/IRouteTransport";
import { sortSupervisionsByBridgeOrder } from "../utils/supervisionUtil";

interface RouteTransportDetailProps {
  routeTransportId: string;
}

const RouteTransportDetail = (): JSX.Element => {
  const dispatch = useDispatch();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const { routeTransportId = "0" } = useParams<RouteTransportDetailProps>();

  const { data: routeTransport } = useQuery(
    ["getRouteTransportOfSupervisor", Number(routeTransportId)],
    () => getRouteTransportOfSupervisor(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );

  const { route, supervisions = [] } = routeTransport || {};
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
            <RouteAccordion route={route as IRoute} />
            <TransportInfoAccordion permit={permit as IPermit} />

            <BridgeCardList supervisions={supervisions} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RouteTransportDetail;
