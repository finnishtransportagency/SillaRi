import React, { useState } from "react";
import { IonCol, IonRow, IonSpinner } from "@ionic/react";
import { onlineManager, useIsMutating } from "react-query";
import moment from "moment";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import ImagePreview from "./ImagePreview";
import ImageThumbnail from "./ImageThumbnail";
import { DATE_TIME_FORMAT } from "../utils/constants";
import "./ImageThumbnailRow.css";
import { image } from "ionicons/icons";

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
  const isImageUploadMutating = images && images.length > 0 && useIsMutating(["imageUpload" + images[0].supervisionId]);

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
          .map((image, index) => {
            const key = `image_${index}`;

            return (
              <IonCol key={key} size="3">
                <ImageThumbnail image={image} className="imageThumbnail" showImage={(imageUrl) => showImage(true, imageUrl)} />
              </IonCol>
            );
          })}

      <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />
    </IonRow>
  );
};

export default ImageThumbnailRow;
