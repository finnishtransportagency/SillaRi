import React from "react";
import { useTranslation } from "react-i18next";
import { IonImg, IonItem, IonLabel } from "@ionic/react";
import { flag } from "ionicons/icons";
import IRouteBridge from "../interfaces/IRouteBridge";
import "./BridgeDetailHeader.css";

interface BridgeDetailHeaderProps {
  routeBridge: IRouteBridge;
}

const BridgeDetailHeader = ({ routeBridge }: BridgeDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeBridgeId, bridge } = routeBridge || {};
  const { identifier = "", municipality = "" } = bridge || {};

  return (
    <>
      <IonImg className="bridgeImage" src="assets/bridge.jpg" />
      <IonItem className="bridgeDetailHeader" lines="none">
        <IonLabel className="headingText">{t("bridge.title")}</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>{t("bridge.identifier")}</IonLabel>
        <IonLabel>{identifier}</IonLabel>
      </IonItem>
      <IonItem className="bridgeLink" detail detailIcon={flag} routerLink={`/bridgemap/${routeBridgeId}`}>
        <IonLabel>
          <IonLabel>{t("bridge.location")}</IonLabel>
          <IonLabel>
            <small>{municipality}</small>
          </IonLabel>
        </IonLabel>
      </IonItem>
    </>
  );
};

export default BridgeDetailHeader;
