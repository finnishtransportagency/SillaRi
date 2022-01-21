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
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervisor from "../../interfaces/ISupervisor";
import { useTypedSelector } from "../../store/store";
import { onRetry } from "../../utils/backendData";
import { getPermitOfRouteTransport, getRouteTransport, getSupervisors } from "../../utils/managementBackendData";
import IVehicle from "../../interfaces/IVehicle";

interface TransportDetailProps {
  routeTransportId: string;
}

const TransportDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState<string>("");

  const [modifiedRouteTransportDetail, setModifiedRouteTransportDetail] = useState<IRouteTransport | undefined>(undefined);
  const [selectedRouteOption, setSelectedRouteOption] = useState<IRoute | undefined>(undefined);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | undefined>(undefined);

  const management = useTypedSelector((state) => state.rootReducer);
  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { routeTransportId = "0" } = useParams<TransportDetailProps>();

  const { isLoading: isLoadingTransport, data: selectedRouteTransportDetail } = useQuery(
    ["getRouteTransport", routeTransportId],
    () => getRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingPermit, data: selectedPermitDetail } = useQuery(
    ["getPermitOfRouteTransport", routeTransportId],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );
  const { data: supervisorList } = useQuery(["getSupervisors"], () => getSupervisors(dispatch), { retry: onRetry, refetchOnWindowFocus: false });

  const { routeId, tractorUnit } = selectedRouteTransportDetail || {};

  useEffect(() => {
    // Copy the saved details for later modifying
    if (!isLoadingTransport && !!selectedRouteTransportDetail) {
      // Make sure the dates are objects not strings, otherwise the backend may throw a 400 Bad Request error on save
      // The backend updateRouteTransport method does not update the status values, so these can be left undefined here
      // The route transport currentStatus is needed by some components, but is set to undefined before saving
      const { plannedDepartureTime, supervisions = [] } = selectedRouteTransportDetail || {};
      const modifiedSupervisions = supervisions.map((supervision) => {
        return { ...supervision, plannedTime: moment(supervision.plannedTime).toDate(), currentStatus: undefined, statusHistory: undefined };
      });
      const modifiedRouteTransport = {
        ...selectedRouteTransportDetail,
        plannedDepartureTime: moment(plannedDepartureTime).toDate(),
        supervisions: modifiedSupervisions,
        // currentStatus: undefined,
        statusHistory: undefined,
      };
      setModifiedRouteTransportDetail(modifiedRouteTransport);
    }
  }, [isLoadingTransport, selectedRouteTransportDetail]);

  useEffect(() => {
    if (!isLoadingPermit && !!routeId && routeId > 0) {
      const { routes = [] } = selectedPermitDetail || {};
      const selectedRoute = routes.find((route) => route.id === routeId);
      if (selectedRoute) {
        setSelectedRouteOption(selectedRoute);
      }
    }
  }, [isLoadingPermit, selectedPermitDetail, routeId]);

  useEffect(() => {
    // If tractor unit is saved for the transport, set it selected
    if (!isLoadingTransport && !isLoadingPermit && tractorUnit) {
      const { vehicles = [] } = selectedPermitDetail || {};

      const selectedTractorUnit = vehicles.find((vehicle) => vehicle.identifier === tractorUnit);
      if (selectedTractorUnit) {
        setSelectedVehicle(selectedTractorUnit);
      }
    }
  }, [isLoadingPermit, isLoadingTransport, selectedPermitDetail, tractorUnit]);

  const noNetworkNoData =
    (isFailed.getRouteTransport && selectedRouteTransportDetail === undefined) ||
    (isFailed.getPermitOfRouteTransport && selectedPermitDetail === undefined) ||
    (isFailed.getSupervisors && (!supervisorList || supervisorList.length === 0));

  return (
    <IonPage>
      <Header
        title={t("management.transportDetail.headerTitleDetail")}
        somethingFailed={isFailed.getRouteTransport || isFailed.getPermitOfRouteTransport || isFailed.getSupervisors}
      />
      <IonContent color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <RouteTransportInfo
            routeTransportId={Number(routeTransportId)}
            permit={selectedPermitDetail as IPermit}
            supervisors={supervisorList as ISupervisor[]}
            modifiedRouteTransportDetail={modifiedRouteTransportDetail as IRouteTransport}
            setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
            selectedRouteOption={selectedRouteOption as IRoute}
            setSelectedRouteOption={setSelectedRouteOption}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            setToastMessage={setToastMessage}
          />
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
