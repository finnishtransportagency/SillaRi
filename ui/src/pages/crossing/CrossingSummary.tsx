import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonPage, IonRow, IonThumbnail } from "@ionic/react";
import { useMutation } from "@apollo/client";
import { RootState, useTypedSelector } from "../../store/store";
import Header from "../../components/Header";
import client from "../../service/apolloClient";
import uploadmutation from "../../graphql/UploadMutation";
import crossingmutation from "../../graphql/CrossingMutation";
import ICrossingInput from "../../interfaces/ICrossingInput";

export const CrossingSummary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const company = crossingProps.Companies[crossingProps.selectedCompany];
  const authorization = company.authorizations[crossingProps.selectedAuthorization];
  const transportRoute = authorization.routes[crossingProps.selectedRoute];
  const crossing = transportRoute.crossings[crossingProps.selectedCrossing];
  const dispatch = useDispatch();
  const [upload, { data }] = useMutation(uploadmutation.uploadMutation);
  console.log(crossing);
  function save() {
    console.log("save");
    const cross = {
      id: -1,
      bridgeId: 1,
      started: crossing.started,
      drivingLineInfo: crossing.drivingLineInfo,
      drivingLineInfoDesc: crossing.drivingLineInfoDesc === null ? "" : crossing.drivingLineInfoDesc,
      speedInfo: crossing.speedInfo,
      speedInfoDesc: crossing.speedInfoDesc === null ? "" : crossing.speedInfoDesc,
      exceptionsInfo: crossing.exceptionsInfo,
      exceptionsInfoDesc: crossing.exceptionsInfoDesc === null ? "" : crossing.exceptionsInfoDesc,
      describe: crossing.describe,
      descriptionDesc: crossing.descriptionDesc === null ? "" : crossing.descriptionDesc,
      extraInfoDesc: crossing.extraInfoDesc === null ? "" : crossing.extraInfoDesc,
      permantBendings: crossing.permantBendings,
      twist: crossing.twist,
      damage: crossing.damage,
    } as ICrossingInput;
    console.log(cross);
    const id = client.mutate({ mutation: crossingmutation.saveCrossingMutation, variables: { crossing: cross } });
    let i;
    // eslint-disable-next-line no-plusplus
    for (i = 0; i < crossing.images.length; i++) {
      const ret = client.mutate({
        mutation: uploadmutation.uploadMutation,
        variables: { crossingId: crossing.id.toString(), filename: crossing.images[i].filename, base64image: crossing.images[i].dataUrl },
      });
      console.log(ret);
    }
  }
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
                {t("crossing.summary.crossingStarted")} {crossing.started}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.summary.bridgeName")} {crossing.bridge.name}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                {t("crossing.summary.images")} ({crossing.images.length} {t("crossing.summary.kpl")})
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            {crossing.images.map((imageItem, i) => (
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
