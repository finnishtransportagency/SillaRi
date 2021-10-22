import React from "react";
import { useTranslation } from "react-i18next";
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import { flag } from "ionicons/icons";
import CustomAccordion from "./common/CustomAccordion";
import IRoute from "../interfaces/IRoute";

interface RouteAccordionProps {
  route: IRoute;
}

const RouteAccordion = ({ route }: RouteAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeId, departureAddress, arrivalAddress } = route || {};
  const { streetAddress: departureStreetAddress } = departureAddress || {};
  const { streetAddress: arrivalStreetAddress } = arrivalAddress || {};

  return (
    <CustomAccordion
      items={[
        {
          uuid: "permit",
          heading: <IonText>{t("route.routeInfo.title")}</IonText>,
          panel: (
            <div>
              <IonItem className="itemIcon" detail detailIcon={flag} routerLink={`/routemap/${routeId}`}>
                <IonLabel className="headingText">{t("route.routeInfo.route")}</IonLabel>
                <IonText className="routeLinkText">{t("route.routeInfo.showWholeRoute")}</IonText>
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={flag} color="primary" slot="start" />
                <IonLabel>
                  <IonLabel>{t("route.routeInfo.departurePoint")}</IonLabel>
                  <IonLabel>
                    <small>{departureStreetAddress}</small>
                  </IonLabel>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={flag} color="primary" slot="start" />
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

export default RouteAccordion;
