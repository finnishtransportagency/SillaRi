import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { checkmarkCircleOutline } from "ionicons/icons";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonRow, IonThumbnail } from "@ionic/react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import { apiUrl } from "../service/apolloClient";
import ICrossingInput from "../interfaces/ICrossingInput";
import IFileInput from "../interfaces/IFileInput";
import { getCrossing, sendCrossingUpdate, sendSingleUpload } from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";

interface CrossingSummaryProps {
  crossingId: string;
}

const CrossingSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { crossingId = "0" } = useParams<CrossingSummaryProps>();

  const { selectedPermitDetail, selectedBridgeDetail, selectedCrossingDetail, images = [] } = useTypedSelector((state) => state.crossingsReducer);
  const { permitNumber = "" } = selectedPermitDetail || {};
  const { name: bridgeName = "", identifier: bridgeIdentifier } = selectedBridgeDetail?.bridge || {};

  const {
    routeBridgeId,
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
    images: crossingImages,
  } = selectedCrossingDetail || {};

  useEffect(() => {
    getCrossing(dispatch, Number(crossingId), null);
  }, [dispatch, crossingId]);

  function save() {
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
      alert("Talletettu");
    }
  }

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
                {t("crossing.summary.images")} ({images.length === 0 && crossingImages !== undefined ? crossingImages.length : images.length}{" "}
                {t("crossing.summary.kpl")})
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            {images.map((imageItem) => (
              <IonItem key={imageItem.id}>
                <IonCol>
                  <IonThumbnail>
                    <IonImg src={imageItem.dataUrl} />
                  </IonThumbnail>
                </IonCol>
              </IonItem>
            ))}
            {crossingImages !== undefined
              ? crossingImages.map((crossingImage) => (
                  <IonItem key={crossingImage.id}>
                    <IonCol>
                      <IonThumbnail>
                        <IonImg src={`${apiUrl}images/get?objectKey=${crossingImage.objectKey}`} />
                      </IonThumbnail>
                    </IonCol>
                  </IonItem>
                ))
              : ""}
          </IonRow>
          <IonRow>
            <IonIcon icon={checkmarkCircleOutline} class={!drivingLineInfo ? "checkMarkRed" : "checkMarkGreen"} />
            <IonCol class="crossingCheckedLabel">{t("crossing.summary.drivingLine")}</IonCol>
            <IonIcon icon={checkmarkCircleOutline} class={!speedInfo ? "checkMarkRed" : "checkMarkGreen"} />
            <IonCol class="crossingCheckedLabel">{t("crossing.summary.speed")}</IonCol>
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
              <IonButton routerLink={`/crossing/${routeBridgeId}`} routerDirection="back">
                {t("crossing.summary.buttons.edit")}
              </IonButton>
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
      </IonContent>
    </IonPage>
  );
};

export default CrossingSummary;
