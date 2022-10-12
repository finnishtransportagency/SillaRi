import React from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

interface SupervisionFooterProps {
  saveDisabled: boolean;
  cancelDisabled: boolean;
  sendImmediatelyDisabled: boolean;
  sendImmediatelyVisible: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  sendImmediately: () => void;
  saveLabel: string;
  cancelLabel: string;
  sendImmediatelyLabel: string;
}

const SupervisionFooter = ({
  saveDisabled,
  cancelDisabled,
  sendImmediatelyDisabled,
  saveChanges,
  cancelChanges,
  sendImmediately,
  saveLabel,
  cancelLabel,
  sendImmediatelyLabel,
  sendImmediatelyVisible,
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
      {sendImmediatelyVisible && (
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton color="primary" expand="block" size="large" disabled={sendImmediatelyDisabled} onClick={() => sendImmediately()}>
              {sendImmediatelyLabel}
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
};

export default SupervisionFooter;
