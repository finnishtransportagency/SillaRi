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
import { getPermitOfRouteBridge, getRouteBridge, getSupervisionOfRouteBridge, onRetry, sendSupervisionUpdate } from "../utils/backendData";

interface BridgeDetailProps {
  routeBridgeId: string;
}

const BridgeDetail = (): JSX.Element => {
  const dispatch = useDispatch();
  const { routeBridgeId = "0" } = useParams<BridgeDetailProps>();

  const {
    selectedBridgeDetail,
    selectedPermitDetail,
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { bridge } = selectedBridgeDetail || {};
  const { name = "" } = bridge || {};
  const { id: supervisionId, routeTransportId, plannedTime, supervisorType, supervisors } = selectedSupervisionDetail || {};

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
  });
  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervisionOfRouteBridge", routeBridgeId],
    () => getSupervisionOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail),
    {
      retry: onRetry,
    }
  );

  const supervisionUpdateMutation = useMutation((supervision: ISupervision) => sendSupervisionUpdate(supervision, dispatch), { retry: onRetry });

  const setConformsToPermit = (conforms: boolean) => {
    const updatedSupervision = {
      id: supervisionId,
      routeBridgeId: Number(routeBridgeId),
      routeTransportId,
      plannedTime,
      conformsToPermit: conforms,
      supervisorType,
      supervisors,
    } as ISupervision;

    if (!isLoadingSupervision) {
      supervisionUpdateMutation.mutate(updatedSupervision);
    }
  };

  const noNetworkNoData =
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined) ||
    (isFailed.getSupervision && selectedSupervisionDetail === undefined);

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge || isFailed.getSupervisionOfRouteBridge} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <BridgeDetailHeader routeBridge={selectedBridgeDetail as IRouteBridge} />
            <CrossingInstructionsAccordion routeBridge={selectedBridgeDetail as IRouteBridge} />
            <TrafficSupervisorsAccordion />
            <BridgeDetailFooter
              permit={selectedPermitDetail as IPermit}
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
