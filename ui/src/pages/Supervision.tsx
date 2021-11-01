import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { getSupervision, onRetry, sendImageUpload, startSupervision, updateSupervisionReport } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../utils/constants";
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
    modifiedReport,
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
    }
  );

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((initialReport: ISupervisionReport) => startSupervision(initialReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      dispatch({ type: supervisionActions.SET_MODIFIED_REPORT, payload: { ...data.report } });
    },
  });
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      dispatch({ type: supervisionActions.SET_MODIFIED_REPORT, payload: { ...data.report } });
    },
  });
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const imageUploadMutation = useMutation((fileUpload: ISupervisionImageInput) => sendImageUpload(fileUpload, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSupervision", supervisionId]);
    },
  });

  // Save changes in both report and images
  const saveReport = (): void => {
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

  const cancelReport = (): void => {
    // TODO confirm that all changes are lost and supervision status reset
    // Set supervision status back to 'PLANNED' and delete report
    // Then go back to bridgeDetail page
    // We don't want to allow the user to get back to this page by using "back"
    history.replace(`/bridgeDetail/${supervisionId}`);
  };

  useEffect(() => {
    if (!isLoadingSupervision && !isSendingSupervisionStart && !isSendingReportUpdate && supervision) {
      // When page has loaded, start supervision or set modifiedReport to previously saved report.
      const { report: savedReport } = supervision || {};
      const { id: savedReportId } = savedReport || {};

      // Page is loaded for the first time, modifiedSupervisionReport is not set or has previous values
      if (!modifiedReport || modifiedReport.id <= 0 || modifiedReport.id !== savedReportId) {
        if (!savedReport) {
          // Create new report with default values and set the result to modified report
          const defaultReport: ISupervisionReport = {
            id: -1,
            supervisionId: Number(supervisionId),
            drivingLineOk: false,
            drivingLineInfo: "",
            speedLimitOk: false,
            speedLimitInfo: "",
            anomalies: true,
            anomaliesDescription: "",
            surfaceDamage: false,
            jointDamage: false,
            bendOrDisplacement: false,
            otherObservations: false,
            otherObservationsInfo: "",
            additionalInfo: "",
            draft: true,
          };

          supervisionStartMutation.mutate(defaultReport);
        } else {
          // Update the modified report with data from backend
          dispatch({ type: supervisionActions.SET_MODIFIED_REPORT, payload: { ...savedReport } });
        }
      }
    }
  }, [
    isLoadingSupervision,
    isSendingSupervisionStart,
    isSendingReportUpdate,
    supervisionStartMutation,
    reportUpdateMutation,
    supervision,
    supervisionId,
    modifiedReport,
    dispatch,
  ]);

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
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photosDrivingLine" isButtonsIncluded />
            <SupervisionObservations />
            <SupervisionFooter
              reportId={modifiedReport?.id}
              isDraft={modifiedReport?.draft || true}
              isLoading={isLoadingSupervision || isSendingSupervisionStart || isSendingReportUpdate}
              saveChanges={saveReport}
              cancelChanges={cancelReport}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Supervision;
