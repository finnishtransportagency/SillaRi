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
import {
  cancelSupervision,
  deleteSupervisionImages,
  getSupervision,
  onRetry,
  sendImageUpload,
  updateSupervisionReport,
} from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import moment from "moment";
import { DATE_TIME_FORMAT, SupervisionStatus } from "../utils/constants";
import { filterUnsavedImages, reportHasUnsavedChanges } from "../utils/supervisionUtil";
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
  const [present] = useIonAlert();

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

  const { report: savedReport, currentStatus, images: savedImages = [] } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const supervisionInProgress = !isLoadingSupervision && supervisionStatus === SupervisionStatus.IN_PROGRESS;
  const supervisionFinished = !isLoadingSupervision && supervisionStatus === SupervisionStatus.FINISHED;

  const notAllowedToEdit = !savedReport || (!supervisionInProgress && !supervisionFinished);

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
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

  const deleteImagesMutation = useMutation((superId: string) => deleteSupervisionImages(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSupervision", supervisionId]);
      // We don't want to allow the user to get back to this page by using "back"
      history.replace(`/bridgeDetail/${supervisionId}`, { direction: "back" });
    },
  });
  const { isLoading: isSendingDeleteImages } = imageUploadMutation;

  const cancelSupervisionMutation = useMutation((superId: string) => cancelSupervision(Number(superId), dispatch), {
    retry: onRetry,
    onSuccess: () => {
      deleteImagesMutation.mutate(supervisionId);
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
    const hasUnsavedImages = filterUnsavedImages(images, savedImages).length > 0;
    if (reportHasUnsavedChanges(modifiedReport, savedReport) || hasUnsavedImages) {
      showConfirmLeavePage();
    } else {
      history.goBack();
    }
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
    if (supervision && !isLoadingSupervision && !isSendingImageUpload && !isSendingDeleteImages) {
      // Remove any uploaded images from the camera images stored in redux
      if (savedImages.length > 0) {
        dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: savedImages });
      }
    }
  }, [isLoadingSupervision, isSendingImageUpload, isSendingDeleteImages, supervision, savedImages, dispatch]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} confirmGoBack={confirmGoBack} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos
              supervision={supervision as ISupervision}
              headingKey="supervision.photosDrivingLine"
              isButtonsIncluded
              disabled={notAllowedToEdit}
            />
            <SupervisionObservations modifiedReport={modifiedReport} setModifiedReport={setModifiedReport} disabled={notAllowedToEdit} />
            <SupervisionFooter
              isLoading={isLoadingSupervision || isSendingReportUpdate || isSendingImageUpload || isSendingCancelSupervision}
              disabled={notAllowedToEdit}
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
