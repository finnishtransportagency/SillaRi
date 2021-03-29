import { IonList, IonItem, IonLabel } from "@ionic/react";
import React from "react";
import IRoute from "../../interfaces/IRoute";

export const TransportRoute: React.FC<IRoute> = (route: IRoute) => {
  return (
    <IonList color="primary">
      <IonLabel>Reitti:{route.id}</IonLabel>
      <IonLabel slot="start">Alku</IonLabel>
      <IonItem color="primary">{route.departureTime}</IonItem>
      <IonItem color="primary" key={`D_${route.id}`} slot="start">
        {route.departureAddress.street} {route.departureAddress.postalcode} {route.departureAddress.city}
      </IonItem>
      <IonLabel slot="start">Loppu</IonLabel>
      <IonItem color="primary">{route.arrivalTime}</IonItem>
      <IonItem color="primary" key={`A_${route.id}`} slot="start">
        {route.arrivalAddress.street} {route.arrivalAddress.postalcode} {route.arrivalAddress.city}
      </IonItem>
    </IonList>
  );
};

export default TransportRoute;
