import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import CameraContainer from "../components/CameraContainer";

const Camera: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent fullscreen>
        <CameraContainer />
      </IonContent>
    </IonPage>
  );
};

export default Camera;
