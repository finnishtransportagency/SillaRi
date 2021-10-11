import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import moment from "moment";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import IFileInput from "../interfaces/IFileInput";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { useTypedSelector } from "../store/store";
import {
  getPermitOfRouteBridge,
  getRouteBridge,
  getSupervision,
  onRetry,
  sendImageUpload,
  sendSupervisionReportUpdate,
  sendSupervisionStarted,
} from "../utils/backendData";
import { DATE_TIME_FORMAT } from "../utils/constants";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedSupervisionDetail,
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { routeBridgeId = "0", report } = selectedSupervisionDetail || {};

  const {
    id: supervisionReportId = -1,
    drivingLineOk = true,
    drivingLineInfo = "",
    speedLimitOk = true,
    speedLimitInfo = "",
    anomalies = false,
    anomaliesDescription = "",
    surfaceDamage = false,
    jointDamage = false,
    bendOrDisplacement = false,
    otherObservations = false,
    otherObservationsInfo = "",
    additionalInfo = "",
  } = report || {};

  // Added query to clear previous supervision from Redux store, otherwise that one is used
  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((superId: number) => sendSupervisionStarted(superId, dispatch), { retry: onRetry });
  const supervisionReportMutation = useMutation((updateRequest: ISupervisionReport) => sendSupervisionReportUpdate(updateRequest, dispatch), {
    retry: onRetry,
  });
  const imageUploadMutation = useMutation((fileUpload: IFileInput) => sendImageUpload(fileUpload, dispatch), { retry: onRetry });

  // Start the supervision if not already done
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;
  if (!isLoadingSupervision && !isSendingSupervisionStart && supervisionReportId <= 0) {
    supervisionStartMutation.mutate(Number(supervisionId));
  }

  // Note that even though summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to report when it is not draft anymore, so this does not happen?
  const summaryClicked = () => {
    const updatedReport = {
      id: supervisionReportId,
      supervisionId: Number(supervisionId),
      drivingLineOk,
      drivingLineInfo: !drivingLineOk ? drivingLineInfo : "",
      speedLimitOk,
      speedLimitInfo: !speedLimitOk ? speedLimitInfo : "",
      anomalies,
      anomaliesDescription: anomalies ? anomaliesDescription : "",
      surfaceDamage: anomalies ? surfaceDamage : false,
      jointDamage: anomalies ? jointDamage : false,
      bendOrDisplacement: anomalies ? bendOrDisplacement : false,
      otherObservations: anomalies ? otherObservations : false,
      otherObservationsInfo: anomalies && otherObservations ? otherObservationsInfo : "",
      additionalInfo,
      draft: true,
    } as ISupervisionReport;

    supervisionReportMutation.mutate(updatedReport);

    images.forEach((image) => {
      const fileUpload = {
        supervisionId: supervisionId.toString(),
        filename: image.filename,
        base64: image.dataUrl,
        taken: moment(image.date).format(DATE_TIME_FORMAT),
      } as IFileInput;

      imageUploadMutation.mutate(fileUpload);
    });

    history.push(`/summary/${supervisionId}`);
  };

  const noNetworkNoData =
    (isFailed.getSupervision && selectedSupervisionDetail === undefined) ||
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header
        title={t("supervision.title")}
        somethingFailed={isFailed.getSupervision || isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge}
      />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader
              permit={selectedPermitDetail as IPermit}
              routeBridge={selectedBridgeDetail as IRouteBridge}
              supervision={selectedSupervisionDetail as ISupervision}
            />
            <SupervisionPhotos supervision={selectedSupervisionDetail as ISupervision} />
            <SupervisionObservations supervision={selectedSupervisionDetail as ISupervision} />
            <SupervisionFooter supervision={selectedSupervisionDetail as ISupervision} summaryClicked={summaryClicked} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Supervision;
