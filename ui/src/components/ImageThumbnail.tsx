import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonImg, IonThumbnail } from "@ionic/react";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import { onRetry } from "../utils/backendData";
import { getImageBase64 } from "../utils/supervisionBackendData";

interface ImageThumbnailProps {
  image: ISupervisionImage;
  className: string;
  slot?: string;
  showImage: (imageUrl?: string) => void;
}

const ImageThumbnail = ({ image, className, slot, showImage }: ImageThumbnailProps): JSX.Element => {
  const dispatch = useDispatch();

  // Show images using the base64 data if available, otherwise download the image from the backend
  const { id: imageId, base64: imageBase64 } = image;

  const { data: backendBase64 } = useQuery(["getImageBase64", Number(imageId)], () => getImageBase64(Number(imageId), dispatch), {
    retry: onRetry,
    staleTime: Infinity,
    enabled: !imageBase64,
  });

  return (
    <IonThumbnail className={className} slot={slot ?? ""} onClick={() => showImage(imageBase64 ?? backendBase64)}>
      <IonImg src={imageBase64 ?? backendBase64} />
    </IonThumbnail>
  );
};

export default ImageThumbnail;
