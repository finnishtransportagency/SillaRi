import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel } from "@ionic/react";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import ISupervision from "../interfaces/ISupervision";

interface BridgeCardProps {
  supervision: ISupervision;
}

const BridgeCard = ({ supervision }: BridgeCardProps): JSX.Element => {
  const { id: supervisionId, plannedTime, routeBridge } = supervision || {};
  const { bridge } = routeBridge || {};
  const { identifier, name } = bridge || {};

  return (
    <IonItem detail routerLink={`/bridgedetail/${supervisionId}`}>
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
