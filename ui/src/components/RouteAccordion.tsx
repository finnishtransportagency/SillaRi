import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager } from "react-query";
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import IRoute from "../interfaces/IRoute";
import mapPoint from "../theme/icons/map-point.svg";
import mapRoute from "../theme/icons/map-route.svg";

interface RouteAccordionProps {
  route: IRoute;
  isPanelOpen?: boolean;
}

const RouteAccordion = ({ route, isPanelOpen }: RouteAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeId, departureAddress, arrivalAddress } = route || {};
  const { streetAddress: departureStreetAddress } = departureAddress || {};
  const { streetAddress: arrivalStreetAddress } = arrivalAddress || {};

  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => setOnline(onlineManager.isOnline()));
  }, []);

  return (
    <CustomAccordion
      items={[
        {
          uuid: "permit",
          heading: <IonText>{t("route.routeInfo.title")}</IonText>,
          isPanelOpen,
          panel: (
            <div>
              <IonItem className="itemIcon iconLink" detail detailIcon={mapRoute} routerLink={`/routemap/${routeId}`} disabled={!isOnline}>
                <IonLabel className="headingText">{t("route.routeInfo.route")}</IonLabel>
                <IonText className="linkText">{t("route.routeInfo.showRouteOnMap")}</IonText>
              </IonItem>
              <IonItem lines="none">
                <IonIcon className="otherIcon" icon={mapPoint} color="primary" slot="start" />
                <IonLabel>
                  <IonLabel>{t("route.routeInfo.departurePoint")}</IonLabel>
                  <IonLabel>
                    <small>{departureStreetAddress}</small>
                  </IonLabel>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonIcon className="otherIcon" icon={mapPoint} color="primary" slot="start" />
                <IonLabel>
                  <IonLabel>{t("route.routeInfo.arrivalPoint")}</IonLabel>
                  <IonLabel>
                    <small>{arrivalStreetAddress}</small>
                  </IonLabel>
                </IonLabel>
              </IonItem>
            </div>
          ),
        },
      ]}
    />
  );
};

RouteAccordion.defaultProps = {
  isPanelOpen: false,
};

export default RouteAccordion;
