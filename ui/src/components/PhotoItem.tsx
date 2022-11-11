import React from "react";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import Moment from "react-moment";
import { useTranslation } from "react-i18next";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import { DATE_TIME_FORMAT } from "../utils/constants";
import erase from "../theme/icons/erase.svg";
import ImageThumbnail from "./ImageThumbnail";
import "./PhotoItem.css";

interface PhotoItemProps {
  image: ISupervisionImage;
  taken: Date;
  isLoading: boolean;
  showImage: (imageUrl?: string) => void;
  removeImage: () => void;
}

const PhotoItem = ({ image, taken, isLoading, showImage, removeImage }: PhotoItemProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonItem lines="none">
      <ImageThumbnail image={image} className="photoThumbnail" slot="start" showImage={showImage} />
      <IonLabel>
        <IonLabel>
          <Moment format={DATE_TIME_FORMAT}>{taken}</Moment>
        </IonLabel>
        <IonLabel>
          <IonButton color="tertiary" size="default" disabled={isLoading} onClick={() => removeImage()}>
            <IonIcon className="otherIcon" icon={erase} slot="start" />
            {t("camera.item.deleteButtonLabel")}
          </IonButton>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default PhotoItem;
