import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonPage } from "@ionic/react";
import moment from "moment";
import Header from "../../components/Header";
import RouteTransportInfo from "../../components/management/RouteTransportInfo";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import { useTypedSelector, RootState } from "../../store/store";
import { onRetry } from "../../utils/backendData";
import { getPermitOfRouteTransport, getRouteTransport } from "../../utils/managementBackendData";
import IVehicle from "../../interfaces/IVehicle";
import { isTransportEditable } from "../../utils/validation";
import IToastMessage from "../../interfaces/IToastMessage";

interface TransportDetailProps {
  routeTransportId: string;
}

const TransportDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState<IToastMessage>({ message: "", color: "" });

  const [modifiedRouteTransportDetail, setModifiedRouteTransportDetail] = useState<IRouteTransport | undefined>(undefined);
  const [selectedRouteOption, setSelectedRouteOption] = useState<IRoute | undefined>(undefined);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | undefined>(undefined);

  const management = useTypedSelector((state: RootState) => state.rootReducer);
  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { routeTransportId = "0" } = useParams<TransportDetailProps>();

  const { isLoading: isLoadingTransport, data: selectedRouteTransportDetail } = useQuery(
    ["getRouteTransport", Number(routeTransportId)],
    () => getRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingPermit, data: selectedPermitDetail } = useQuery(
    ["getPermitOfRouteTransport", Number(routeTransportId)],
    () => getPermitOfRouteTransport(Number(routeTransportId), dispatch),
    {
      retry: onRetry,
      refetchOnWindowFocus: false,
    }
  );

  const { routeId, tractorUnit } = selectedRouteTransportDetail || {};

  useEffect(() => {
    // Copy the saved details for later modifying
    if (!isLoadingTransport && !!selectedRouteTransportDetail) {
      // Make sure the dates are objects not strings, otherwise the backend may throw a 400 Bad Request error on save
      // The backend updateRouteTransport method does not update the status values, so these can be left undefined here
      // The route transport currentStatus is needed by some components, but is set to undefined before saving
      const { plannedDepartureTime, supervisions = [] } = selectedRouteTransportDetail || {};
      const modifiedSupervisions = supervisions.map((supervision) => {
        return { ...supervision, plannedTime: moment(supervision.plannedTime).toDate(), statusHistory: undefined };
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
    (isFailed.getPermitOfRouteTransport && selectedPermitDetail === undefined);

  const notReady = noNetworkNoData || isLoadingTransport || isLoadingPermit;

  const title = isTransportEditable(modifiedRouteTransportDetail, selectedPermitDetail)
    ? t("management.transportDetail.headerTitleEdit")
    : t("management.transportDetail.headerTitleDetail");

  return (
    <IonPage>
      <Header title={title} somethingFailed={isFailed.getRouteTransport || isFailed.getPermitOfRouteTransport || isFailed.getSupervisors} />
      <RouteTransportInfo
        routeTransportId={Number(routeTransportId)}
        permit={selectedPermitDetail as IPermit}
        modifiedRouteTransportDetail={modifiedRouteTransportDetail as IRouteTransport}
        setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
        selectedRouteOption={selectedRouteOption as IRoute}
        setSelectedRouteOption={setSelectedRouteOption}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        toastMessage={toastMessage}
        setToastMessage={setToastMessage}
        noNetworkNoData={noNetworkNoData}
        notReady={notReady}
      />
    </IonPage>
  );
};

export default TransportDetail;
