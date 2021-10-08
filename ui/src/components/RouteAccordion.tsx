import React from "react";
import { useTranslation } from "react-i18next";
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import { flag } from "ionicons/icons";
import CustomAccordion from "./common/CustomAccordion";
import IRoute from "../interfaces/IRoute";
import "./RouteAccordion.css";

interface RouteAccordionProps {
  route: IRoute;
}

const RouteAccordion = ({ route }: RouteAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeId, departureAddress, arrivalAddress } = route || {};
  const { streetaddress: departureStreetaddress } = departureAddress || {};
  const { streetaddress: arrivalStreetaddress } = arrivalAddress || {};

  return (
    <CustomAccordion
      items={[
        {
          uuid: "permit",
          heading: <IonText className="headingText">{t("route.routeInfo.title")}</IonText>,
          panel: (
            <div>
              <IonItem className="routeLink" detail detailIcon={flag} routerLink={`/routemap/${routeId}`}>
                <IonLabel className="headingText">{t("route.routeInfo.route")}</IonLabel>
                <IonText className="routeLinkText">{t("route.routeInfo.showWholeRoute")}</IonText>
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={flag} color="primary" slot="start" />
                <IonLabel>
                  <IonLabel className="headingText">{t("route.routeInfo.departurePoint")}</IonLabel>
                  <IonLabel>{departureStreetaddress}</IonLabel>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={flag} color="primary" slot="start" />
                <IonLabel>
                  <IonLabel className="headingText">{t("route.routeInfo.arrivalPoint")}</IonLabel>
                  <IonLabel>{arrivalStreetaddress}</IonLabel>
                </IonLabel>
              </IonItem>
            </div>
          ),
        },
      ]}
    />
  );
};

export default RouteAccordion;
