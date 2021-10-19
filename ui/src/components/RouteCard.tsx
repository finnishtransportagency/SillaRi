import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import IRoute from "../interfaces/IRoute";

interface RouteCardProps {
  route: IRoute;
}

const RouteCard = ({ route }: RouteCardProps): JSX.Element => {
  const { id: routeId, name } = route;

  // TODO We do not get departure time from route, should we fetch route transport and read the departure status?
  // How do we get that transport instance, since route can have multiple transport instances?
  // TODO - change this to use route transport
  return (
    <IonItem detail routerLink={`/routeDetail/${routeId}`}>
      <IonLabel>
        <IonLabel>{name}</IonLabel>
        <IonLabel>
          <small>DATE TIME TODO</small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default RouteCard;
