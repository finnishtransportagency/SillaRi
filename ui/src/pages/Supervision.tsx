import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage, useIonAlert } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { onRetry } from "../utils/backendData";
import { cancelSupervision, deleteSupervisionImages, getSupervision, updateSupervisionReport } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { SupervisionStatus } from "../utils/constants";
import { reportHasUnsavedChanges } from "../utils/supervisionUtil";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<SupervisionProps>();
  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.rootReducer);

  const [modifiedReport, setModifiedReport] = useState<ISupervisionReport | undefined>(undefined);
  const [present] = useIonAlert();

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", Number(supervisionId)],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id, data.currentStatus, "draft: ", data.report ? data.report.draft : "");
      },
    }
  );

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", Number(supervisionId)], data);
    },
  });
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const deleteImagesMutation = useMutation((superId: string) => deleteSupervisionImages(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - figure out a better way to do this when offline
      queryClient.invalidateQueries(["getSupervision", Number(supervisionId)]);

      // We don't want to allow the user to get back to this page by using "back"
      history.replace(`/bridgeDetail/${supervisionId}`, { direction: "back" });
    },
  });
  const { isLoading: isSendingDeleteImages } = deleteImagesMutation;

  const cancelSupervisionMutation = useMutation((superId: string) => cancelSupervision(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: () => {
      deleteImagesMutation.mutate(supervisionId);
    },
  });
  const { isLoading: isSendingCancelSupervision } = cancelSupervisionMutation;

  const { report: savedReport, currentStatus, images = [] } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};

  const isLoading = isLoadingSupervision || isSendingReportUpdate || isSendingCancelSupervision || isSendingDeleteImages;
  const supervisionInProgress = !isLoading && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const supervisionFinished = !isLoading && supervisionStatus === SupervisionStatus.FINISHED;
  const notAllowedToEdit = !savedReport || (!supervisionInProgress && !supervisionFinished);

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
            cancelSupervisionMutation.mutate(supervisionId);
          },
        },
      ],
    });
  };

  const cancelSupervisionClicked = (): void => {
    if (supervisionInProgress) {
      showConfirmCancelSupervision();
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
      history.goBack();
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
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} includeSendingList confirmGoBack={confirmGoBack} />
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
            />
            <SupervisionObservations modifiedReport={modifiedReport} setModifiedReport={setModifiedReport} disabled={notAllowedToEdit} />
            <SupervisionFooter
              disabled={isLoading || notAllowedToEdit}
              saveChanges={saveReportClicked}
              cancelChanges={cancelSupervisionClicked}
              saveLabel={t("supervision.buttons.summary")}
              cancelLabel={supervisionInProgress ? t("supervision.buttons.cancel") : t("common.buttons.cancel")}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Supervision;
