import React, { useState } from "react";
import { IonCol, IonImg, IonRow, IonSpinner, IonThumbnail } from "@ionic/react";
import { onlineManager, useIsMutating } from "react-query";
import moment from "moment";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import { getOrigin } from "../utils/request";
import ImagePreview from "./ImagePreview";
import { DATE_TIME_FORMAT } from "../utils/constants";
import "./ImageThumbnailRow.css";

interface ImageThumbnailRowProps {
  images: ISupervisionImage[];
}

const ImageThumbnailRow = ({ images }: ImageThumbnailRowProps): JSX.Element => {
  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

  // Check if images are being uploaded using the mutationKey defined in Photos.tsx
  const isImageUploadMutating = useIsMutating(["imageUpload"]);

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonRow>
      {isImageUploadMutating > 0 && onlineManager.isOnline() && (
        <IonCol>
          <IonSpinner color="primary" className="imageSpinner" />
        </IonCol>
      )}

      {(isImageUploadMutating === 0 || !onlineManager.isOnline()) &&
        images &&
        images.length > 0 &&
        [...images]
          .sort((a, b) => {
            const am = moment(a.taken, DATE_TIME_FORMAT);
            const bm = moment(b.taken, DATE_TIME_FORMAT);
            return bm.diff(am, "seconds");
          })
          .map((image) => {
            // When offline, show images using the base64 data, otherwise download the image from the backend
            const imageUrl = image.base64 && image.base64.length > 0 ? image.base64 : `${getOrigin()}/api/images/get?id=${image.id}`;
            const key = `image_${image.id}`;

            return (
              <IonCol key={key} size="3">
                <IonThumbnail className="imageThumbnail" onClick={() => showImage(true, imageUrl)}>
                  <IonImg src={imageUrl} />
                </IonThumbnail>
              </IonCol>
            );
          })}

      <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />
    </IonRow>
  );
};

export default ImageThumbnailRow;
