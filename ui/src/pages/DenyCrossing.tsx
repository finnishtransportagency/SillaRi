import { IonContent, IonPage, IonText, IonTextarea } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent fullscreen>
        <IonText>
          <h5>{t("denyCrossing.cantCross")}</h5>
          <p>{t("denyCrossing.whyCantCross")}</p>
        </IonText>
        <IonTextarea />
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
