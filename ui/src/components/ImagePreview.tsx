import React from "react";
import { IonFab, IonFabButton, IonIcon, IonImg, IonPopover } from "@ionic/react";
import close from "../theme/icons/close.svg";
import "./ImagePreview.css";

interface ImagePreviewProps {
  imageUrl: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ImagePreview = ({ imageUrl, isOpen, setIsOpen }: ImagePreviewProps): JSX.Element => {
  return (
    <IonPopover isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonImg src={imageUrl} onClick={() => setIsOpen(false)} />
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton color="light" onClick={() => setIsOpen(false)}>
          <IonIcon icon={close} />
        </IonFabButton>
      </IonFab>
    </IonPopover>
  );
};

export default ImagePreview;
