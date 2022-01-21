import { IonContent, IonPage, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup } from "@ionic/react";
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
      <Header title={t("settings.header.title")} />
      <IonContent>
        <IonList>
          <IonRadioGroup value={i18n.language} onIonChange={(e) => changeLanguage(e.detail.value)}>
            <IonListHeader color="secondary">
              <IonLabel>{t("settings.language.label")}</IonLabel>
            </IonListHeader>

            <IonItem>
              <IonLabel>{t("settings.language.fi")}</IonLabel>
              <IonRadio slot="start" value="fi" />
            </IonItem>

            <IonItem>
              <IonLabel>{t("settings.language.sv")}</IonLabel>
              <IonRadio slot="start" value="sv" />
            </IonItem>

            <IonItem>
              <IonLabel>{t("settings.language.en")}</IonLabel>
              <IonRadio slot="start" value="en" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
