import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";

interface BridgeCardProps {
  routeBridge: IRouteBridge;
}

const BridgeCard = ({ routeBridge }: BridgeCardProps): JSX.Element => {
  const { id: routeBridgeId, bridge } = routeBridge;
  const { identifier, name } = bridge;

  // TODO - change this to use supervision
  return (
    <IonItem detail routerLink={`/bridgedetail/${routeBridgeId}`}>
      <IonLabel>
        <IonLabel>{name}</IonLabel>
        <small>
          <IonLabel>{identifier}</IonLabel>
        </small>
        <small>
          <IonLabel>DATE TIME TODO</IonLabel>
        </small>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
