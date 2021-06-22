import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import ICrossingInput from "../interfaces/ICrossingInput";
import IFileInput from "../interfaces/IFileInput";
import { getCrossing, getPermitOfRouteBridge, getRouteBridge, sendCrossingUpdate, sendSingleUpload } from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";

interface CrossingSummaryProps {
  crossingId: string;
}

const CrossingSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { crossingId = "0" } = useParams<CrossingSummaryProps>();
  const [toastMessage, setToastMessage] = useState("");

  const { selectedPermitDetail, selectedBridgeDetail, selectedCrossingDetail, images = [] } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};

  const {
    routeBridgeId = "0",
    started = "",
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
    images: crossingImages = [],
  } = selectedCrossingDetail || {};

  useEffect(() => {
    getCrossing(dispatch, Number(crossingId), null);
  }, [dispatch, crossingId]);

  useEffect(() => {
    if (selectedCrossingDetail !== undefined) {
      getRouteBridge(dispatch, Number(routeBridgeId));
      getPermitOfRouteBridge(dispatch, Number(routeBridgeId));
    }
  }, [dispatch, selectedCrossingDetail, routeBridgeId]);

  const save = () => {
    if (selectedCrossingDetail !== undefined) {
      const updateRequest = {
        id: Number(crossingId),
        routeBridgeId,
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
        draft: false,
      } as ICrossingInput;

      sendCrossingUpdate(dispatch, updateRequest, null);

      images.forEach((image) => {
        const fileUpload = {
          crossingId: selectedCrossingDetail.id.toString(),
          filename: image.filename,
          base64: image.dataUrl,
          taken: moment(image.date).format(dateTimeFormat),
        } as IFileInput;

        sendSingleUpload(fileUpload);
      });

      setToastMessage(t("crossing.summary.saved"));
    }
  };

  let exceptionsText = "";
  if (exceptionsInfo) {
    if (permanentBendings) {
      exceptionsText = t("crossing.exceptions.permanentBendings");
    }
    if (twist) {
      if (exceptionsText.length > 0) {
        exceptionsText += ", ";
      }
      exceptionsText += t("crossing.exceptions.twist");
    }
    if (damage) {
      if (exceptionsText.length > 0) {
        exceptionsText += ", ";
      }
      exceptionsText += t("crossing.exceptions.damage");
    }
    if (describe) {
      if (exceptionsText.length > 0) {
        exceptionsText += ", ";
      }
      exceptionsText += t("crossing.exceptions.somethingElse");
    }
  }

  return (
    <IonPage>
      <Header title={t("crossing.summary.title")} />
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
                {t("crossing.summary.crossingStarted")} {started}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel class="crossingLabel">
                {t("crossing.summary.bridgeName")} {bridgeName} | {bridgeIdentifier}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel class="crossingLabelBold">
                {t("crossing.summary.images")} ({images.length === 0 && crossingImages.length > 0 ? crossingImages.length : images.length}{" "}
                {t("crossing.summary.kpl")})
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            {crossingImages.length === 0 &&
              images.map((imageItem) => (
                <IonItem key={imageItem.id}>
                  <IonCol>
                    <IonThumbnail>
                      <IonImg src={imageItem.dataUrl} />
                    </IonThumbnail>
                  </IonCol>
                </IonItem>
              ))}
            {crossingImages.length > 0 &&
              crossingImages.map((crossingImage) => (
                <IonItem key={crossingImage.id}>
                  <IonCol>
                    <IonThumbnail>
                      <IonImg src={`/api/images/get?objectKey=${crossingImage.objectKey}`} />
                    </IonThumbnail>
                  </IonCol>
                </IonItem>
              ))}
          </IonRow>
          <IonRow>
            <IonCol size="auto">
              <IonItem>
                <IonIcon
                  icon={!drivingLineInfo ? closeCircleOutline : checkmarkCircleOutline}
                  class={!drivingLineInfo ? "checkMarkRed" : "checkMarkGreen"}
                />
                <IonText class="crossingCheckedLabel">{t("crossing.summary.drivingLine")}</IonText>
              </IonItem>
            </IonCol>
            <IonCol size="auto">
              <IonItem>
                <IonIcon icon={!speedInfo ? closeCircleOutline : checkmarkCircleOutline} class={!speedInfo ? "checkMarkRed" : "checkMarkGreen"} />
                <IonText class="crossingCheckedLabel">{t("crossing.summary.speed")}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel class="crossingLabelBold">{t("crossing.summary.exceptions")}:</IonLabel>
              <IonItem>{exceptionsText}</IonItem>
            </IonCol>
          </IonRow>
          <IonRow class={describe ? "crossingVisibleRow" : "crossingHiddenRow"}>
            <IonCol>
              <IonLabel class="crossingLabelBold">{t("crossing.summary.exceptionsDesc")}:</IonLabel>
              <IonItem>{exceptionsInfoDescription}</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel class="crossingLabelBold">{t("crossing.summary.extraInfo")}:</IonLabel>
              <IonItem>{extraInfoDescription}</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={() => history.goBack()}>{t("crossing.summary.buttons.edit")}</IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  save();
                }}
              >
                {t("crossing.summary.buttons.save")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

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

export default CrossingSummary;
