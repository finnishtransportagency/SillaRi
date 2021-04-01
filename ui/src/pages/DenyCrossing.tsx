import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, IonTextarea } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent>
        <div className="cardListContainer" />
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>
                <h5>{t("denyCrossing.cantCross")}</h5>
                <p>{t("denyCrossing.whyCantCross")}</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
