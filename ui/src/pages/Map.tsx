import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import MapContainer from "../components/MapContainer";

interface MapProps {
  routeBridgeId?: string;
  routeId?: string;
  transportNumber?: string;
}

const Map = (): JSX.Element => {
  const { t } = useTranslation();

  // The page route provides either routeBridgeId or routeId, but not both
  // These values are checked later, so don't use default values here
  const { routeBridgeId, routeId, transportNumber } = useParams<MapProps>();

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonContent>
        <MapContainer routeBridgeIdParam={routeBridgeId} routeIdParam={routeId} transportNumberParam={transportNumber} />
      </IonContent>
    </IonPage>
  );
};

export default Map;
