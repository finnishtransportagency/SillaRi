import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { Prompt, useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { cancelSupervision, getSupervision, onRetry, sendImageUpload, updateSupervisionReport } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import moment from "moment";
import { DATE_TIME_FORMAT, SupervisionStatus } from "../utils/constants";
import { reportHasUnsavedChanges } from "../utils/supervisionUtil";
import ISupervisionImageInput from "../interfaces/ISupervisionImageInput";
import { actions as supervisionActions } from "../store/supervisionSlice";

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
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const [modifiedReport, setModifiedReport] = useState<ISupervisionReport | undefined>(undefined);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id, data.currentStatus, "draft: ", data.report ? data.report.draft : "");
      },
    }
  );

  const { report: savedReport, currentStatus } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const supervisionInProgress = !isLoadingSupervision && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const supervisionFinished = !isLoadingSupervision && supervisionStatus === SupervisionStatus.FINISHED;

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      setModifiedReport(data.report ? { ...data.report } : undefined);
    },
  });
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const imageUploadMutation = useMutation((fileUpload: ISupervisionImageInput) => sendImageUpload(fileUpload, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSupervision", supervisionId]);
    },
  });
  const { isLoading: isSendingImageUpload } = imageUploadMutation;

  const cancelSupervisionMutation = useMutation((superId: string) => cancelSupervision(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      // We don't want to allow the user to get back to this page by using "back"
      history.replace(`/bridgeDetail/${supervisionId}`, { direction: "back" });
    },
  });
  const { isLoading: isSendingCancelSupervision } = cancelSupervisionMutation;

  // Save changes in both report and images
  const saveReportClicked = (): void => {
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
        draft: false,
      };
      reportUpdateMutation.mutate(updatedReport);
    }

    images.forEach((image) => {
      const fileUpload = {
        supervisionId: supervisionId.toString(),
        filename: image.filename,
        base64: image.dataUrl,
        taken: moment(image.date).format(DATE_TIME_FORMAT),
      } as ISupervisionImageInput;

      imageUploadMutation.mutate(fileUpload);
    });

    setModifiedReport(undefined);
    history.push(`/summary/${supervisionId}`);
  };

  const cancelSupervisionClicked = (): void => {
    // TODO confirm that all changes are lost
    if (supervisionInProgress) {
      cancelSupervisionMutation.mutate(supervisionId);
    } else {
      history.goBack();
    }
  };

  const showPrompt = (): boolean => {
    return reportHasUnsavedChanges(modifiedReport, savedReport);
  };

  useEffect(() => {
    if (!isLoadingSupervision && !isSendingReportUpdate && supervision) {
      // Page is loaded for the first time, modifiedReport is not set
      if (modifiedReport === undefined && savedReport) {
        console.log("setModifiedReport", savedReport);
        // Update the modified report with data from backend
        setModifiedReport({ ...savedReport });
      }
    }
  }, [isLoadingSupervision, isSendingReportUpdate, supervision, modifiedReport, savedReport]);

  useEffect(() => {
    if (supervision && !isLoadingSupervision) {
      const { images: savedImages = [] } = supervision || {};
      // Remove any uploaded images from the camera images stored in redux
      if (savedImages.length > 0) {
        dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: savedImages });
      }
    }
  }, [isLoadingSupervision, supervision, dispatch]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <Prompt when={showPrompt()} message={"Hello prompt!"} />
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photosDrivingLine" isButtonsIncluded />
            <SupervisionObservations modifiedReport={modifiedReport} setModifiedReport={setModifiedReport} savedReport={savedReport} />
            <SupervisionFooter
              isLoading={isLoadingSupervision || isSendingReportUpdate || isSendingImageUpload || isSendingCancelSupervision}
              saveChanges={saveReportClicked}
              saveDenied={!savedReport || (!supervisionInProgress && !supervisionFinished)}
              saveLabel={t("supervision.buttons.summary")}
              cancelChanges={cancelSupervisionClicked}
              cancelDenied={!savedReport || (!supervisionInProgress && !supervisionFinished)}
              cancelLabel={supervisionInProgress ? t("supervision.buttons.cancel") : t("common.buttons.cancel")}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Supervision;
