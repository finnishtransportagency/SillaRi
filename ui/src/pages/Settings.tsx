import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import "./Settings.css";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <IonPage>
      <Header title={t("main.header.title")} titleStyle="headingBoldText ion-text-center" />
      <IonContent color="light">
        <IonGrid className="ion-no-padding" fixed>
          <IonRow>
            <IonCol size="12" className="ion-padding">
              <IonText className="headingBoldText">{t("settings.header.title")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonList className="ion-no-padding">
                <IonRadioGroup value={i18n.language} onIonChange={(e) => changeLanguage(e.detail.value)}>
                  <IonListHeader color="secondary">
                    <IonLabel>{t("settings.language.label")}</IonLabel>
                  </IonListHeader>

                  <IonItem lines="full">
                    <IonLabel>{t("settings.language.fi")}</IonLabel>
                    <IonRadio slot="start" value="fi" />
                  </IonItem>

                  <IonItem lines="full">
                    <IonLabel>{t("settings.language.sv")}</IonLabel>
                    <IonRadio slot="start" value="sv" />
                  </IonItem>

                  <IonItem lines="none">
                    <IonLabel>{t("settings.language.en")}</IonLabel>
                    <IonRadio slot="start" value="en" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
