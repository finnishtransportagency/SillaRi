import React, { useState } from "react";
import { IonCol, IonImg, IonItem, IonRow, IonThumbnail } from "@ionic/react";
import moment from "moment";
import IFile from "../interfaces/IFile";
import IImageItem from "../interfaces/IImageItem";
import { getOrigin } from "../utils/request";
import ImagePreview from "./ImagePreview";

interface ImageThumbnailRowProps {
  images: IImageItem[];
  crossingImages: IFile[];
}

const ImageThumbnailRow = ({ images, crossingImages }: ImageThumbnailRowProps): JSX.Element => {
  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonRow>
      {images.length > 0 &&
        [...images]
          .sort((a, b) => {
            const am = moment(a.date);
            const bm = moment(b.date);
            return bm.diff(am, "seconds");
          })
          .map((imageItem) => {
            const imageUrl = imageItem.dataUrl;

            return (
              <IonItem key={imageItem.id}>
                <IonCol>
                  <IonThumbnail onClick={() => showImage(true, imageUrl as string)}>
                    <IonImg src={imageUrl} />
                  </IonThumbnail>
                </IonCol>
              </IonItem>
            );
          })}

      {crossingImages.length > 0 &&
        [...crossingImages]
          .sort((a, b) => {
            const am = moment(a.taken);
            const bm = moment(b.taken);
            return bm.diff(am, "seconds");
          })
          .map((crossingImage) => {
            const imageUrl = `${getOrigin()}/api/images/get?objectKey=${crossingImage.objectKey}`;

            return (
              <IonItem key={crossingImage.id}>
                <IonCol>
                  <IonThumbnail onClick={() => showImage(true, imageUrl)}>
                    <IonImg src={imageUrl} />
                  </IonThumbnail>
                </IonCol>
              </IonItem>
            );
          })}

      <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />
    </IonRow>
  );
};

export default ImageThumbnailRow;
