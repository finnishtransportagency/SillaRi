import React, { useEffect, useState } from "react";
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
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

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

  const [modifiedSupervisionReport, setModifiedSupervisionReport] = useState<ISupervisionReport>(defaultReport);

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
      console.log("STARTED AND GOT NEW DATA", data);
      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      setModifiedSupervisionReport(data.report || defaultReport);
    },
  });
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;

  const reportUpdateMutation = useMutation((updatedReport: ISupervisionReport) => updateSupervisionReport(updatedReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      setModifiedSupervisionReport(data.report || defaultReport);
      dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: data.images });
    },
  });
  const { isLoading: isSendingReportUpdate } = reportUpdateMutation;

  const imageUploadMutation = useMutation((fileUpload: ISupervisionImageInput) => sendImageUpload(fileUpload, dispatch), { retry: onRetry });

  // Save changes in both report and images
  const saveReport = (): void => {
    const r = modifiedSupervisionReport;
    // Update conflicting values
    const updatedReport = {
      ...r,
      drivingLineInfo: !r.drivingLineOk ? r.drivingLineInfo : "",
      speedLimitInfo: !r.speedLimitOk ? r.speedLimitInfo : "",
      anomaliesDescription: r.anomalies ? r.anomaliesDescription : "",
      surfaceDamage: r.anomalies ? r.surfaceDamage : false,
      jointDamage: r.anomalies ? r.jointDamage : false,
      bendOrDisplacement: r.anomalies ? r.bendOrDisplacement : false,
      otherObservations: r.anomalies ? r.otherObservations : false,
      otherObservationsInfo: r.anomalies && r.otherObservations ? r.otherObservationsInfo : "",
      draft: false,
    };
    reportUpdateMutation.mutate(updatedReport);

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
    history.push(`/bridgeDetail/${supervisionId}`);
  };

  useEffect(() => {
    if (!isLoadingSupervision && !isSendingSupervisionStart && !isSendingReportUpdate && supervision) {
      // When page has loaded, start supervision or set existing supervision report to draft. Set modifiedReport.
      const { report: savedReport } = supervision;
      const { draft: isDraft } = savedReport || {};
      console.log("Loaded", supervision);
      console.log("modifiedSupervisionReport", modifiedSupervisionReport);

      // Page is loaded for the first time, modifiedSupervisionReport has default values
      if (modifiedSupervisionReport.id <= 0) {
        if (!savedReport) {
          // Create new report with default values and set the result to modified report
          supervisionStartMutation.mutate(modifiedSupervisionReport);
        } else {
          if (!isDraft) {
            // Set saved report to draft and set the result to modified report
            reportUpdateMutation.mutate({ ...savedReport, draft: true });
          } else {
            setModifiedSupervisionReport(savedReport);
          }
        }
      }
    }
  }, [
    isLoadingSupervision,
    isSendingSupervisionStart,
    isSendingReportUpdate,
    supervision,
    supervisionStartMutation,
    reportUpdateMutation,
    modifiedSupervisionReport,
  ]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} className="header" isCrossingInstructionsIncluded />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photosDrivingLine" isButtonsIncluded />
            <SupervisionObservations
              modifiedSupervisionReport={modifiedSupervisionReport}
              setModifiedSupervisionReport={setModifiedSupervisionReport}
            />
            <SupervisionFooter
              report={modifiedSupervisionReport}
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
