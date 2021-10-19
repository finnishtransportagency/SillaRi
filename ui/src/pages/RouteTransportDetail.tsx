import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteAccordion from "../components/RouteAccordion";
import RouteDetailHeader from "../components/RouteDetailHeader";
import PermitTransportAccordion from "../components/PermitTransportAccordion";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import { useTypedSelector } from "../store/store";
import { getRouteTransportOfSupervisor, onRetry } from "../utils/supervisionBackendData";

interface RouteTransportDetailProps {
  routeTransportId: string;
}

const RouteTransportDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    selectedRouteTransport,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);
  const { route, supervisions } = selectedRouteTransport || {};
  const { name = "", permit } = route || {};

  const { routeTransportId = "0" } = useParams<RouteTransportDetailProps>();

  // TODO change to logged in user
  const username = "USER1";

  useQuery(
    ["getRouteTransportOfSupervisor", routeTransportId],
    () => getRouteTransportOfSupervisor(Number(routeTransportId), username, dispatch, selectedRouteTransport),
    { retry: onRetry }
  );

  const noNetworkNoData = isFailed.getRouteTransportOfSupervisor && selectedRouteTransport === undefined;

  // TODO - check if the transportValid checkbox is still needed
  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteTransportOfSupervisor} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <RouteDetailHeader permit={permit as IPermit} />
            <RouteAccordion route={route as IRoute} />
            <PermitTransportAccordion permit={permit as IPermit} />

            {/*<BridgeCardList routeBridges={routeBridges} />*/}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RouteTransportDetail;
