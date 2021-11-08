import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel } from "@ionic/react";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";

interface SupervisionStatusInfoProps {
  color: string;
  infoText: string;
  time?: Date;
}

const SupervisionStatusInfo = ({ color, infoText, time }: SupervisionStatusInfoProps): JSX.Element => {
  return (
    <IonItem color={color} className="itemIcon" detail detailIcon="" lines="none">
      <IonLabel className="headingText">{infoText}</IonLabel>
      {time && <IonLabel>{time ? <Moment format={DATE_TIME_FORMAT_MIN}>{time}</Moment> : ""}</IonLabel>}
    </IonItem>
  );
};

export default SupervisionStatusInfo;
