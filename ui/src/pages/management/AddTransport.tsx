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
import IRouteTransport from "../../interfaces/IRouteTransport";
import { actions as managementActions } from "../../store/managementSlice";
import { useTypedSelector } from "../../store/store";
import { getPermit, getSupervisors, onRetry } from "../../utils/managementBackendData";

interface AddTransportProps {
  permitId: string;
}

const AddTransport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState("");

  const management = useTypedSelector((state) => state.managementReducer);
  const {
    selectedPermitDetail,
    supervisorList,
    isRouteTransportModified,
    networkStatus: { isFailed = {} },
  } = management;

  const { permitId = "0" } = useParams<AddTransportProps>();

  const { isLoading: isLoadingPermit } = useQuery(["getPermit", permitId], () => getPermit(Number(permitId), dispatch, selectedPermitDetail), {
    retry: onRetry,
  });
  useQuery(["getSupervisors"], () => getSupervisors(dispatch), { retry: onRetry });

  useEffect(() => {
    // Put empty details into redux for later modifying
    if (!isLoadingPermit && !isRouteTransportModified) {
      const newRouteTransport: IRouteTransport = { id: 0, routeId: 0, plannedDepartureTime: moment().toDate() };
      dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: newRouteTransport });
      dispatch({ type: managementActions.SET_SELECTED_ROUTE_OPTION, payload: undefined });
    }
  }, [isLoadingPermit, isRouteTransportModified, dispatch]);

  const noNetworkNoData = (isFailed.getPermit && selectedPermitDetail === undefined) || (isFailed.getSupervisors && supervisorList.length === 0);

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

export default AddTransport;
