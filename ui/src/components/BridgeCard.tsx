import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import Moment from "react-moment";

interface BridgeCardProps {
  routeBridge: IRouteBridge;
  supervision?: ISupervision;
}

const BridgeCard = ({ routeBridge, supervision }: BridgeCardProps): JSX.Element => {
  const { id: routeBridgeId, bridge } = routeBridge;
  const { identifier, name } = bridge;
  const { plannedTime } = supervision || {};

  // TODO - change this to use supervision
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
