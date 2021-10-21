import IDateLabel from "../interfaces/IDateLabel";
import { IonLabel, IonText } from "@ionic/react";
import Moment from "react-moment";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import React from "react";

interface LatestTransportInfoLabelProps {
  info: IDateLabel;
}

const LatestTransportInfoLabel = ({ info }: LatestTransportInfoLabelProps): JSX.Element => {
  return (
    <IonLabel>
      <small>
        <IonText>{`${info.label}: `}</IonText>
        <Moment format={DATE_TIME_FORMAT_MIN}>{info.date}</Moment>
      </small>
    </IonLabel>
  );
};

export default LatestTransportInfoLabel;
