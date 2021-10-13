import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { getPermitOfRouteBridge, getRouteBridge, getSupervision, onRetry, sendSupervisionStarted } from "../utils/backendData";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { routeBridgeId = "0", report } = selectedSupervisionDetail || {};

  const { id: supervisionReportId = -1 } = report || {};

  // Added query to clear previous supervision from Redux store, otherwise that one is used
  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((superId: number) => sendSupervisionStarted(superId, dispatch), { retry: onRetry });

  // Start the supervision if not already done
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;
  if (!isLoadingSupervision && !isSendingSupervisionStart && supervisionReportId <= 0) {
    supervisionStartMutation.mutate(Number(supervisionId));
  }

  const noNetworkNoData =
    (isFailed.getSupervision && selectedSupervisionDetail === undefined) ||
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header
        title={t("supervision.title")}
        somethingFailed={isFailed.getSupervision || isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge}
      />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader
              permit={selectedPermitDetail as IPermit}
              routeBridge={selectedBridgeDetail as IRouteBridge}
              supervision={selectedSupervisionDetail as ISupervision}
              className="header"
              isCrossingInstructionsIncluded
            />
            <SupervisionPhotos supervision={selectedSupervisionDetail as ISupervision} headingKey="supervision.photosDrivingLine" isButtonsIncluded />
            <SupervisionObservations supervision={selectedSupervisionDetail as ISupervision} />
            <SupervisionFooter supervision={selectedSupervisionDetail as ISupervision} draft />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Supervision;
