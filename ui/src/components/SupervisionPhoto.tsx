import React from "react";
import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import Moment from "react-moment";
import { DATE_TIME_FORMAT } from "../utils/constants";
import erase from "../theme/icons/erase_white.svg";
import { useTranslation } from "react-i18next";

interface SupervisionPhotoProps {
  imageUrl: string | undefined;
  taken: Date;
  isLoading: boolean;
  showImage: () => void;
  removeImage: () => void;
}

const SupervisionPhoto = ({ imageUrl, taken, isLoading, showImage, removeImage }: SupervisionPhotoProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonItem>
      <IonThumbnail slot="start" onClick={() => showImage()}>
        <IonImg src={imageUrl} />
      </IonThumbnail>
      <IonLabel>
        <Moment format={DATE_TIME_FORMAT}>{taken}</Moment>
      </IonLabel>
      <IonButton slot="end" expand="block" size="default" disabled={isLoading} onClick={() => removeImage()}>
        <IonIcon className="otherIcon" icon={erase} slot="start" />
        {t("camera.item.deleteButtonLabel")}
      </IonButton>
    </IonItem>
  );
};

export default SupervisionPhoto;
