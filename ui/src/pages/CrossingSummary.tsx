import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonPage, IonRow, IonThumbnail } from "@ionic/react";
import { useMutation } from "@apollo/client";
import { RootState, useTypedSelector } from "../store/store";
import Header from "../components/Header";
import client from "../service/apolloClient";
import uploadmutation from "../graphql/UploadMutation";
import crossingmutation from "../graphql/CrossingMutation";
import ICrossingInput from "../interfaces/ICrossingInput";

export const CrossingSummary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);

  console.log("CrossingSummary");
  const { images = [] } = crossingProps;
  const { selectedAuthorizationDetail, selectedCrossingDetail, selectedRouteDetail, selectedBridgeDetail, selectedCompanyDetail } = crossingProps;
  const dispatch = useDispatch();
  const [upload, { data }] = useMutation(uploadmutation.uploadMutation);
  console.log(selectedCrossingDetail);
  function save() {
    console.log("save");
    if (selectedCrossingDetail !== undefined) {
      const cross = {
        id: -1,
        bridgeId: 1,
        started: selectedCrossingDetail.started,
        drivingLineInfo: selectedCrossingDetail.drivingLineInfo,
        drivingLineInfoDesc: selectedCrossingDetail.drivingLineInfoDesc === null ? "" : selectedCrossingDetail.drivingLineInfoDesc,
        speedInfo: selectedCrossingDetail.speedInfo,
        speedInfoDesc: selectedCrossingDetail.speedInfoDesc === null ? "" : selectedCrossingDetail.speedInfoDesc,
        exceptionsInfo: selectedCrossingDetail.exceptionsInfo,
        exceptionsInfoDesc: selectedCrossingDetail.exceptionsInfoDesc === null ? "" : selectedCrossingDetail.exceptionsInfoDesc,
        describe: selectedCrossingDetail.describe,
        descriptionDesc: selectedCrossingDetail.descriptionDesc === null ? "" : selectedCrossingDetail.descriptionDesc,
        extraInfoDesc: selectedCrossingDetail.extraInfoDesc === null ? "" : selectedCrossingDetail.extraInfoDesc,
        permantBendings: selectedCrossingDetail.permantBendings,
        twist: selectedCrossingDetail.twist,
        damage: selectedCrossingDetail.damage,
      } as ICrossingInput;
      console.log(cross);
      const id = client.mutate({ mutation: crossingmutation.saveCrossingMutation, variables: { crossing: cross } });
      let i;
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < images.length; i++) {
        const ret = client.mutate({
          mutation: uploadmutation.uploadMutation,
          variables: { crossingId: selectedCrossingDetail.id.toString(), filename: images[i].filename, base64image: images[i].dataUrl },
        });
        console.log(ret);
      }
    }
  }
  const { started = "" } = selectedCrossingDetail || {};
  const { name: bridgeName = "" } = selectedBridgeDetail || {};
  return (
    <IonPage>
      <Header title={t("crossing.title")} />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>{t("crossing.summary.title")}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.summary.crossingStarted")} {started}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.summary.bridgeName")} {bridgeName}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.summary.images")} ({images.length} {t("crossing.summary.kpl")})
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
          </IonRow>
          <IonRow>
            <IonCol>{t("crossing.summary.drivingLine")}</IonCol>
            <IonCol>{t("crossing.summary.speed")}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>{t("crossing.summary.exceptions")}</IonLabel>
              <IonItem>Pooooo</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>{t("crossing.summary.exceptionsDesc")}</IonLabel>
              <IonItem>Pooooo</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>{t("crossing.summary.extraInfo")}</IonLabel>
              <IonItem>Pooooo</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton>{t("crossing.summary.buttons.edit")}</IonButton>
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
