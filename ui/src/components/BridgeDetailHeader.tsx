import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager } from "react-query";
import { IonImg, IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import mapPoint from "../theme/icons/map-point.svg";
import "./BridgeDetailHeader.css";

interface BridgeDetailHeaderProps {
  routeBridge: IRouteBridge;
}

const BridgeDetailHeader = ({ routeBridge }: BridgeDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeBridgeId, bridge } = routeBridge || {};
  const { identifier = "", municipality = "" } = bridge || {};

  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => setOnline(onlineManager.isOnline()));
  }, []);

  return (
    <>
      {isOnline && <IonImg className="bridgeImage" src="assets/bridge.jpg" />}
      <IonItem className="header" lines="none">
        <IonLabel>{t("bridge.title").toUpperCase()}</IonLabel>
      </IonItem>
      <IonItem className="itemIcon" detail detailIcon="">
        <IonLabel className="headingText">{t("bridge.identifier")}</IonLabel>
        <IonLabel>{identifier}</IonLabel>
      </IonItem>
      <IonItem
        className="itemIcon iconLink"
        detail
        detailIcon={mapPoint}
        routerLink={`/bridgemap/${routeBridgeId}`}
        disabled={!isOnline}
        lines="none"
      >
        <IonLabel className="headingText">{t("bridge.location")}</IonLabel>
        <IonLabel>{municipality}</IonLabel>
      </IonItem>
    </>
  );
};

export default BridgeDetailHeader;
