import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import RouteTransportInfo from "../../components/management/RouteTransportInfo";
import IPermit from "../../interfaces/IPermit";
import { useTypedSelector } from "../../store/store";
import { getPermitOfRouteTransport, getRouteTransport, getSupervisors, onRetry } from "../../utils/backendData";

interface TransportDetailProps {
  routeTransportId: string;
}

const TransportDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedPermitDetail,
    selectedRouteTransportDetail,
    supervisorList,
    networkStatus: { isFailed = {} },
  } = crossings;

  const { routeTransportId = "0" } = useParams<TransportDetailProps>();

  useQuery(["getRouteTransport", routeTransportId], () => getRouteTransport(Number(routeTransportId), dispatch, selectedRouteTransportDetail), {
    retry: onRetry,
  });
  useQuery(
    ["getPermitOfRouteTransport", routeTransportId],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch, selectedRouteTransportDetail),
    {
      retry: onRetry,
    }
  );
  useQuery(["getSupervisors"], () => getSupervisors(dispatch), { retry: onRetry });

  const noNetworkNoData =
    (isFailed.getRouteTransport && selectedRouteTransportDetail === undefined) ||
    (isFailed.getPermitOfRouteTransport && selectedPermitDetail === undefined) ||
    (isFailed.getSupervisors && supervisorList.length === 0);

  return (
    <IonPage>
      <Header title={t("management.addTransport.headerTitle")} somethingFailed={isFailed.getPermit} />
      <IonContent fullscreen color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <RouteTransportInfo permit={selectedPermitDetail as IPermit} routeTransport={selectedRouteTransportDetail} supervisors={supervisorList} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default TransportDetail;
