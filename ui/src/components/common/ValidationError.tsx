import React from "react";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { warning } from "ionicons/icons";

interface ValidationErrorProps {
  label: string;
}

const ValidationError = ({ label }: ValidationErrorProps): JSX.Element => {
  return (
    <IonItem lines="none" className="ion-no-padding">
      <IonIcon className="otherIcon" icon={warning} color="danger" />
      <IonLabel color="danger">{label}</IonLabel>
    </IonItem>
  );
};

export default ValidationError;
