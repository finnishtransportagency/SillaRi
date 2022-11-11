import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import IRoute from "../interfaces/IRoute";
import mapPoint from "../theme/icons/map-point.svg";
import mapRoute from "../theme/icons/map-route.svg";

interface RouteAccordionProps {
  route: IRoute;
  transportNumber?: number;
  openMap: (routeId?: number) => void;
  mapDisabled?: boolean;
  isPanelOpen?: boolean;
}

const RouteAccordion = ({ route, transportNumber, openMap, mapDisabled, isPanelOpen }: RouteAccordionProps): JSX.Element => {
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
          isPanelOpen,
          panel: (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonItem
                    lines="none"
                    className="itemIcon iconLink"
                    detail
                    detailIcon={mapRoute}
                    onClick={() => openMap(routeId)}
                    disabled={mapDisabled}
                  >
                    <IonLabel className="headingText">{t("route.routeInfo.route")}</IonLabel>
                    <IonText className="linkText">{t("route.routeInfo.showRouteOnMap")}</IonText>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-lg="6">
                  <IonItem lines="none">
                    <IonIcon className="otherIcon" icon={mapPoint} color="primary" slot="start" />
                    <IonLabel>
                      <IonLabel>{t("route.routeInfo.departurePoint")}</IonLabel>
                      <IonLabel>
                        <small>{departureStreetAddress}</small>
                      </IonLabel>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-lg="6">
                  <IonItem lines="none">
                    <IonIcon className="otherIcon" icon={mapPoint} color="primary" slot="start" />
                    <IonLabel>
                      <IonLabel>{t("route.routeInfo.arrivalPoint")}</IonLabel>
                      <IonLabel>
                        <small>{arrivalStreetAddress}</small>
                      </IonLabel>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem lines="none">
                    {transportNumber ? (
                      <IonText>{`${t("route.routeInfo.transportNumber")}: ${transportNumber}`}</IonText>
                    ) : (
                      <IonText color="danger">{t("route.routeInfo.transportNumbersUsed")}</IonText>
                    )}
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
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
