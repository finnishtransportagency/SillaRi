import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { checkmarkCircleOutline, checkmark } from "ionicons/icons";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonThumbnail,
} from "@ionic/react";
import { useMutation, useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router";
import moment from "moment";

import { RootState, useTypedSelector } from "../store/store";
import Header from "../components/Header";
import client, { apiUrl } from "../service/apolloClient";
import uploadmutation from "../graphql/UploadMutation";
import { updateCrossingMutation } from "../graphql/CrossingMutation";
import ICrossingInput from "../interfaces/ICrossingInput";
import ICrossingDetail from "../interfaces/ICrossingDetails";
import { actions as crossingActions } from "../store/crossingsSlice";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import { companyQuery } from "../graphql/CompanyQuery";
import queryCrossing from "../graphql/CrossingQuery";
import IImageItem from "../interfaces/IImageItem";
import IFile from "../interfaces/IFile";

interface CrossingSummaryProps {
  crossingId: string;
}

export const CrossingSummary = ({ match }: RouteComponentProps<CrossingSummaryProps>): JSX.Element => {
  const { t, i18n } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const { images = [] } = crossingProps;
  const { selectedCrossingDetail } = crossingProps;
  const dispatch = useDispatch();
  let url: string;
  const {
    params: { crossingId },
  } = match;
  useQuery<ICrossingDetail>(queryCrossing(Number(crossingId), true), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_CROSSING, payload: response }),
    onError: (err) => console.error(err),
    fetchPolicy: "cache-and-network",
  });
  const [updateCrossing, { data }] = useMutation<ICrossingDetail>(updateCrossingMutation, {
    onCompleted: (response) => dispatch({ type: crossingActions.CROSSING_SAVED, payload: response }),
    onError: (err) => console.error(err),
  });
  const {
    started = "",
    drivingLineInfo,
    speedInfo,
    route,
    describe,
    bridge,
    exceptionsInfoDescription,
    extraInfoDescription,
    damage,
    twist,
    permanentBendings,
    exceptionsInfo,
    authorization,
    drivingLineInfoDescription,
    speedInfoDescription,
    images: crossingImages,
  } = selectedCrossingDetail || {};
  const { id: routeId } = route || {};
  const { id: bridgeId, name: bridgeName = "", shortName: bridgeShortName = "" } = bridge || {};
  const { permissionId = "" } = authorization || {};
  function save() {
    if (selectedCrossingDetail !== undefined) {
      const updateRequest = {
        id: Number(crossingId),
        bridgeId,
        routeId,
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
      updateCrossing({
        variables: { crossing: updateRequest },
      });
      let i;
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < images.length; i++) {
        const pataken = moment(images[i].date, "dd.MM.yyyy HH:mm:ss");
        const ret = client.mutate({
          mutation: uploadmutation.uploadMutation,
          variables: {
            crossingId: selectedCrossingDetail.id.toString(),
            filename: images[i].filename,
            base64image: images[i].dataUrl,
            taken: pataken,
          },
        });
      }
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
                {t("crossing.permitNumber")} {permissionId}
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
                {t("crossing.summary.bridgeName")} {bridgeName} | {bridgeShortName}
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
            {images.map((imageItem, i) => (
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
              <IonButton routerLink={`/supervision/${routeId}/${bridgeId}`} routerDirection="back">
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
