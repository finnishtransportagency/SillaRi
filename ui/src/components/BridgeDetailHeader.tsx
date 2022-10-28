import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager } from "react-query";
import { IonImg, IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import mapPoint from "../theme/icons/map-point.svg";
import "./BridgeDetailHeader.css";
import { getOrigin } from "../utils/request";

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

  const getBridgeImageUrl = () => {
    const backendImageUrl = `${getOrigin()}/api/routebridge/getBridgeImage?routeBridgeId=${routeBridgeId}`;
    const image = new Image();
    image.src = backendImageUrl;
    if (image.height === 0) {
      return "/assets/silta_oletuskuva.png";
    }
    return backendImageUrl;
  };

  return (
    <>
      {isOnline && <IonImg className="bridgeImage" src={getBridgeImageUrl()} />}
      <IonItem className="header" lines="none">
        <IonLabel>{t("bridge.title").toUpperCase()}</IonLabel>
      </IonItem>
      <IonItem className="itemIcon" detail detailIcon="" lines="full">
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
