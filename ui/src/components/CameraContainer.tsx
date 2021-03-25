import React, { useState } from "react";
import { IonButton, IonContent, IonFab, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonThumbnail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Plugins, CameraSource, CameraResultType } from "@capacitor/core";
import Moment from "react-moment";
import { camera, trash } from "ionicons/icons";
import { dateTimeFormat } from "../utils/constants";

export interface ImageItem {
  dataUrl: string | undefined;
  date: Date;
}

const CameraContainer: React.FC = () => {
  const { t } = useTranslation();
  const { Camera } = Plugins;

  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const TakePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });
      setImageItems([...imageItems, { dataUrl: image.dataUrl, date: new Date() }]);
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const RemoveImageItem = (index: number) => {
    imageItems.splice(index, 1);
    setImageItems([...imageItems]);
  };

  return (
    <IonContent>
      <IonListHeader>
        <IonLabel>
          {t("camera.listLabel")} ({imageItems.length} {t("camera.listLabelPcs")})
        </IonLabel>
      </IonListHeader>
      <IonList>
        {imageItems.map((imageItem, i) => (
          <IonItem key={imageItem.dataUrl}>
            <IonThumbnail slot="start">
              <IonImg src={imageItem.dataUrl} />
            </IonThumbnail>
            <IonLabel>
              <Moment format={dateTimeFormat}>{imageItem.date.toString()}</Moment>
            </IonLabel>
            <IonButton slot="end" onClick={() => RemoveImageItem(i)}>
              <IonIcon icon={trash} slot="start" />
              {t("camera.item.deleteButtonLabel")}
            </IonButton>
          </IonItem>
        ))}
      </IonList>
      <IonFab slot="fixed" horizontal="end" vertical="bottom">
        <IonButton expand="block" shape="round" size="large" onClick={() => TakePicture()}>
          <IonIcon icon={camera} slot="start" />
          {t("camera.takePhotoButtonLabel")}
        </IonButton>
      </IonFab>
    </IonContent>
  );
};

export default CameraContainer;
