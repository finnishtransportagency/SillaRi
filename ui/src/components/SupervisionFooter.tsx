import React from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  isLoading: boolean;
  saveChanges: () => void;
  saveDenied: boolean;
  saveLabel: string;
  cancelChanges: () => void;
  cancelDenied: boolean;
  cancelLabel: string;
}

const SupervisionFooter = ({
  isLoading,
  saveChanges,
  saveDenied,
  saveLabel,
  cancelChanges,
  cancelDenied,
  cancelLabel,
}: SupervisionFooterProps): JSX.Element => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" expand="block" size="large" disabled={isLoading || saveDenied} onClick={() => saveChanges()}>
            {saveLabel}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="tertiary" expand="block" size="large" disabled={isLoading || cancelDenied} onClick={() => cancelChanges()}>
            {cancelLabel}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupervisionFooter;
