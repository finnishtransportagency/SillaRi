import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonThumbnail,
  IonToast,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import IFileInput from "../interfaces/IFileInput";
import { getPermitOfRouteBridge, getRouteBridge, getSupervision, onRetry, sendSingleUpload, sendSupervisionReportUpdate } from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";
import { getOrigin } from "../utils/request";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SummaryProps {
  supervisionId: string;
}

const SupervisionSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SummaryProps>();
  const [toastMessage, setToastMessage] = useState("");

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedSupervisionDetail,
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};
  const { routeBridgeId = "0", report, images: supervisionImages = [] } = selectedSupervisionDetail || {};

  const {
    id: supervisionReportId,
    drivingLineOk,
    drivingLineInfo,
    speedLimitOk,
    speedLimitInfo,
    anomalies,
    anomaliesDescription,
    surfaceDamage,
    seamDamage,
    bendsDisplacements,
    otherObservations,
    otherObservationsInfo,
    additionalInfo,
  } = report || {};

  useQuery(["getSupervision", supervisionId], () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail), { retry: onRetry });

  // Use the enabled option to only fetch data when routeBridgeId is available
  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });

  // Set-up mutations for modifying data later
  const reportUpdateMutation = useMutation((updateRequest: ISupervisionReport) => sendSupervisionReportUpdate(updateRequest, dispatch), {
    retry: onRetry,
  });
  const singleUploadMutation = useMutation((fileUpload: IFileInput) => sendSingleUpload(fileUpload, dispatch), { retry: onRetry });

  const { isLoading: isSendingReportUpdate, isSuccess: isReportUpdateSuccessful } = reportUpdateMutation;
  useEffect(() => {
    if (isReportUpdateSuccessful) {
      setToastMessage(t("supervision.summary.saved"));
    }
  }, [isReportUpdateSuccessful, t]);

  const save = () => {
    if (report !== undefined) {
      const updateRequest = {
        id: supervisionReportId,
        supervisionId: Number(supervisionId),
        drivingLineOk,
        drivingLineInfo,
        speedLimitOk,
        speedLimitInfo,
        anomalies,
        anomaliesDescription,
        surfaceDamage,
        seamDamage,
        bendsDisplacements,
        otherObservations,
        otherObservationsInfo,
        additionalInfo,
        draft: false,
      } as ISupervisionReport;

      reportUpdateMutation.mutate(updateRequest);

      images.forEach((image) => {
        const fileUpload = {
          supervisionId: supervisionId.toString(),
          filename: image.filename,
          base64: image.dataUrl,
          taken: moment(image.date).format(dateTimeFormat),
        } as IFileInput;

        singleUploadMutation.mutate(fileUpload);
      });
    }
  };

  let anomaliesSummary = "";
  if (anomalies) {
    if (surfaceDamage) {
      anomaliesSummary = t("supervision.report.surfaceDamage");
    }
    if (seamDamage) {
      if (anomaliesSummary.length > 0) {
        anomaliesSummary += ", ";
      }
      anomaliesSummary += t("supervision.report.seamDamage");
    }
    if (bendsDisplacements) {
      if (anomaliesSummary.length > 0) {
        anomaliesSummary += ", ";
      }
      anomaliesSummary += t("supervision.report.bendsDisplacements");
    }
    if (otherObservations && otherObservationsInfo) {
      if (anomaliesSummary.length > 0) {
        anomaliesSummary += ", ";
      }
      anomaliesSummary += otherObservationsInfo;
    }
  }

  const noNetworkNoData =
    (isFailed.getSupervision && selectedSupervisionDetail === undefined) ||
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  const imagesLength = () => {
    if (images && images.length === 0 && supervisionImages && supervisionImages.length > 0) {
      return supervisionImages.length;
    }
    return images ? images.length : " ";
  };

  return (
    <IonPage>
      <Header
        title={t("supervision.summary.title")}
        somethingFailed={isFailed.getSupervision || isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge}
      />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("supervision.permitNumber")} {permitNumber}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">{t("supervision.summary.supervisionStarted")}TODO</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("supervision.summary.bridgeName")} {bridgeName} | {bridgeIdentifier}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabelBold">
                  {t("supervision.summary.images")} ({imagesLength} {t("supervision.summary.kpl")})
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              {supervisionImages.length === 0 &&
                images.map((imageItem) => (
                  <IonItem key={imageItem.id}>
                    <IonCol>
                      <IonThumbnail>
                        <IonImg src={imageItem.dataUrl} />
                      </IonThumbnail>
                    </IonCol>
                  </IonItem>
                ))}
              {supervisionImages.length > 0 &&
                supervisionImages.map((image) => (
                  <IonItem key={image.id}>
                    <IonCol>
                      <IonThumbnail>
                        <IonImg src={`${getOrigin()}/api/images/get?objectKey=${image.objectKey}`} />
                      </IonThumbnail>
                    </IonCol>
                  </IonItem>
                ))}
            </IonRow>
            <IonRow>
              <IonCol size="auto">
                <IonItem>
                  <IonIcon
                    icon={!drivingLineOk ? closeCircleOutline : checkmarkCircleOutline}
                    class={!drivingLineOk ? "checkMarkRed" : "checkMarkGreen"}
                  />
                  <IonLabel class="crossingCheckedLabel">{t("supervision.summary.drivingLine")}</IonLabel>
                </IonItem>
              </IonCol>
              {!drivingLineOk && (
                <IonCol size="auto">
                  <IonItem>
                    <IonText>{drivingLineInfo}</IonText>
                  </IonItem>
                </IonCol>
              )}
              <IonCol size="auto">
                <IonItem>
                  <IonIcon
                    icon={!speedLimitOk ? closeCircleOutline : checkmarkCircleOutline}
                    class={!speedLimitOk ? "checkMarkRed" : "checkMarkGreen"}
                  />
                  <IonLabel class="crossingCheckedLabel">{t("supervision.summary.speedLimit")}</IonLabel>
                </IonItem>
              </IonCol>
              {!speedLimitOk && (
                <IonCol size="auto">
                  <IonItem>
                    <IonText>{speedLimitInfo}</IonText>
                  </IonItem>
                </IonCol>
              )}
            </IonRow>

            <IonRow class={anomalies ? "crossingVisibleRow" : "crossingHiddenRow"}>
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.summary.anomalies")}:</IonLabel>
                <IonItem>{anomaliesSummary}</IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.summary.anomaliesDescription")}:</IonLabel>
                <IonItem>{anomaliesDescription}</IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.summary.additionalInfo")}:</IonLabel>
                <IonItem>{additionalInfo}</IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton onClick={() => history.goBack()}>{t("supervision.summary.buttons.edit")}</IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  disabled={isSendingReportUpdate}
                  onClick={() => {
                    save();
                  }}
                >
                  {t("supervision.summary.buttons.save")}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
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