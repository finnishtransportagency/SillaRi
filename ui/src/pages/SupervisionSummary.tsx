import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservationsSummary from "../components/SupervisionObservationsSummary";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { finishSupervision, getSupervision, onRetry, updateSupervisionReport } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import SupervisionFooter from "../components/SupervisionFooter";
import { actions as supervisionActions } from "../store/supervisionSlice";

interface SummaryProps {
  supervisionId: string;
}

const SupervisionSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<SummaryProps>();
  const [toastMessage, setToastMessage] = useState("");

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    { retry: onRetry }
  );
  const { report } = supervision || {};

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      dispatch({ type: supervisionActions.SET_MODIFIED_REPORT, payload: { ...data.report } });
    },
  });
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const finishSupervisionMutation = useMutation((finishRequest: ISupervision) => finishSupervision(finishRequest, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      dispatch({ type: supervisionActions.SET_MODIFIED_REPORT, payload: { ...data.report } });
      setToastMessage(t("supervision.summary.saved"));
    },
  });
  const { isLoading: isSendingFinishSupervision } = finishSupervisionMutation;

  /*useEffect(() => {
    if (!isLoadingSupervision) {
      // Remove any uploaded images from the camera images stored in redux
      dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: savedImages });
    }
  }, [isLoadingSupervision, savedImages, dispatch]);*/

  const saveReport = (): void => {
    if (supervision) {
      console.log("Maybe something wrong with supervision as param");
      //finishSupervisionMutation.mutate(supervision);
    }
  };

  const editReport = (): void => {
    // Set report back to draft and update modifiedReport on Supervision page
    if (report) {
      const updatedReport = { ...report, draft: true };
      reportUpdateMutation.mutate(updatedReport);
    }
    history.goBack();
  };

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.summary.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photos" />
            <SupervisionObservationsSummary report={report} />
            <SupervisionFooter
              reportId={report?.id}
              isDraft={report?.draft || false}
              isLoading={isLoadingSupervision || isSendingReportUpdate || isSendingFinishSupervision}
              saveChanges={saveReport}
              cancelChanges={editReport}
            />
          </>
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

export default SupervisionSummary;
