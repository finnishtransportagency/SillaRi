import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage, IonToast, useIonAlert } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservationsSummary from "../components/SupervisionObservationsSummary";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { onRetry } from "../utils/backendData";
import { finishSupervision, getSupervision } from "../utils/supervisionBackendData";
import SupervisionFooter from "../components/SupervisionFooter";
import { SupervisionListType, SupervisionStatus } from "../utils/constants";

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
  const [present] = useIonAlert();

  const {
    networkStatus: { isFailed = {} },
    selectedSupervisionListType,
  } = useTypedSelector((state) => state.rootReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );
  const { routeTransportId = "0" } = supervision || {};

  const returnToSupervisionList = () => {
    // Go back to bridge supervision listing on either SupervisionList or RouteTransportDetail page
    // If selectedSupervisionListType is not set, go to supervisions main page
    if (selectedSupervisionListType === SupervisionListType.BRIDGE) {
      history.push("/supervisions/1");
    } else if (selectedSupervisionListType === SupervisionListType.TRANSPORT) {
      history.push("/supervisions/0"); // Go through main page so back button works as expected on RouteTransportDetail page
      history.push(`/routeTransportDetail/${routeTransportId}`);
    } else {
      history.push("/supervisions");
    }
  };

  const finishSupervisionMutation = useMutation((superId: string) => finishSupervision(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      setToastMessage(t("supervision.summary.saved"));
      returnToSupervisionList();
    },
  });
  const { isLoading: isSendingFinishSupervision } = finishSupervisionMutation;

  const { report, currentStatus, images = [] } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};

  const isLoading = isLoadingSupervision || isSendingFinishSupervision;
  const notAllowedToEdit = !report || supervisionStatus === SupervisionStatus.REPORT_SIGNED;

  const saveReport = (): void => {
    finishSupervisionMutation.mutate(supervisionId);
  };

  const editReport = (): void => {
    // Cannot use history.replace or history.goBack if we want to be able to cancel changes on Supervision page and get back here
    history.push(`/supervision/${supervisionId}`);
  };

  const showConfirmLeavePage = () => {
    present({
      header: t("supervision.warning.leavePage"),
      message: t("supervision.warning.supervisionNotFinished"),
      buttons: [
        t("common.answer.no"),
        {
          text: t("common.answer.yes"),
          handler: () => history.goBack(),
        },
      ],
    });
  };

  const confirmGoBack = (): void => {
    if (supervisionStatus !== SupervisionStatus.FINISHED && supervisionStatus !== SupervisionStatus.REPORT_SIGNED) {
      showConfirmLeavePage();
    } else {
      history.goBack();
    }
  };

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.summary.title")} somethingFailed={isFailed.getSupervision} includeSendingList confirmGoBack={confirmGoBack} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos images={images} headingKey="supervision.photos" disabled={isLoading || notAllowedToEdit} />
            <SupervisionObservationsSummary report={report} />
            <SupervisionFooter
              disabled={isLoading || notAllowedToEdit}
              saveChanges={saveReport}
              cancelChanges={editReport}
              saveLabel={t("supervision.buttons.saveToSendList")}
              cancelLabel={t("common.buttons.edit")}
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
