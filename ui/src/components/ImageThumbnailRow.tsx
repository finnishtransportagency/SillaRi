import React, { useState } from "react";
import { IonCol, IonImg, IonRow, IonThumbnail } from "@ionic/react";
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

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonRow>
      {images &&
        images.length > 0 &&
        [...images]
          .sort((a, b) => {
            const am = moment(a.taken, DATE_TIME_FORMAT);
            const bm = moment(b.taken, DATE_TIME_FORMAT);
            return bm.diff(am, "seconds");
          })
          .map((image) => {
            const imageUrl = `${getOrigin()}/api/images/get?id=${image.id}`;

            return (
              <IonCol key={image.id} size="3">
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
