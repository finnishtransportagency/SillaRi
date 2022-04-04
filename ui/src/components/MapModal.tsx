import React from "react";
import { IonFab, IonFabButton, IonIcon, IonModal } from "@ionic/react";
import close from "../theme/icons/close.svg";
import MapContainer from "./MapContainer";

interface MapModalProps {
  routeBridgeId?: string;
  routeId?: string;
  transportNumber?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MapModal = ({ routeBridgeId, routeId, transportNumber, isOpen, setIsOpen }: MapModalProps): JSX.Element => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <MapContainer routeBridgeIdParam={routeBridgeId} routeIdParam={routeId} transportNumberParam={transportNumber} />

      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton color="light" onClick={() => setIsOpen(false)}>
          <IonIcon icon={close} />
        </IonFabButton>
      </IonFab>
    </IonModal>
  );
};

export default MapModal;
