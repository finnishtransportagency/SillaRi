import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonRow } from "@ionic/react";
import { bus } from "ionicons/icons";
import Moment from "react-moment";
import moment from "moment";
import ICompany from "../interfaces/IBridge";
import { dateTimeFormat } from "../utils/constants";
import IBridge from "../interfaces/IBridge";

interface BridgeCardProps {
  bridge: IBridge;
}

const BridgeCard = ({ bridge }: BridgeCardProps): JSX.Element => {
  const { id, name } = bridge;

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
