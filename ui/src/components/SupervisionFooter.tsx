import React from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  saveDisabled: boolean;
  cancelDisabled: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  saveLabel: string;
  cancelLabel: string;
}

const SupervisionFooter = ({
  saveDisabled,
  cancelDisabled,
  saveChanges,
  cancelChanges,
  saveLabel,
  cancelLabel,
}: SupervisionFooterProps): JSX.Element => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" expand="block" size="large" disabled={saveDisabled} onClick={() => saveChanges()}>
            {saveLabel}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="tertiary" expand="block" size="large" disabled={cancelDisabled} onClick={() => cancelChanges()}>
            {cancelLabel}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
