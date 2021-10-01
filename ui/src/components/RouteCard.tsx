import React from "react";
import { useTranslation } from "react-i18next";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { analyticsOutline } from "ionicons/icons";
// import Moment from "react-moment";
import IRoute from "../interfaces/IRoute";
// import { DATE_TIME_FORMAT } from "../utils/constants";

interface RouteCardProps {
  route: IRoute;
}

const RouteCard = ({ route }: RouteCardProps): JSX.Element => {
  const { id: routeId, name } = route;
  const { t } = useTranslation();

  // Route address not yet implemented in LeLu API, might be null
  const { departureAddress, arrivalAddress } = route || {};
  const departureStreetaddress = departureAddress.streetaddress || {};
  const arrivalStreetaddress = arrivalAddress.streetaddress || {};

  return (
    <IonCard button routerLink={`/routeDetail/${routeId}`}>
      <IonCardHeader className="ion-text-left">
        <IonCardTitle>
          <IonText>{`${t("company.route")} ${name}`} </IonText>
          <IonText className="ion-float-right">
            <IonIcon icon={analyticsOutline} />
            <IonText>{` ${t("company.route")}`}</IonText>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-text-left">
        <IonGrid>
          {departureAddress && (
            <IonRow>
              <IonCol>
                <IonText>{`${departureStreetaddress}`}</IonText>
              </IonCol>
            </IonRow>
          )}
          {arrivalAddress && (
            <IonRow>
              <IonCol>
                <IonText>{`> ${arrivalStreetaddress}`}</IonText>
              </IonCol>
            </IonRow>
          )}
          {/* TODO We do not get departure time from route, should we fetch route transport and read the departure status?
          How do we get that transport instance, since route can have multiple transport instances? */}
          {/*
          <IonRow>
            <IonCol>
              <Moment format={DATE_TIME_FORMAT}>{departureTime}</Moment>
            </IonCol>
          </IonRow>
          */}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default RouteCard;
