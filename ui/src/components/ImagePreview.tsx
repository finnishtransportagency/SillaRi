import React from "react";
import { IonImg, IonPopover } from "@ionic/react";
import "./ImagePreview.css";

interface ImagePreviewProps {
  imageUrl: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ImagePreview = ({ imageUrl, isOpen, setIsOpen }: ImagePreviewProps): JSX.Element => {
  return (
    <IonPopover cssClass="imagePreview" isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonImg src={imageUrl} onClick={() => setIsOpen(false)} />
    </IonPopover>
  );
};

export default ImagePreview;
