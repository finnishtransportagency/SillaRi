import React from "react";
import { useTranslation } from "react-i18next";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { analyticsOutline } from "ionicons/icons";
import Moment from "react-moment";
import IRoute from "../interfaces/IRoute";
import { dateTimeFormat } from "../utils/constants";

interface RouteCardProps {
  route: IRoute;
  authorizationId: number;
}

const RouteCard = ({ route, authorizationId }: RouteCardProps): JSX.Element => {
  const { id: routeId, name } = route;
  const { t } = useTranslation();

  const {
    departureAddress: { street: departureStreet, postalcode: departurePostalCode, city: departureCity },
    arrivalAddress: { street: arrivalStreet, postalcode: arrivalPostalCode, city: arrivalCity },
    departureTime,
  } = route;

  return (
      <IonCardHeader class="ion-text-left">
    <IonCard button routerLink={`/routeDetail/${authorizationId}/${routeId}`}>
        <IonCardTitle>
          <IonText class="ion-float-right">
          <IonText>{`${t("company.route")} ${name}`} </IonText>
            <IonIcon icon={analyticsOutline} />
            <IonText>{` ${t("company.route")}`}</IonText>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent class="ion-text-left">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>{`${departureStreet}, ${departurePostalCode} ${departureCity}`}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{`> ${arrivalStreet}, ${arrivalPostalCode} ${arrivalCity}`}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Moment format={dateTimeFormat}>{departureTime}</Moment>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default RouteCard;
