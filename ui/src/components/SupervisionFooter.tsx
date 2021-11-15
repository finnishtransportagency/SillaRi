import React from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  isLoading: boolean;
  disabled: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  saveLabel: string;
  cancelLabel: string;
}

const SupervisionFooter = ({ isLoading, disabled, saveChanges, cancelChanges, saveLabel, cancelLabel }: SupervisionFooterProps): JSX.Element => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" expand="block" size="large" disabled={isLoading || disabled} onClick={() => saveChanges()}>
            {saveLabel}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="tertiary" expand="block" size="large" disabled={isLoading || disabled} onClick={() => cancelChanges()}>
            {cancelLabel}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
