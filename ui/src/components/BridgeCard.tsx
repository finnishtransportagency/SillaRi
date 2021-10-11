import React from "react";
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow} from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import {DATE_TIME_FORMAT_MIN} from "../utils/constants";
import Moment from "react-moment";

interface BridgeCardProps {
  routeBridge: IRouteBridge;
}

const BridgeCard = ({ routeBridge }: BridgeCardProps): JSX.Element => {
  const { id, bridge, supervision } = routeBridge || {};
  const { name, identifier, municipality } = bridge || {};
  const { plannedTime } = supervision || {};

  return (
    <IonCard button routerLink={`/bridgedetail/${id}`}>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCardHeader class="ion-text-left">
              <IonCardTitle>{name}</IonCardTitle>
              <IonCardContent>
                <IonRow>{`${identifier}, ${municipality}`}</IonRow>
                {plannedTime && (
                  <IonRow>
                    <Moment format={DATE_TIME_FORMAT_MIN}>{plannedTime}</Moment>
                  </IonRow>
                )}
              </IonCardContent>
            </IonCardHeader>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default BridgeCard;
