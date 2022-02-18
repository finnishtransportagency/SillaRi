import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import { onRetry } from "../utils/backendData";
import { getSupervision, updateConformsToPermit } from "../utils/supervisionBackendData";

interface BridgeDetailProps {
  supervisionId: string;
}

const BridgeDetail = (): JSX.Element => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<BridgeDetailProps>();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.rootReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", Number(supervisionId)],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );

  const supervisionUpdateMutation = useMutation((updatedSupervision: ISupervision) => updateConformsToPermit(updatedSupervision, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      // Update the supervision from "getSupervision" with the updated supervision data in the response
      queryClient.setQueryData(["getSupervision", Number(supervisionId)], data);
    },
  });

  const { id, routeBridgeId, routeTransportId, plannedTime, supervisorType, routeBridge } = supervision || {};
  const { bridge, route } = routeBridge || {};
  const { name = "" } = bridge || {};
  const { permit } = route || {};

  const setConformsToPermit = (conforms: boolean) => {
    const updatedSupervisionInput = {
      id,
      routeBridgeId,
      routeTransportId,
      plannedTime,
      supervisorType,
      conformsToPermit: conforms,
    } as ISupervision;

    if (!isLoadingSupervision) {
      supervisionUpdateMutation.mutate(updatedSupervisionInput);
    }
  };

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getSupervision} includeSendingList />
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
              supervision={supervision as ISupervision}
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
