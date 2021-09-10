import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { useTypedSelector } from "../store/store";
import IRadioValue from "../interfaces/IRadioValue";
import { actions as crossingActions } from "../store/crossingsSlice";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import IFileInput from "../interfaces/IFileInput";
import {
  getPermitOfRouteBridge,
  getRouteBridge,
  getSupervision,
  onRetry,
  sendSingleUpload,
  sendSupervisionReportUpdate,
  sendSupervisionStart,
} from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SupervisionProps {
  supervisionId: string;
}

const Crossing = (): JSX.Element => {
  const { t } = useTranslation();
  const hist = useHistory();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedCrossingDetail,
    selectedSupervisionDetail,
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};
  const { routeBridgeId, report } = selectedSupervisionDetail || {};

  const {
    id: supervisionReportId = -1,
    drivingLineOk = true,
    drivingLineInfo = "",
    speedLimitOk = true,
    speedLimitInfo = "",
    anomalies = false,
    anomaliesDescription = "",
    surfaceDamage = false,
    seamDamage = false,
    bendsDisplacements = false,
    otherObservations = "",
    additionalInfo = "",
    created,
  } = report || {};

  // Added query to clear previous supervision from Redux store, otherwise that one is used
  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
  });

  // Set-up mutations for modifying data later
  // TODO change to report
  const supervisionStartMutation = useMutation((superId: number) => sendSupervisionStart(superId, dispatch), { retry: onRetry });
  const supervisionReportMutation = useMutation((updateRequest: ISupervisionReport) => sendSupervisionReportUpdate(updateRequest, dispatch), {
    retry: onRetry,
  });
  const singleUploadMutation = useMutation((fileUpload: IFileInput) => sendSingleUpload(fileUpload, dispatch), { retry: onRetry });

  // Start the crossing if not already done
  // TODO change to report
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;
  if (!isLoadingSupervision && !isSendingSupervisionStart && supervisionReportId <= 0) {
    supervisionStartMutation.mutate(Number(supervisionReportId));
  }

  const changeTextAreaValue = (pname: string, pvalue: string) => {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.CROSSING_TEXTAREA_CHANGED, payload: change });
  };

  // Note that even though summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to report when it is not draft anymore, so this does not happen?
  const summaryClicked = () => {
    const updateRequest = {
      id: supervisionReportId,
      supervisionId: Number(supervisionId),
      drivingLineOk,
      drivingLineInfo: !drivingLineOk ? drivingLineInfo : "",
      speedLimitOk,
      speedLimitInfo: !speedLimitOk ? speedLimitInfo : "",
      anomalies,
      anomaliesDescription: anomalies ? anomaliesDescription : "",
      surfaceDamage: anomalies ? surfaceDamage : false,
      seamDamage: anomalies ? seamDamage : false,
      bendsDisplacements: anomalies ? bendsDisplacements : false,
      otherObservations: anomalies ? otherObservations : "",
      additionalInfo,
      draft: true,
    } as ISupervisionReport;

    supervisionReportMutation.mutate(updateRequest);

    images.forEach((image) => {
      const fileUpload = {
        supervisionId: supervisionId.toString(),
        filename: image.filename,
        base64: image.dataUrl,
        taken: moment(image.date).format(dateTimeFormat),
      } as IFileInput;

      singleUploadMutation.mutate(fileUpload);
    });

    console.log("history");
    hist.push(`/summary/${supervisionId}`);
  };

  const radioClicked = (radioName: string, radioValue: string) => {
    const radioPayload = {
      name: radioName,
      value: radioValue === "yes",
    } as IRadioValue;
    dispatch({ type: crossingActions.CROSSING_RADIO_CHANGED, payload: radioPayload });
  };

  const checkBoxClicked = (checkBoxName: string, checkBoxValue: boolean) => {
    const radioPayload = {
      name: checkBoxName,
      value: checkBoxValue,
    } as IRadioValue;
    dispatch({ type: crossingActions.CROSSING_RADIO_CHANGED, payload: radioPayload });
  };

  const noNetworkNoData =
    (isFailed.getSupervision && selectedSupervisionDetail === undefined) ||
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined) ||
    (isFailed.getCrossingOfRouteBridge && selectedCrossingDetail === undefined);

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
                <IonLabel class="crossingLabel">
                  {t("supervision.supervisionStarted")} {created}
                </IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("supervision.bridgeName")} {bridgeName} | {bridgeIdentifier}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <a href="fooo">{t("supervision.crossingInstructions")}</a>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingHeader">{t("supervision.photosDrivingLine")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton routerLink="/takephotos">{t("supervision.buttons.takePhotos")}</IonButton>
              </IonCol>
              <IonCol>
                <IonButton disabled>{t("supervision.buttons.drivingLine")}</IonButton>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol class="crossingHeader">
                <IonLabel class="crossingLabelBold">{t("supervision.report.observations")}</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol class="crossingHeader">
                <IonLabel class="crossingLabelBold">{t("supervision.report.drivingLineOk")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={drivingLineOk ? "yes" : "no"} onIonChange={(e) => radioClicked("drivingLineOk", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="crossingRadioLabel">{t("supervision.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="crossingRadioLabel">{t("supervision.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow style={!drivingLineOk ? {} : { display: "none" }} class="whyRow">
                <IonCol class="whyCol">
                  <IonLabel class="crossingLabelBold">{t("supervision.report.drivingLineInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={drivingLineInfo}
                      onIonChange={(e) => {
                        return changeTextAreaValue("drivingLineInfo", e.detail.value ?? "");
                      }}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonRadioGroup>

            <IonRow class="crossingHeader">
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.report.speedLimit")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={speedLimitOk ? "yes" : "no"} onIonChange={(e) => radioClicked("speedLimitOk", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel>{t("supervision.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel>{t("supervision.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow style={!speedLimitOk ? {} : { display: "none" }} class="whyRow">
                <IonCol class="whyCol">
                  <IonLabel class="crossingLabelBold">{t("supervision.report.speedLimitOk")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={speedLimitInfo}
                      onIonChange={(e) => {
                        return changeTextAreaValue("speedLimitInfo", e.detail.value ?? "");
                      }}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonRadioGroup>

            <IonRow class="crossingHeader">
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.report.anomalies")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={anomalies ? "yes" : "no"} onIonChange={(e) => radioClicked("anomalies", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="whyLabel">{t("supervision.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="whyLabel">{t("supervision.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonRadioGroup>
            <IonRow style={anomalies ? {} : { display: "none" }} class="whyRow">
              <IonCol class="whyCol">
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("supervision.report.anomalies")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem key="surfaceDamage">
                  <IonCheckbox
                    slot="start"
                    value="surfaceDamage"
                    checked={surfaceDamage}
                    onClick={() => checkBoxClicked("surfaceDamage", !surfaceDamage)}
                  />
                  <IonLabel>{t("supervision.report.surfaceDamage")}</IonLabel>
                </IonItem>
                <IonItem key="seamDamage">
                  <IonCheckbox slot="start" value="seamDamage" checked={seamDamage} onClick={() => checkBoxClicked("seamDamage", !seamDamage)} />
                  <IonLabel>{t("supervision.report.seamDamage")}</IonLabel>
                </IonItem>
                <IonItem key="bendsDisplacements">
                  <IonCheckbox
                    slot="start"
                    value="bendsDisplacements"
                    checked={bendsDisplacements}
                    onClick={() => checkBoxClicked("bendsDisplacements", !bendsDisplacements)}
                  />
                  <IonLabel>{t("supervision.report.bendsDisplacements")}</IonLabel>
                </IonItem>
                <IonItem key="otherObservations">
                  <IonLabel>{t("supervision.report.otherObservations")}</IonLabel>
                  <IonTextarea
                    class="crossingTextArea"
                    value={otherObservations}
                    onIonChange={(e) => {
                      return changeTextAreaValue("otherObservations", e.detail.value ?? "");
                    }}
                  />
                </IonItem>
                <IonItem key="anomaliesDescription">
                  <IonLabel>{t("supervision.report.anomaliesDescription")}</IonLabel>
                  <IonTextarea
                    class="crossingTextArea"
                    value={anomaliesDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("anomaliesDescription", e.detail.value ?? "");
                    }}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow style={anomalies ? {} : { display: "none" }}>
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.report.anomaliesDescription")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={anomaliesDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("anomaliesDescription", e.detail.value ?? "");
                    }}
                  />
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="whyCol">
                <IonLabel class="crossingLabelBold">{t("supervision.report.additionalInfo")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={additionalInfo}
                    onIonChange={(e) => {
                      return changeTextAreaValue("additionalInfo", e.detail.value ?? "");
                    }}
                  />
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton disabled>{t("supervision.buttons.exit")}</IonButton>
              </IonCol>
              <IonCol>
                <IonButton disabled={supervisionReportId <= 0} onClick={() => summaryClicked()}>
                  {t("supervision.buttons.summary")}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Crossing;
