import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager, useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage, IonToast, useIonAlert } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservationsSummary from "../components/SupervisionObservationsSummary";
import SupervisionPhotos from "../components/SupervisionPhotos";
import IFinishCrossingInput from "../interfaces/IFinishCrossingInput";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector, RootState } from "../store/store";
import { getUserData, onRetry } from "../utils/backendData";
import { finishSupervision, getSupervision } from "../utils/supervisionBackendData";
import SupervisionFooter from "../components/SupervisionFooter";
import { SupervisionListType, SupervisionStatus } from "../utils/constants";
import { removeSupervisionFromRouteTransportList } from "../utils/offlineUtil";
import { isSupervisionReportValid } from "../utils/validation";

interface SummaryProps {
  supervisionId: string;
}

const SupervisionSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const [toastMessage, setToastMessage] = useState("");
  const [present] = useIonAlert();

  const { supervisionId = "0" } = useParams<SummaryProps>();
  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const {
    networkStatus: { isFailed = {} },
    selectedSupervisionListType,
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const { data: supervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const { username = "" } = supervisorUser || {};

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    supervisionQueryKey,
    () => getSupervision(Number(supervisionId), username, null, dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: !!username,
    }
  );

  const { routeTransportId = 0, report, currentStatus, images = [] } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};

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

  // Set-up mutations for modifying data later
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const finishSupervisionMutation = useMutation(
    (finishCrossingInput: IFinishCrossingInput) => finishSupervision(finishCrossingInput, username, dispatch),
    {
      retry: onRetry,
      onMutate: async (newData: IFinishCrossingInput) => {
        // onMutate fires before the mutation function

        // Cancel any outgoing refetches so they don't overwrite the optimistic update below
        await queryClient.cancelQueries(supervisionQueryKey);
        await queryClient.cancelQueries("getSupervisionSendingList");

        // Set the current status to FINISHED here since the backend won't be called yet when offline
        let updatedSupervision: ISupervision;
        queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
          updatedSupervision = {
            ...oldData,
            currentStatus: { ...oldData?.currentStatus, status: SupervisionStatus.FINISHED, time: newData.finishTime },
            savedOffline: !onlineManager.isOnline(),
            finishedTime: newData.finishTime,
          } as ISupervision;
          return updatedSupervision;
        });

        // Add the finished supervision to the data used by the sending list so it is updated when offline
        queryClient.setQueryData<ISupervision[]>("getSupervisionSendingList", (oldData) => {
          return oldData
            ? oldData.reduce(
                (acc: ISupervision[], old) => {
                  return old.id === Number(supervisionId) ? acc : [...acc, old];
                },
                [updatedSupervision]
              )
            : [];
        });

        // Since onSuccess doesn't fire when offline, the page transition needs to be done here instead
        // Also remove the finished supervision from the route transport list in the UI
        removeSupervisionFromRouteTransportList(queryClient, String(routeTransportId), supervisionId);
        setToastMessage(t("supervision.summary.saved"));
        returnToSupervisionList();
      },
      onSuccess: (data) => {
        // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

        queryClient.setQueryData(supervisionQueryKey, data);
      },
    }
  );
  const { isLoading: isSendingFinishSupervision } = finishSupervisionMutation;

  const isLoading = isLoadingSupervision || isSendingFinishSupervision;
  const notAllowedToEdit = !report || supervisionStatus === SupervisionStatus.REPORT_SIGNED;
  const reportValid = isSupervisionReportValid(report);

  const saveReport = (): void => {
    const finishCrossingInput: IFinishCrossingInput = {
      supervisionId: Number(supervisionId),
      routeTransportId: routeTransportId,
      finishTime: new Date(),
    };
    finishSupervisionMutation.mutate(finishCrossingInput);
  };

  const editReport = (): void => {
    // Cannot use history.replace or history.goBack if we want to be able to cancel changes on Supervision page and get back here
    history.push(`/supervision/${supervisionId}`);
  };

  const sendReportImmediately = (): void => {
    const finishCrossingInput: IFinishCrossingInput = {
      supervisionId: Number(supervisionId),
      routeTransportId: routeTransportId,
      finishTime: new Date(),
    };
    finishSupervisionMutation.mutate(finishCrossingInput);
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
      <Header
        title={t("supervision.summary.title")}
        somethingFailed={isFailed.getSupervision}
        includeSendingList
        includeOfflineBanner
        confirmGoBack={confirmGoBack}
      />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos images={images} headingKey="supervision.photos" disabled={isLoading || notAllowedToEdit} />
            <SupervisionObservationsSummary report={report} />
            <SupervisionFooter
              saveDisabled={!username || !routeTransportId || isLoading || notAllowedToEdit || !reportValid}
              cancelDisabled={isLoading || notAllowedToEdit}
              sendImmediatelyDisabled={!username || !routeTransportId || isLoading || notAllowedToEdit || !reportValid}
              saveChanges={saveReport}
              cancelChanges={editReport}
              sendImmediately={sendReportImmediately}
              saveLabel={t("supervision.buttons.saveToSendList")}
              cancelLabel={t("common.buttons.edit")}
              sendImmediatelyLabel={t("supervision.buttons.sendImmediately")}
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
