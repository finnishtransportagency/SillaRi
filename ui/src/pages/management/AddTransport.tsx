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
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import ISupervisor from "../../interfaces/ISupervisor";
import { useTypedSelector } from "../../store/store";
import { TransportStatus } from "../../utils/constants";
import { onRetry } from "../../utils/backendData";
import { getPermit, getSupervisors } from "../../utils/managementBackendData";
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

  const management = useTypedSelector((state) => state.rootReducer);
  const {
    networkStatus: { isFailed = {} },
  } = management;

  const { permitId = "0" } = useParams<AddTransportProps>();

  const { isLoading: isLoadingPermit, data: selectedPermitDetail } = useQuery(["getPermit", permitId], () => getPermit(Number(permitId), dispatch), {
    retry: onRetry,
    refetchOnWindowFocus: false,
  });
  const { data: supervisorList } = useQuery(["getSupervisors"], () => getSupervisors(dispatch), { retry: onRetry, refetchOnWindowFocus: false });

  useEffect(() => {
    // Put empty details into redux for later modifying
    if (!isLoadingPermit) {
      // The route transport currentStatus is needed by some components, but is set to undefined before saving
      const newRouteTransport: IRouteTransport = {
        id: 0,
        routeId: 0,
        plannedDepartureTime: moment().toDate(),
        tractorUnit: "",
        currentStatus: { status: TransportStatus.PLANNED } as IRouteTransportStatus,
      };
      setModifiedRouteTransportDetail(newRouteTransport);
      setSelectedRouteOption(undefined);
    }
  }, [isLoadingPermit, dispatch]);

  const noNetworkNoData =
    (isFailed.getPermit && selectedPermitDetail === undefined) || (isFailed.getSupervisors && (!supervisorList || supervisorList.length === 0));

  return (
    <IonPage>
      <Header title={t("management.transportDetail.headerTitleAdd")} somethingFailed={isFailed.getPermit} />
      <IonContent color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <RouteTransportInfo
            routeTransportId={0}
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

export default AddTransport;
