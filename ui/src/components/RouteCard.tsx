import React from "react";
import { useTranslation } from "react-i18next";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { analyticsOutline } from "ionicons/icons";
import Moment from "react-moment";
import IRoute from "../interfaces/IRoute";
import { dateTimeFormat } from "../utils/constants";

interface RouteCardProps {
  route: IRoute;
  permitId: number;
}

const RouteCard = ({ route, permitId }: RouteCardProps): JSX.Element => {
  const { id: routeId, name } = route;
  const { t } = useTranslation();

  const {
    departureAddress: { street: departureStreet, postalcode: departurePostalCode, city: departureCity },
    arrivalAddress: { street: arrivalStreet, postalcode: arrivalPostalCode, city: arrivalCity },
    departureTime,
  } = route;

  return (
    <IonCard button routerLink={`/routeDetail/${permitId}/${routeId}`}>
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
