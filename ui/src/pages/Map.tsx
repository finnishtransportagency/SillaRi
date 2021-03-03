import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import MapContainer from "../components/MapContainer";

const Map = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent fullscreen>
        <MapContainer />
      </IonContent>
    </IonPage>
  );
};

export default Map;
