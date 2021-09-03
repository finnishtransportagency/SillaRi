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
import ICrossingInput from "../interfaces/ICrossingInput";
import IFileInput from "../interfaces/IFileInput";
import {
  getPermitOfRouteBridge,
  getRouteBridge,
  getSupervision,
  onRetry,
  sendCrossingStart,
  sendCrossingUpdate,
  sendSingleUpload,
} from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";

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
  const { routeBridgeId } = selectedSupervisionDetail || {};

  const {
    speedInfo = true,
    describe = false,
    exceptionsInfo = "",
    drivingLineInfo = false,
    speedInfoDescription = "",
    drivingLineInfoDescription = "",
    exceptionsInfoDescription = "",
    extraInfoDescription = "",
    damage = false,
    twist = false,
    permanentBendings = false,
    started = "",
    id: supervisionReportId = -1,
  } = selectedCrossingDetail || {};

  // Added query to clear previous supervision from Redux store, otherwise that one is used
  useQuery(["getSupervision", supervisionId], () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail), { retry: onRetry });
  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
  });

  // TODO change to report
  const { isLoading: isLoadingSupervisionReport } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  // Set-up mutations for modifying data later
  // TODO change to report
  const supervisionStartMutation = useMutation((routeBrId: number) => sendCrossingStart(routeBrId, dispatch), { retry: onRetry });
  const supervisionUpdateMutation = useMutation((updateRequest: ICrossingInput) => sendCrossingUpdate(updateRequest, dispatch), {
    retry: onRetry,
  });
  const singleUploadMutation = useMutation((fileUpload: IFileInput) => sendSingleUpload(fileUpload, dispatch), { retry: onRetry });

  // Start the crossing if not already done
  // TODO change to report
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;
  if (!isLoadingSupervisionReport && !isSendingSupervisionStart && supervisionReportId <= 0) {
    supervisionStartMutation.mutate(Number(supervisionReportId));
  }

  const changeTextAreaValue = (pname: string, pvalue: string) => {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.CROSSING_TEXTAREA_CHANGED, payload: change });
  };

  // Note that even though summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to crossing when it is not draft anymore, so this does not happen?
  const summaryClicked = () => {
    const updateRequest = {
      id: supervisionReportId,
      routeBridgeId: Number(routeBridgeId),
      started,
      drivingLineInfo,
      drivingLineInfoDescription: !drivingLineInfo ? drivingLineInfoDescription : "",
      speedInfo,
      speedInfoDescription: !speedInfo ? speedInfoDescription : "",
      exceptionsInfo,
      describe,
      exceptionsInfoDescription: describe ? exceptionsInfoDescription : "",
      extraInfoDescription,
      permanentBendings,
      twist,
      damage,
      draft: true,
    } as ICrossingInput;

    supervisionUpdateMutation.mutate(updateRequest);

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
        title={t("crossing.title")}
        somethingFailed={isFailed.getSupervision || isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge || isFailed.getCrossingOfRouteBridge}
      />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("crossing.permitNumber")} {permitNumber}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("crossing.crossingStarted")} {started}
                </IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonLabel class="crossingLabel">
                  {t("crossing.bridgeName")} {bridgeName} | {bridgeIdentifier}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <a href="fooo">{t("crossing.crossingInstructions")}</a>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton routerLink="/takephotos">{t("crossing.buttons.takePhotos")}</IonButton>
              </IonCol>
              <IonCol>
                <IonButton disabled>{t("crossing.buttons.drivingLine")}</IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="crossingHeader">
                <IonLabel class="crossingLabelBold">{t("crossing.question.drivingLine")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={drivingLineInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("drivingLineInfo", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="crossingRadioLabel">{t("crossing.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="crossingRadioLabel">{t("crossing.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow style={!drivingLineInfo ? {} : { display: "none" }} id="drivigingLineInfoRow" class="whyRow">
                <IonCol class="whyCol">
                  <IonLabel class="crossingLabelBold">{t("crossing.question.drivingLineInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={drivingLineInfoDescription}
                      onIonChange={(e) => {
                        return changeTextAreaValue("drivingLineInfoDescription", e.detail.value ?? "");
                      }}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonRadioGroup>

            <IonRow class="crossingHeader">
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("crossing.question.speed")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={speedInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("speedInfo", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel>{t("crossing.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel>{t("crossing.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow style={!speedInfo ? {} : { display: "none" }} class="whyRow">
                <IonCol class="whyCol">
                  <IonLabel class="crossingLabelBold">{t("crossing.question.speedInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={speedInfoDescription}
                      onIonChange={(e) => {
                        return changeTextAreaValue("speedInfoDescription", e.detail.value ?? "");
                      }}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonRadioGroup>

            <IonRow class="crossingHeader">
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("crossing.question.exceptions")}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRadioGroup value={exceptionsInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("exceptionsInfo", e.detail.value)}>
              <IonRow>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="whyLabel">{t("crossing.answer.yes")}</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                </IonCol>
                <IonCol class="crossingRadioCol">
                  <IonItem>
                    <IonLabel class="whyLabel">{t("crossing.answer.no")}</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonRadioGroup>
            <IonRow style={exceptionsInfo ? {} : { display: "none" }} class="whyRow">
              <IonCol class="whyCol">
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("crossing.question.exceptionsInfo")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem key="bendings">
                  <IonCheckbox
                    slot="start"
                    value="bending"
                    checked={permanentBendings}
                    onClick={() => checkBoxClicked("permantBendings", !permanentBendings)}
                  />
                  <IonLabel>{t("crossing.exceptions.permanentBendings")}</IonLabel>
                </IonItem>
                <IonItem key="twist">
                  <IonCheckbox slot="start" value="twist" checked={twist} onClick={() => checkBoxClicked("twist", !twist)} />
                  <IonLabel>{t("crossing.exceptions.twist")}</IonLabel>
                </IonItem>
                <IonItem key="damage">
                  <IonCheckbox slot="start" value="damage" checked={damage} onClick={() => checkBoxClicked("damage", !damage)} />
                  <IonLabel>{t("crossing.exceptions.damage")}</IonLabel>
                </IonItem>
                <IonItem key="somethingElse">
                  <IonCheckbox slot="start" value="somethingElse" checked={describe} onClick={() => checkBoxClicked("someThingElse", !describe)} />
                  <IonLabel>{t("crossing.exceptions.somethingElse")}</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow style={describe ? {} : { display: "none" }}>
              <IonCol>
                <IonLabel class="crossingLabelBold">{t("crossing.exceptions.describe")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={exceptionsInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("exceptionsInfoDescription", e.detail.value ?? "");
                    }}
                  />
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="whyCol">
                <IonLabel class="crossingLabelBold">{t("crossing.extraInfo")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={extraInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("extraInfoDescription", e.detail.value ?? "");
                    }}
                  />
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton disabled>{t("crossing.buttons.exit")}</IonButton>
              </IonCol>
              <IonCol>
                <IonButton disabled={supervisionReportId <= 0} onClick={() => summaryClicked()}>
                  {t("crossing.buttons.summary")}
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
