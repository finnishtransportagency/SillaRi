import React from "react";
import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import Moment from "react-moment";
import { DATE_TIME_FORMAT } from "../utils/constants";
import erase from "../theme/icons/erase.svg";
import { useTranslation } from "react-i18next";
import "./PhotoItem.css";

interface PhotoItemProps {
  imageUrl: string | undefined;
  taken: Date;
  isLoading: boolean;
  showImage: () => void;
  removeImage: () => void;
}

const PhotoItem = ({ imageUrl, taken, isLoading, showImage, removeImage }: PhotoItemProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonItem lines="none">
      <IonThumbnail className="photoThumbnail" slot="start" onClick={() => showImage()}>
        <IonImg src={imageUrl} />
      </IonThumbnail>
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
