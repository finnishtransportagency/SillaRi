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
        <IonLabel>
          <small>{identifier}</small>
        </IonLabel>
        <IonLabel>
          <small>DATE TIME TODO</small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
