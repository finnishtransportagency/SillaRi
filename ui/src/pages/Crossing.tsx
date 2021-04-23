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
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import { useTypedSelector } from "../store/store";
import IRadioValue from "../interfaces/IRadioValue";
import { actions as crossingActions } from "../store/crossingsSlice";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import { startCrossingMutation, updateCrossingMutation } from "../graphql/CrossingMutation";
import ICrossingDetail from "../interfaces/ICrossingDetails";
import ICrossingInput from "../interfaces/ICrossingInput";
import { client } from "../service/apolloClient";
import uploadMutation from "../graphql/UploadMutation";
import { crossingOfRouteBridgeQuery } from "../graphql/CrossingQuery";
import ICrossingUpdate from "../interfaces/ICrossingUpdate";
import ICrossingStart from "../interfaces/ICrossingStart";

interface CrossingProps {
  routeBridgeId: string;
}

export const Crossing = (): JSX.Element => {
  const { t } = useTranslation();
  const hist = useHistory();
  const dispatch = useDispatch();
  const { routeBridgeId } = useParams<CrossingProps>();

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
    id = -1,
  } = selectedCrossingDetail || {};

  // Added useQuery to clear previous crossing from Redux store, otherwise that one is used
  useQuery<ICrossingDetail>(crossingOfRouteBridgeQuery(Number(routeBridgeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_CROSSING, payload: response }),
    onError: (err) => console.error(err),
    fetchPolicy: "cache-and-network",
  });

  const [startCrossing, { data }] = useMutation<ICrossingStart>(startCrossingMutation, {
    onCompleted: (response) => dispatch({ type: crossingActions.START_CROSSING, payload: response }),
    onError: (err) => console.error(err),
  });

  const [updateCrossing, { data: updateData }] = useMutation<ICrossingUpdate>(updateCrossingMutation, {
    onCompleted: (response) => {
      dispatch({ type: crossingActions.CROSSING_SUMMARY, payload: response });
      console.log("history");
      hist.push(`/summary/${id}`);
    },
    onError: (err) => console.error(err),
  });

  useEffect(() => {
    // selectedCrossingDetail is undefined when query is still unresolved, but returns null if not found from DB
    if (selectedCrossingDetail === null) {
      startCrossing({
        variables: { routeBridgeId },
      });
    }
  }, [routeBridgeId, selectedCrossingDetail, startCrossing]);

  function changeTextAreaValue(pname: string, pvalue: string) {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: crossingActions.CROSSING_TEXTAREA_CHANGED, payload: change });
  }

  // Note that even though summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to crossing when it is not draft anymore, so this does not happen?
  function summaryClicked() {
    const updateRequest = {
      id,
      routeBridgeId: Number(routeBridgeId),
      started,
      drivingLineInfo,
      drivingLineInfoDescription,
      speedInfo,
      speedInfoDescription,
      exceptionsInfo,
      exceptionsInfoDescription,
      describe,
      extraInfoDescription,
      permanentBendings,
      twist,
      damage,
      draft: true,
    } as ICrossingInput;

    updateCrossing({
      variables: { crossing: updateRequest },
    }).then(() => {
      images.forEach((image) => {
        const pataken = moment(image.date, "dd.MM.yyyy HH:mm:ss");
        const ret = client.mutate({
          mutation: uploadMutation.uploadMutation,
          variables: {
            crossingId: id.toString(),
            filename: image.filename,
            base64image: image.dataUrl,
            taken: pataken,
          },
        });
      });
    });
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
                <IonCard>
                  <IonLabel class="crossingLabelBold">{t("crossing.question.drivingLineInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={drivingLineInfoDescription}
                      onIonChange={(e) => {
                        return changeTextAreaValue("drivingLineInfoDescription", e.detail.value!);
                      }}
                    />
                  </IonCard>
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
                <IonCard>
                  <IonLabel class="crossingLabelBold">{t("crossing.question.speedInfo")}</IonLabel>
                  <IonCard>
                    <IonTextarea
                      class="crossingTextArea"
                      value={speedInfoDescription}
                      onIonChange={(e) => {
                        return changeTextAreaValue("speedInfoDescription", e.detail.value!);
                      }}
                    />
                  </IonCard>
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
              <IonCard>
                <IonLabel class="crossingLabelBold">{t("crossing.exceptions.describe")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={exceptionsInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("exceptionsInfoDescription", e.detail.value!);
                    }}
                  />
                </IonCard>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="whyCol">
              <IonCard>
                <IonLabel class="crossingLabelBold">{t("crossing.extraInfo")}</IonLabel>
                <IonCard>
                  <IonTextarea
                    class="crossingTextArea"
                    value={extraInfoDescription}
                    onIonChange={(e) => {
                      return changeTextAreaValue("extraInfoDescription", e.detail.value!);
                    }}
                  />
                </IonCard>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton disabled>{t("crossing.buttons.exit")}</IonButton>
            </IonCol>
            <IonCol>
              <IonButton onClick={() => summaryClicked()}>{t("crossing.buttons.summary")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Crossing;
