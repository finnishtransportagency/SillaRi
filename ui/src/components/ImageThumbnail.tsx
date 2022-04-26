import React from "react";
import { IonImg, IonThumbnail } from "@ionic/react";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import { getOrigin } from "../utils/request";

interface ImageThumbnailProps {
  image: ISupervisionImage;
  className: string;
  slot?: string;
  showImage: (imageUrl?: string) => void;
}

const ImageThumbnail = ({ image, className, slot, showImage }: ImageThumbnailProps): JSX.Element => {
  // Show images using the base64 data if available, otherwise download the image from the backend
  const { id: imageId, base64: imageBase64 } = image;

  // The base64 data is used in most cases so that the images are shown when offline
  // The backend *should* populate the base64 data for existing images, so the following url shouldn't be needed, but is here just in case
  const backendImageUrl = `${getOrigin()}/api/images/get?id=${imageId}`;

  return (
    <IonThumbnail className={className} slot={slot ?? ""} onClick={() => showImage(imageBase64 ?? backendImageUrl)}>
      <IonImg src={imageBase64 ?? backendImageUrl} />
    </IonThumbnail>
  );
};

export default ImageThumbnail;
