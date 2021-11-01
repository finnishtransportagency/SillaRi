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
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { getSupervision, onRetry, startSupervision } from "../utils/supervisionBackendData";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { report } = selectedSupervisionDetail || {};
  const { id: supervisionReportId = -1 } = report || {};

  // Added query to clear previous supervision from Redux store, otherwise that one is used
  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((superId: number) => startSupervision(superId, dispatch), { retry: onRetry });

  // Start the supervision if not already done
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;
  if (!isLoadingSupervision && !isSendingSupervisionStart && supervisionReportId <= 0) {
    supervisionStartMutation.mutate(Number(supervisionId));
  }

  const noNetworkNoData = isFailed.getSupervision && selectedSupervisionDetail === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={selectedSupervisionDetail as ISupervision} />
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
