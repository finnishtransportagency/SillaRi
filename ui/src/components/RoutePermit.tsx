import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonRouterLink, IonRow, IonText } from "@ionic/react";
import { analyticsOutline, documentTextOutline, flagOutline } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";

interface RoutePermitProps {
  selectedPermit: IPermit;
  selectedRoute: IRoute;
}

const RoutePermit = ({ selectedPermit, selectedRoute }: RoutePermitProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { permitNumber } = selectedPermit || {};
  const { id: routeId, departureAddress, arrivalAddress } = selectedRoute || {};
  const { street: departureStreet, postalcode: departurePostalCode, city: departureCity } = departureAddress || {};
  const { street: arrivalStreet, postalcode: arrivalPostalCode, city: arrivalCity } = arrivalAddress || {};

  return !(selectedPermit && selectedRoute) ? null : (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className="headingText">{t("route.permitInfo.title")}</IonText>
          </IonCol>
          <IonCol size="auto">
            <IonRouterLink routerLink={`/routemap/${routeId}`}>
              <IonIcon icon={analyticsOutline} />
              <IonText className="linkText">{` ${t("company.route")}`}</IonText>
            </IonRouterLink>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText>{t("route.permitInfo.permitNumber")}</IonText>
          </IonCol>
          <IonCol>
            <IonText>{permitNumber}</IonText>
            <IonText className="ion-float-right">
              <IonIcon icon={documentTextOutline} />
              <IonText>{" PDF"}</IonText>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>{t("route.permitInfo.routeDeparturePoint")}</IonText>
          </IonCol>
          <IonCol>
            {departureAddress && <IonText>{`${departureStreet}, ${departurePostalCode} ${departureCity}`}</IonText>}
            <IonText className="ion-float-right">
              <IonIcon icon={flagOutline} />
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>{t("route.permitInfo.routeArrivalPoint")}</IonText>
          </IonCol>
          <IonCol>
            {arrivalAddress && <IonText>{`${arrivalStreet}, ${arrivalPostalCode} ${arrivalCity}`}</IonText>}
            <IonText className="ion-float-right">
              <IonIcon icon={flagOutline} />
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default RoutePermit;
