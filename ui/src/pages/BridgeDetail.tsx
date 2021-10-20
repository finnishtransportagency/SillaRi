import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage } from "@ionic/react";
import { useTypedSelector } from "../store/store";
import BridgeDetailHeader from "../components/BridgeDetailHeader";
import BridgeDetailFooter from "../components/BridgeDetailFooter";
import CrossingInstructionsAccordion from "../components/CrossingInstructionsAccordion";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import TrafficSupervisorsAccordion from "../components/TrafficSupervisorsAccordion";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import { getSupervision, onRetry, updateConformsToPermit } from "../utils/supervisionBackendData";

interface BridgeDetailProps {
  supervisionId: string;
}

const BridgeDetail = (): JSX.Element => {
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<BridgeDetailProps>();

  const {
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);
  const { id, routeBridgeId, routeTransportId, plannedTime, supervisorType, routeBridge } = selectedSupervisionDetail || {};
  const { bridge, route } = routeBridge || {};
  const { name = "" } = bridge || {};
  const { permit } = route || {};

  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    {
      retry: onRetry,
    }
  );

  const supervisionUpdateMutation = useMutation((supervision: ISupervision) => updateConformsToPermit(supervision, dispatch), { retry: onRetry });

  const setConformsToPermit = (conforms: boolean) => {
    const updatedSupervision = {
      id,
      routeBridgeId,
      routeTransportId,
      plannedTime,
      supervisorType,
      conformsToPermit: conforms,
    } as ISupervision;

    if (!isLoadingSupervision) {
      supervisionUpdateMutation.mutate(updatedSupervision);
    }
  };

  const noNetworkNoData = isFailed.getSupervision && selectedSupervisionDetail === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge || isFailed.getSupervisionOfRouteBridge} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <BridgeDetailHeader routeBridge={routeBridge as IRouteBridge} />
            <CrossingInstructionsAccordion routeBridge={routeBridge as IRouteBridge} />
            <TrafficSupervisorsAccordion />
            <BridgeDetailFooter
              permit={permit as IPermit}
              supervision={selectedSupervisionDetail as ISupervision}
              isLoadingSupervision={isLoadingSupervision}
              setConformsToPermit={setConformsToPermit}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
