import React, { useState } from "react";
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
import { onRetry } from "../utils/backendData";
import { getRouteTransportOfSupervisor } from "../utils/supervisionBackendData";
import BridgeCardList from "../components/BridgeCardList";
import { filterFinishedSupervisions } from "../utils/supervisionUtil";
import ISupervision from "../interfaces/ISupervision";

interface RouteTransportDetailProps {
  routeTransportId: string;
}

const RouteTransportDetail = (): JSX.Element => {
  const dispatch = useDispatch();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { routeTransportId = "0" } = useParams<RouteTransportDetailProps>();
  const [supervisions, setSupervisions] = useState<ISupervision[]>([]);

  const { data: routeTransport } = useQuery(
    ["getRouteTransportOfSupervisor", routeTransportId],
    () => getRouteTransportOfSupervisor(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      onSuccess: (data) => {
        const { supervisions: routeTransportSupervisions } = data || {};
        setSupervisions(filterFinishedSupervisions(routeTransportSupervisions));
      },
    }
  );

  const { route } = routeTransport || {};
  const { name = "", permit } = route || {};

  const noNetworkNoData = isFailed.getRouteTransportOfSupervisor && routeTransport === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteTransportOfSupervisor} includeSendingList />
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
