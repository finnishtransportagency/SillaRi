import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const AccessDenied = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("accessDenied.header.title")} />
      <IonContent className="ion-padding">
        <h1>{t("accessDenied.title")}</h1>
        <p>{t("accessDenied.content")}</p>
      </IonContent>
    </IonPage>
  );
};

export default AccessDenied;
