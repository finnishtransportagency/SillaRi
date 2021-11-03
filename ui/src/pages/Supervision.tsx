import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage, useIonViewDidEnter } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { getSupervision, onRetry, sendImageUpload, updateSupervisionReport } from "../utils/supervisionBackendData";
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

  const [modifiedReport, setModifiedReport] = useState<ISupervisionReport | undefined>(undefined);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id, data.currentStatus, data.report ? data.report.draft : "");
      },
    }
  );

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

    // Use direction "back" to force this page to unmount, otherwise "useEffect" is still listening in the background
    // https://github.com/ionic-team/ionic-framework/issues/20543
    // "The idea is if you are leaving a page by going back, the state of the page no longer needs to be maintained"
    history.push(`/summary/${supervisionId}`);
  };

  const cancelReport = (): void => {
    // TODO confirm that all changes are lost and supervision status reset
    // Set supervision status back to 'PLANNED' and delete report
    // Then go back to bridgeDetail page
    // We don't want to allow the user to get back to this page by using "back"
    history.replace(`/bridgeDetail/${supervisionId}`, { direction: "back" });
  };

  useEffect(() => {
    if (!isLoadingSupervision && !isSendingReportUpdate && supervision) {
      // When page has loaded, start supervision or set modifiedReport to previously saved report.
      const { report: savedReport } = supervision || {};

      console.log("ModifiedReport", modifiedReport);

      // Page is loaded for the first time, modifiedReport is not set or has previous values
      if (modifiedReport === undefined && savedReport) {
        // Update the modified report with data from backend
        setModifiedReport({ ...savedReport });
      }
    }
  }, [isLoadingSupervision, isSendingReportUpdate, reportUpdateMutation, supervision, modifiedReport]);

  useEffect(() => {
    if (supervision && !isLoadingSupervision) {
      const { images: savedImages = [] } = supervision || {};
      // Remove any uploaded images from the camera images stored in redux
      if (savedImages.length > 0) {
        dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: savedImages });
      }
    }
  }, [isLoadingSupervision, supervision, dispatch]);

  useIonViewDidEnter(() => {
    console.log("useIonViewDidEnter");
    setModifiedReport(undefined);
  });

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
            <SupervisionPhotos
              supervision={supervision as ISupervision}
              modifiedReport={modifiedReport}
              headingKey="supervision.photosDrivingLine"
              isButtonsIncluded
            />
            <SupervisionObservations modifiedReport={modifiedReport} setModifiedReport={setModifiedReport} />
            <SupervisionFooter
              reportId={modifiedReport?.id}
              isSummary={false}
              isLoading={isLoadingSupervision || isSendingReportUpdate}
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
