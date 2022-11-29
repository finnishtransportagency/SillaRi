import React, { useEffect, useState } from "react";
import { actions } from "../store/rootSlice";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { IonContent, IonPage, useIonAlert } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ICancelCrossingInput from "../interfaces/ICancelCrossingInput";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { useTypedSelector, RootState } from "../store/store";
import { getUserData, onRetry } from "../utils/backendData";
import {
  cancelSupervision,
  deleteSupervisionImages,
  getSupervisionTryWithPasscodeAndWithout,
  updateSupervisionReport,
} from "../utils/supervisionBackendData";
import { SupervisionStatus } from "../utils/constants";
import { isCustomerUsesSillariPermitSupervision, reportHasUnsavedChanges } from "../utils/supervisionUtil";
import { isSupervisionReportValid } from "../utils/validation";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<SupervisionProps>();
  const {
    networkStatus: { isFailed = {} },
    supervisionOpenedFromSendingList,
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const [modifiedReport, setModifiedReport] = useState<ISupervisionReport | undefined>(undefined);

  const [present] = useIonAlert();

  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const { data: supervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const { username = "" } = supervisorUser || {};

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    supervisionQueryKey,
    () => getSupervisionTryWithPasscodeAndWithout(Number(supervisionId), username, null, dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: !!username,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id, data.currentStatus, "draft: ", data.report ? data.report.draft : "");
      },
    }
  );

  const { routeTransportId = 0, report: savedReport, currentStatus, images = [] } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};

  // Set-up mutations for modifying data later
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const reportUpdateMutation = useMutation(
    (updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, routeTransportId, username, dispatch),
    {
      retry: onRetry,
      onMutate: async (newData: ISupervisionReport) => {
        // onMutate fires before the mutation function

        // Cancel any outgoing refetches so they don't overwrite the optimistic update below
        await queryClient.cancelQueries(supervisionQueryKey);

        // Optimistically update to the new report
        queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
          return {
            ...oldData,
            report: { ...oldData?.report, ...newData },
          } as ISupervision;
        });
      },
      onSuccess: (data) => {
        // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

        queryClient.setQueryData(supervisionQueryKey, data);
      },
    }
  );
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const deleteImagesMutation = useMutation((superId: string) => deleteSupervisionImages(Number(superId), dispatch), {
    retry: onRetry,
    onMutate: async () => {
      // onMutate fires before the mutation function

      // Cancel any outgoing refetches so they don't overwrite the optimistic update below
      await queryClient.cancelQueries(supervisionQueryKey);

      // Clear the images here since the backend won't be called yet when offline
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
        return { ...oldData, images: [] } as ISupervision;
      });

      // We don't want to allow the user to get back to this page by using "back"
      // Since onSuccess doesn't fire when offline, the page transition needs to be done here instead
      history.replace(`/bridgeDetail/${supervisionId}`, { direction: "back" });
    },
    onSuccess: () => {
      // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

      // Fetch the latest data from the backend now that the app is online again
      queryClient.invalidateQueries(supervisionQueryKey);
    },
  });
  const { isLoading: isSendingDeleteImages } = deleteImagesMutation;

  const cancelSupervisionMutation = useMutation(
    (cancelCrossingInput: ICancelCrossingInput) => cancelSupervision(cancelCrossingInput, username, dispatch),
    {
      retry: onRetry,
      onMutate: async (newData: ICancelCrossingInput) => {
        // onMutate fires before the mutation function

        // Cancel any outgoing refetches so they don't overwrite the optimistic update below
        await queryClient.cancelQueries(supervisionQueryKey);

        // Clear the report and set the current status to CANCELLED here since the backend won't be called yet when offline
        queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
          return {
            ...oldData,
            report: undefined,
            currentStatus: { ...oldData?.currentStatus, status: SupervisionStatus.CANCELLED, time: newData.cancelTime },
          } as ISupervision;
        });

        // Since onSuccess doesn't fire when offline, other mutations need to be called here instead
        deleteImagesMutation.mutate(supervisionId);
      },
    }
  );
  const { isLoading: isSendingCancelSupervision } = cancelSupervisionMutation;

  const isLoading = isLoadingSupervision || isSendingReportUpdate || isSendingCancelSupervision || isSendingDeleteImages;
  const supervisionInProgress = !isLoading && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const supervisionFinished = !isLoading && supervisionStatus === SupervisionStatus.FINISHED;
  const notAllowedToEdit = !savedReport || (!supervisionInProgress && !supervisionFinished);
  const reportValid = isSupervisionReportValid(modifiedReport);

  // Save changes in report
  const saveReport = (isDraft: boolean): void => {
    if (modifiedReport) {
      // Update conflicting values
      const updatedReport = {
        ...modifiedReport,
        drivingLineInfo: !modifiedReport.drivingLineOk ? modifiedReport.drivingLineInfo : "",
        speedLimitInfo: !modifiedReport.speedLimitOk ? modifiedReport.speedLimitInfo : "",
        anomaliesDescription: modifiedReport.anomalies ? modifiedReport.anomaliesDescription : "",
        surfaceDamage: modifiedReport.anomalies ? modifiedReport.surfaceDamage : false,
        jointDamage: modifiedReport.anomalies ? modifiedReport.jointDamage : false,
        bendOrDisplacement: modifiedReport.anomalies ? modifiedReport.bendOrDisplacement : false,
        otherObservations: modifiedReport.anomalies ? modifiedReport.otherObservations : false,
        otherObservationsInfo: modifiedReport.anomalies && modifiedReport.otherObservations ? modifiedReport.otherObservationsInfo : "",
        draft: isDraft,
      };
      reportUpdateMutation.mutate(updatedReport);
    }
  };

  const saveReportClicked = (): void => {
    saveReport(false);
    history.push(`/summary/${supervisionId}`);
  };

  const showConfirmCancelSupervision = () => {
    present({
      header: t("supervision.warning.cancelSupervisionHeader"),
      message: t("supervision.warning.cancelSupervisionText"),
      buttons: [
        t("common.buttons.back2"),
        {
          text: t("supervision.buttons.cancel"),
          handler: () => {
            const cancelCrossingInput: ICancelCrossingInput = { supervisionId: Number(supervisionId), routeTransportId, cancelTime: new Date() };
            cancelSupervisionMutation.mutate(cancelCrossingInput);
          },
        },
      ],
    });
  };

  const cancelSupervisionClicked = (): void => {
    if (supervisionInProgress) {
      showConfirmCancelSupervision();
    } else if (supervisionOpenedFromSendingList) {
      dispatch({
        type: actions.SET_FORCE_OPEN_SENDING_LIST,
        payload: true,
      });
    } else {
      history.goBack();
    }
  };

  const showConfirmLeavePage = () => {
    present({
      header: t("supervision.warning.leavePage"),
      message: t("supervision.warning.unsavedChanges"),
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
    if (reportHasUnsavedChanges(modifiedReport, savedReport)) {
      showConfirmLeavePage();
    } else {
      console.log("supervisionOpenedFromSendingList: " + supervisionOpenedFromSendingList);
      if (supervisionOpenedFromSendingList) {
        dispatch({
          type: actions.SET_FORCE_OPEN_SENDING_LIST,
          payload: true,
        });
      } else {
        history.goBack();
      }
    }
  };

  const takePhotosClicked = (): void => {
    saveReport(savedReport ? savedReport.draft : true);
    history.push(`/takephotos/${supervisionId}`);
  };

  useEffect(() => {
    if (!isLoading && supervision) {
      // Page is loaded for the first time, modifiedReport is not set
      if (modifiedReport === undefined && savedReport) {
        console.log("setModifiedReport", savedReport);
        // Update the modified report with data from backend
        setModifiedReport({ ...savedReport });
      }
    }
  }, [isLoading, supervision, modifiedReport, savedReport]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header
        title={t("supervision.title")}
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
            <SupervisionPhotos
              images={images}
              headingKey="supervision.photosDrivingLine"
              isButtonsIncluded
              takePhotos={takePhotosClicked}
              disabled={isLoading || notAllowedToEdit}
              supervisionId={Number(supervisionId)}
            />
            <SupervisionObservations modifiedReport={modifiedReport} setModifiedReport={setModifiedReport} disabled={notAllowedToEdit} />
            <SupervisionFooter
              saveDisabled={
                !username ||
                (!routeTransportId && isCustomerUsesSillariPermitSupervision(supervision)) ||
                isLoading ||
                notAllowedToEdit ||
                !reportValid
              }
              cancelDisabled={
                !username || (!routeTransportId && isCustomerUsesSillariPermitSupervision(supervision)) || isLoading || notAllowedToEdit
              }
              saveChanges={saveReportClicked}
              cancelChanges={cancelSupervisionClicked}
              saveLabel={t("supervision.buttons.summary")}
              cancelLabel={supervisionInProgress ? t("supervision.buttons.cancel") : t("common.buttons.cancel")}
              sendImmediatelyVisible={false}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Supervision;
