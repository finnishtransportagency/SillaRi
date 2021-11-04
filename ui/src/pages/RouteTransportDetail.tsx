import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteAccordion from "../components/RouteAccordion";
import PermitDetailHeader from "../components/PermitDetailHeader";
import PermitTransportAccordion from "../components/PermitTransportAccordion";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import { useTypedSelector } from "../store/store";
import { getRouteTransportOfSupervisor, onRetry } from "../utils/supervisionBackendData";
import BridgeCardList from "../components/BridgeCardList";

interface RouteTransportDetailProps {
  routeTransportId: string;
}

const RouteTransportDetail = (): JSX.Element => {
  const dispatch = useDispatch();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { routeTransportId = "0" } = useParams<RouteTransportDetailProps>();

  // TODO change to logged in user
  const username = "USER1";

  const { data: routeTransport } = useQuery(
    ["getRouteTransportOfSupervisor", routeTransportId],
    () => getRouteTransportOfSupervisor(Number(routeTransportId), username, dispatch),
    { retry: onRetry }
  );

  const { route, supervisions = [] } = routeTransport || {};
  const { name = "", permit } = route || {};

  const noNetworkNoData = isFailed.getRouteTransportOfSupervisor && routeTransport === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteTransportOfSupervisor} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <PermitDetailHeader permit={permit as IPermit} />
            <RouteAccordion route={route as IRoute} />
            <PermitTransportAccordion permit={permit as IPermit} />

            <BridgeCardList supervisions={supervisions} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RouteTransportDetail;
