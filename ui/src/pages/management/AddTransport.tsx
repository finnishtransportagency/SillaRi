import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonPage } from "@ionic/react";
import Header from "../../components/Header";
import RouteTransportInfo from "../../components/management/RouteTransportInfo";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import { useTypedSelector, RootState } from "../../store/store";
import { TransportStatus } from "../../utils/constants";
import { onRetry } from "../../utils/backendData";
import { getPermit } from "../../utils/managementBackendData";
import IVehicle from "../../interfaces/IVehicle";

interface AddTransportProps {
  permitId: string;
}

const AddTransport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState("");

  const [modifiedRouteTransportDetail, setModifiedRouteTransportDetail] = useState<IRouteTransport | undefined>(undefined);
  const [selectedRouteOption, setSelectedRouteOption] = useState<IRoute | undefined>(undefined);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | undefined>(undefined);

  const management = useTypedSelector((state: RootState) => state.rootReducer);
  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { permitId = "0" } = useParams<AddTransportProps>();

  const { isLoading: isLoadingPermit, data: selectedPermitDetail } = useQuery(["getPermit", permitId], () => getPermit(Number(permitId), dispatch), {
    retry: onRetry,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Put empty details into redux for later modifying
    if (!isLoadingPermit) {
      // The route transport currentStatus is needed by some components, but is set to undefined before saving
      const newRouteTransport: IRouteTransport = {
        id: 0,
        routeId: 0,
        plannedDepartureTime: undefined,
        tractorUnit: "",
        currentStatus: { status: TransportStatus.PLANNED } as IRouteTransportStatus,
      };
      setModifiedRouteTransportDetail(newRouteTransport);
      setSelectedRouteOption(undefined);
    }
  }, [isLoadingPermit, dispatch]);

  const noNetworkNoData = isFailed.getPermit && selectedPermitDetail === undefined;
  const notReady = noNetworkNoData || isLoadingPermit;

  return (
    <IonPage>
      <Header title={t("management.transportDetail.headerTitleAdd")} somethingFailed={isFailed.getPermit || isFailed.getSupervisors} />
      <RouteTransportInfo
        routeTransportId={0}
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

export default AddTransport;
