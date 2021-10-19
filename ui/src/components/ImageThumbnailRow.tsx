import React, { useState } from "react";
import { IonCol, IonImg, IonRow, IonThumbnail } from "@ionic/react";
import moment from "moment";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import IImageItem from "../interfaces/IImageItem";
import { getOrigin } from "../utils/request";
import ImagePreview from "./ImagePreview";

interface ImageThumbnailRowProps {
  images: IImageItem[];
  supervisionImages: ISupervisionImage[];
}

const ImageThumbnailRow = ({ images, supervisionImages }: ImageThumbnailRowProps): JSX.Element => {
  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonRow>
      {images &&
        images.length > 0 &&
        [...images]
          .sort((a, b) => {
            const am = moment(a.date);
            const bm = moment(b.date);
            return bm.diff(am, "seconds");
          })
          .map((imageItem) => {
            const imageUrl = imageItem.dataUrl;

            return (
              <IonCol key={imageItem.id} size="3">
                <IonThumbnail onClick={() => showImage(true, imageUrl as string)}>
                  <IonImg src={imageUrl} />
                </IonThumbnail>
              </IonCol>
            );
          })}

      {supervisionImages &&
        supervisionImages.length > 0 &&
        [...supervisionImages]
          .sort((a, b) => {
            const am = moment(a.taken);
            const bm = moment(b.taken);
            return bm.diff(am, "seconds");
          })
          .map((supervisionImage) => {
            const imageUrl = `${getOrigin()}/api/images/get?objectKey=${supervisionImage.objectKey}`;

            return (
              <IonCol key={supervisionImage.id} size="3">
                <IonThumbnail onClick={() => showImage(true, imageUrl)}>
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
