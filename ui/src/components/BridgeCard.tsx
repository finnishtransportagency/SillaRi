import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";

interface BridgeCardProps {
  routeBridge: IRouteBridge;
}

const BridgeCard = ({ routeBridge }: BridgeCardProps): JSX.Element => {
  const { id: routeBridgeId, bridge, supervision } = routeBridge;
  const { identifier, name } = bridge;
  const { plannedTime } = supervision || {};

  return (
    <IonItem detail routerLink={`/bridgedetail/${routeBridgeId}`}>
      <IonLabel>
        <IonLabel>{name}</IonLabel>
        <IonLabel>
          <small>{identifier}</small>
        </IonLabel>
        <IonLabel>
          <small>
            <Moment format={DATE_TIME_FORMAT_MIN}>{plannedTime}</Moment>
          </small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
