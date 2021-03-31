import {
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonCheckbox,
  IonButton,
} from "@ionic/react";
import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import Header from "../components/Header";
import { RootState, useTypedSelector } from "../store/store";
import IRadioValue from "../interfaces/IRadioValue";
import { actions as crossingActions } from "../store/crossingsSlice";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import crossingmutation, { startCrossingMutation } from "../graphql/CrossingMutation";
import ICrossingDetail from "../interfaces/ICrossingDetails";

export const Crossing: React.FC = () => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    loading,
    selectedCompanyDetail,
    selectedBridgeDetail,
    selectedCrossingDetail,
    selectedAuthorizationDetail,
    selectedRouteDetail,
  } = crossings;
  const { id: companyId = -1 } = selectedCompanyDetail || {};
  const { id: authorizationId = -1 } = selectedAuthorizationDetail || {};
  const { id: bridgeId = -1 } = selectedBridgeDetail || {};
  const { id: routeId = -1 } = selectedRouteDetail || {};
  const [startCrossing, { data }] = useMutation<ICrossingDetail>(startCrossingMutation, {
    onCompleted: (response) => dispatch({ type: crossingActions.START_CROSSING, payload: response }),
    onError: (err) => console.error(err),
  });

  if (selectedCrossingDetail === undefined && !loading) {
    dispatch({ type: crossingActions.SET_LOADING, payload: true });
    startCrossing({
      variables: { routeId, bridgeId },
    });
  }

  const { name: bridgeName = "" } = selectedBridgeDetail || {};
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
    id = -1,
  } = selectedCrossingDetail || {};
  const { permissionId = "" } = selectedAuthorizationDetail || {};
  function changeTextAreaValue(pname: string, pvalue: string) {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.CROSSING_TEXTAREA_CHANGED, payload: change });
  }

  function radioClicked(radioName: string, radioValue: string) {
    const radioPayload = {
      name: radioName,
      value: radioValue === "yes",
    } as IRadioValue;
    dispatch({ type: crossingActions.CROSSING_RADIO_CHANGED, payload: radioPayload });
  }
  function checkBoxClicked(checkBoxName: string, checkBoxValue: boolean) {
    const radioPayload = {
      name: checkBoxName,
      value: checkBoxValue,
    } as IRadioValue;
    dispatch({ type: crossingActions.CROSSING_RADIO_CHANGED, payload: radioPayload });
  }
  return (
    <IonPage>
      <Header title={t("crossing.title")} />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.permitNumber")} {permissionId}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.crossingStarted")} {started}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.bridgeName")} {bridgeName}
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
              <IonButton>{t("crossing.buttons.drivingLine")}</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="crossingHeader">
              <IonListHeader color="secondary">
                <IonLabel>{t("crossing.question.drivingLine")}</IonLabel>
              </IonListHeader>
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
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("crossing.question.drivingLineInfo")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem class="whyItem">
                  <IonTextarea
                    class="whyTextArea"
                    value={drivingLineInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("drivingLineInfoDescription", e.detail.value!);
                    }}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonRadioGroup>

          <IonRow class="crossingHeader">
            <IonCol>
              <IonListHeader color="secondary">
                <IonLabel>{t("crossing.question.speed")}</IonLabel>
              </IonListHeader>
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
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("crossing.question.speedInfo")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem class="whyItem">
                  <IonTextarea
                    class="whyTextArea"
                    value={speedInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("speedInfoDescription", e.detail.value!);
                    }}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonRadioGroup>

          <IonRow class="crossingHeader">
            <IonCol>
              <IonListHeader color="secondary">
                <IonLabel>{t("crossing.question.exceptions")}</IonLabel>
              </IonListHeader>
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
                <IonLabel>{t("crossing.exceptions.permantBendings")}</IonLabel>
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
              <IonItem class="whyItem">
                <IonListHeader>
                  <IonLabel class="whyLabel">{t("crossing.exceptions.describe")}</IonLabel>
                </IonListHeader>
              </IonItem>
              <IonItem class="whyItem">
                <IonTextarea
                  class="whyTextArea"
                  value={exceptionsInfoDescription}
                  onIonChange={(e) => {
                    return changeTextAreaValue("exceptionsInfoDescription", e.detail.value!);
                  }}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="whyCol">
              <IonItem class="whyItem">
                <IonListHeader>
                  <IonLabel class="whyLabel">{t("crossing.extraInfo")}</IonLabel>
                </IonListHeader>
              </IonItem>
              <IonItem class="whyItem">
                <IonTextarea
                  class="whyTextArea"
                  value={extraInfoDescription}
                  onIonChange={(e) => {
                    return changeTextAreaValue("extraInfoDescription", e.detail.value!);
                  }}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton>{t("crossing.buttons.exit")}</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink={`/summary/${id}`}>{t("crossing.buttons.summary")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Crossing;
