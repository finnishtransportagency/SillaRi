import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import moment from "moment";
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
      // Make sure the dates are objects not strings, otherwise the backend may throw a 400 Bad Request error on save
      // The backend updateRouteTransport method does not update the status values, so these can be left undefined here
      const { routeId, plannedDepartureTime, supervisions = [] } = selectedRouteTransportDetail || {};
      const modifiedSupervisions = supervisions.map((supervision) => {
        return { ...supervision, plannedTime: moment(supervision.plannedTime).toDate() };
      });
      const modifiedRouteTransportDetail = {
        ...selectedRouteTransportDetail,
        plannedDepartureTime: moment(plannedDepartureTime).toDate(),
        supervisions: modifiedSupervisions,
        currentStatus: undefined,
        statusHistory: undefined,
      };
      dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: modifiedRouteTransportDetail });

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
      <Header title={t("management.addTransport.headerTitleDetail")} somethingFailed={isFailed.getPermit} />
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
