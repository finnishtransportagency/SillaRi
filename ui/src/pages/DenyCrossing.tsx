import { IonContent, IonPage, IonText } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent fullscreen>
        <IonText>{t("denyCrossing.cantCross")}</IonText>
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
