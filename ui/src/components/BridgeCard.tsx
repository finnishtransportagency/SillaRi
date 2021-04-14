import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";

interface BridgeCardProps {
  routeBridge: IRouteBridge;
}

const BridgeCard = ({ routeBridge }: BridgeCardProps): JSX.Element => {
  const { id, bridge } = routeBridge;
  const { name } = bridge;

  return (
    <IonCard button routerLink={`/bridgedetail/${id}`}>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCardHeader class="ion-text-left">
              <IonCardTitle>{name}</IonCardTitle>
            </IonCardHeader>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default BridgeCard;
