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
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import Header from "../../components/Header";
import { RootState, useTypedSelector } from "../../store/store";
import IRadioValue from "../../interfaces/IRadioValue";
import { actions as crossingActions } from "../../store/crossingsSlice";

export const Crossing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const company = crossingProps.Companies[crossingProps.selectedCompany];
  const authorization = company.authorizations[crossingProps.selectedAuthorization];
  const transportRoute = authorization.routes[crossingProps.selectedRoute];
  const crossing = transportRoute.crossings[crossingProps.selectedCrossing];
  const dispatch = useDispatch();

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
                {t("crossing.permitNumber")} {authorization.permissionId}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.crossingStarted")} {crossing.started}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.bridgeName")} {crossing.bridge.name}
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
              <IonButton>{t("crossing.buttons.takePhotos")}</IonButton>
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
          <IonRadioGroup value={crossing.drivingLineInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("drivingLineInfo", e.detail.value)}>
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
            <IonRow style={!crossing.drivingLineInfo ? {} : { display: "none" }} id="drivigingLineInfoRow" class="whyRow">
              <IonCol class="whyCol">
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("crossing.question.drivingLineInfo")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem class="whyItem">
                  <IonTextarea class="whyTextArea" value={crossing.drivingLineInfoDesc} />
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
          <IonRadioGroup value={crossing.speedInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("speedInfo", e.detail.value)}>
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
            <IonRow style={!crossing.speedInfo ? {} : { display: "none" }} class="whyRow">
              <IonCol class="whyCol">
                <IonItem class="whyItem">
                  <IonListHeader>
                    <IonLabel class="whyLabel">{t("crossing.question.speedInfo")}</IonLabel>
                  </IonListHeader>
                </IonItem>
                <IonItem class="whyItem">
                  <IonTextarea class="whyTextArea" value={crossing.speedInfoDesc} />
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
          <IonRadioGroup value={crossing.exceptionsInfo ? "yes" : "no"} onIonChange={(e) => radioClicked("exceptionsInfo", e.detail.value)}>
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
          <IonRow style={crossing.exceptionsInfo ? {} : { display: "none" }} class="whyRow">
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
                  checked={crossing.permantBendings}
                  onClick={() => checkBoxClicked("permantBendings", !crossing.permantBendings)}
                />
                <IonLabel>{t("crossing.exceptions.permantBendings")}</IonLabel>
              </IonItem>
              <IonItem key="twist">
                <IonCheckbox slot="start" value="twist" checked={crossing.twist} onClick={() => checkBoxClicked("twist", !crossing.twist)} />
                <IonLabel>{t("crossing.exceptions.twist")}</IonLabel>
              </IonItem>
              <IonItem key="damage">
                <IonCheckbox slot="start" value="damage" checked={crossing.damage} onClick={() => checkBoxClicked("damage", !crossing.damage)} />
                <IonLabel>{t("crossing.exceptions.damage")}</IonLabel>
              </IonItem>
              <IonItem key="somethingElse">
                <IonCheckbox
                  slot="start"
                  value="somethingElse"
                  checked={crossing.describe}
                  onClick={() => checkBoxClicked("someThingElse", !crossing.describe)}
                />
                <IonLabel>{t("crossing.exceptions.somethingElse")}</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow style={crossing.describe ? {} : { display: "none" }}>
            <IonCol>
              <IonItem class="whyItem">
                <IonListHeader>
                  <IonLabel class="whyLabel">{t("crossing.exceptions.describe")}</IonLabel>
                </IonListHeader>
              </IonItem>
              <IonItem class="whyItem">
                <IonTextarea class="whyTextArea" value={crossing.descriptionDesc} />
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
                <IonTextarea class="whyTextArea" value={crossing.extraInfoDesc} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton>{t("crossing.buttons.exit")}</IonButton>
            </IonCol>
            <IonCol>
              <IonButton>{t("crossing.buttons.summary")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Crossing;
