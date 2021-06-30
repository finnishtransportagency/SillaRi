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
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import { useTypedSelector } from "../store/store";
import IRadioValue from "../interfaces/IRadioValue";
import { actions as crossingActions } from "../store/crossingsSlice";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ICrossingInput from "../interfaces/ICrossingInput";
import IFileInput from "../interfaces/IFileInput";
import {
  getCrossingOfRouteBridge,
  getPermitOfRouteBridge,
  getRouteBridge,
  onRetry,
  sendCrossingStart,
  sendCrossingUpdate,
  sendSingleUpload,
} from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";

interface CrossingProps {
  routeBridgeId: string;
}

const Crossing = (): JSX.Element => {
  const { t } = useTranslation();
  const hist = useHistory();
  const dispatch = useDispatch();
  const { routeBridgeId = "0" } = useParams<CrossingProps>();

  const { selectedPermitDetail, selectedBridgeDetail, selectedCrossingDetail, images = [] } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};

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
    id: crossingId = -1,
  } = selectedCrossingDetail || {};

  // Added query to clear previous crossing from Redux store, otherwise that one is used
  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch), { retry: onRetry });
  const { isLoading: isLoadingCrossing } = useQuery(
    ["getCrossingOfRouteBridge", routeBridgeId],
    () => getCrossingOfRouteBridge(Number(routeBridgeId), dispatch),
    { retry: onRetry }
  );

  // Set-up mutations for modifying data later
  const crossingStartMutation = useMutation((routeBrId: number) => sendCrossingStart(routeBrId, dispatch), { retry: onRetry });
  const crossingUpdateMutation = useMutation((updateRequest: ICrossingInput) => sendCrossingUpdate(updateRequest, dispatch), { retry: onRetry });
  const singleUploadMutation = useMutation((fileUpload: IFileInput) => sendSingleUpload(fileUpload, dispatch), { retry: onRetry });

  // Start the crossing if not already done
  const { isLoading: isSendingCrossingStart } = crossingStartMutation;
  if (!isLoadingCrossing && !isSendingCrossingStart && crossingId <= 0) {
    crossingStartMutation.mutate(Number(routeBridgeId));
  }

  const changeTextAreaValue = (pname: string, pvalue: string) => {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.CROSSING_TEXTAREA_CHANGED, payload: change });
  };

  // Note that even though summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to crossing when it is not draft anymore, so this does not happen?
  const summaryClicked = () => {
    const updateRequest = {
      id: crossingId,
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

    crossingUpdateMutation.mutate(updateRequest);

    images.forEach((image) => {
      const fileUpload = {
        crossingId: crossingId.toString(),
        filename: image.filename,
        base64: image.dataUrl,
        taken: moment(image.date).format(dateTimeFormat),
      } as IFileInput;

      singleUploadMutation.mutate(fileUpload);
    });

    console.log("history");
    hist.push(`/summary/${crossingId}`);
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

  return (
    <IonPage>
      <Header title={t("crossing.title")} />
      <IonContent fullscreen>
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
              <IonButton disabled={crossingId <= 0} onClick={() => summaryClicked()}>
                {t("crossing.buttons.summary")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Crossing;
