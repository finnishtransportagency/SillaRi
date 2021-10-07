import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import RouteTransportInfo from "../../components/management/RouteTransportInfo";
import IPermit from "../../interfaces/IPermit";
import { actions as managementActions } from "../../store/managementSlice";
import { useTypedSelector } from "../../store/store";
import { getPermitOfRouteTransport, getRouteTransport, getSupervisors, onRetry } from "../../utils/managementBackendData";

interface TransportDetailProps {
  routeTransportId: string;
}

const TransportDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState("");

  const management = useTypedSelector((state) => state.managementReducer);
  const {
    selectedPermitDetail,
    selectedRouteTransportDetail,
    supervisorList,
    isRouteTransportModified,
    networkStatus: { isFailed = {} },
  } = management;

  const { routeTransportId = "0" } = useParams<TransportDetailProps>();

  const { isLoading: isLoadingTransport } = useQuery(
    ["getRouteTransport", routeTransportId],
    () => getRouteTransport(Number(routeTransportId), dispatch, selectedRouteTransportDetail),
    {
      retry: onRetry,
    }
  );
  const { isLoading: isLoadingPermit } = useQuery(
    ["getPermitOfRouteTransport", routeTransportId],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch, selectedRouteTransportDetail),
    {
      retry: onRetry,
    }
  );
  useQuery(["getSupervisors"], () => getSupervisors(dispatch), { retry: onRetry });

  useEffect(() => {
    // Copy the saved details into redux for later modifying
    if (!isLoadingTransport && !isLoadingPermit && !isRouteTransportModified) {
      const { routeId } = selectedRouteTransportDetail || {};
      dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: selectedRouteTransportDetail });

      const { routes = [] } = selectedPermitDetail || {};
      const selectedRoute = routes.find((route) => route.id === routeId);
      dispatch({ type: managementActions.SET_SELECTED_ROUTE_OPTION, payload: selectedRoute });
    }
  }, [isLoadingTransport, isLoadingPermit, isRouteTransportModified, selectedRouteTransportDetail, selectedPermitDetail, dispatch]);

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
          <RouteTransportInfo permit={selectedPermitDetail as IPermit} supervisors={supervisorList} setToastMessage={setToastMessage} />
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

export default TransportDetail;
