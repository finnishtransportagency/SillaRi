import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRouterLink,
  IonRow,
  IonText,
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
  sendImageUpload,
  sendSupervisionReportUpdate,
  sendSupervisionStarted,
} from "../utils/backendData";
import { DATE_TIME_FORMAT } from "../utils/constants";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import ImageThumbnailRow from "../components/ImageThumbnailRow";
import Moment from "react-moment";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const hist = useHistory();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedSupervisionDetail,
    images = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};
  const { routeBridgeId = "0", startedTime, report, images: supervisionImages = [] } = selectedSupervisionDetail || {};

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

    console.log("history");
    hist.push(`/summary/${supervisionId}`);
  };

  const radioClicked = (radioName: string, radioValue: string) => {
    const radioPayload = {
      name: radioName,
      value: radioValue === "yes",
    } as IRadioValue;
    dispatch({ type: crossingActions.REPORT_RADIO_CHANGED, payload: radioPayload });
  };

  const checkBoxClicked = (checkBoxName: string, checkBoxValue: boolean) => {
    const radioPayload = {
      name: checkBoxName,
      value: checkBoxValue,
    } as IRadioValue;
    dispatch({ type: crossingActions.REPORT_RADIO_CHANGED, payload: radioPayload });
  };

  const textAreaValueChanged = (pname: string, pvalue: string) => {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.REPORT_TEXTAREA_CHANGED, payload: change });
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
                  {t("supervision.supervisionStarted")} {startedTime ? <Moment format={DATE_TIME_FORMAT}>{startedTime}</Moment> : ""}
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
                {/* TODO */}
                <IonRouterLink className="disabledLink">
                  <IonText className="linkText">{t("supervision.crossingInstructions")}</IonText>
                </IonRouterLink>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingHeader">{t("supervision.photosDrivingLine")}</IonLabel>
              </IonCol>
            </IonRow>

            <ImageThumbnailRow images={images} supervisionImages={supervisionImages} />

            <IonRow>
              <IonCol>
                <IonButton routerLink={`/takephotos/${supervisionId}`}>{t("supervision.buttons.takePhotos")}</IonButton>
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
                        return textAreaValueChanged("drivingLineInfo", e.detail.value ?? "");
                      }}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonRadioGroup>

            <IonRow class="crossingHeader">
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("supervision.report.speedLimitOk")}</IonLabel>
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
                  <IonLabel class="crossingLabelBold">{t("supervision.report.speedLimitInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={speedLimitInfo}
                      onIonChange={(e) => {
                        return textAreaValueChanged("speedLimitInfo", e.detail.value ?? "");
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
                <IonItem key="surfaceDamage">
                  <IonCheckbox
                    slot="start"
                    value="surfaceDamage"
                    checked={surfaceDamage}
                    onClick={() => checkBoxClicked("surfaceDamage", !surfaceDamage)}
                  />
                  <IonLabel>{t("supervision.report.surfaceDamage")}</IonLabel>
                </IonItem>
                <IonItem key="jointDamage">
                  <IonCheckbox slot="start" value="jointDamage" checked={jointDamage} onClick={() => checkBoxClicked("jointDamage", !jointDamage)} />
                  <IonLabel>{t("supervision.report.jointDamage")}</IonLabel>
                </IonItem>
                <IonItem key="bendOrDisplacement">
                  <IonCheckbox
                    slot="start"
                    value="bendOrDisplacement"
                    checked={bendOrDisplacement}
                    onClick={() => checkBoxClicked("bendOrDisplacement", !bendOrDisplacement)}
                  />
                  <IonLabel>{t("supervision.report.bendOrDisplacement")}</IonLabel>
                </IonItem>
                <IonItem key="otherObservations">
                  <IonCheckbox
                    slot="start"
                    value="otherObservations"
                    checked={otherObservations}
                    onClick={() => checkBoxClicked("otherObservations", !otherObservations)}
                  />
                  <IonLabel style={!otherObservations ? {} : { display: "none" }}>{t("supervision.report.otherObservations")}</IonLabel>
                  {otherObservations && (
                    <IonTextarea
                      class="crossingTextArea"
                      placeholder={t("supervision.report.otherObservations")}
                      value={otherObservationsInfo}
                      onIonChange={(e) => {
                        return textAreaValueChanged("otherObservationsInfo", e.detail.value ?? "");
                      }}
                    />
                  )}
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
                      return textAreaValueChanged("anomaliesDescription", e.detail.value ?? "");
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
                      return textAreaValueChanged("additionalInfo", e.detail.value ?? "");
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
export default Supervision;
