import React from "react";
import { IonButton, IonContent, IonFab, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonThumbnail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import Moment from "react-moment";
import { camera, trash } from "ionicons/icons";
import { useDispatch } from "react-redux";
import { RootState, useTypedSelector } from "../store/store";
import { actions as crossingActions } from "../store/crossingsSlice";
import { dateTimeFormat } from "../utils/constants";

const CameraContainer: React.FC = () => {
  const { t } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const dispatch = useDispatch();
  const { images } = crossingProps;

  const TakePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });
      const now = new Date();
      const fname = `image_${images.length + 1}`;
      dispatch({
        type: crossingActions.SAVE_IMAGES,
        payload: [...images, { id: images.length, filename: fname, dataUrl: image.dataUrl, date: now }],
      });
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const RemoveImageItem = (index: number) => {
    // Use a copy of the array to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
    const imagesToEdit = [...images];
    imagesToEdit.splice(index, 1);
    dispatch({ type: crossingActions.SAVE_IMAGES, payload: imagesToEdit });
  };

  return (
    <IonContent>
      <IonListHeader>
        <IonLabel>
          {t("camera.listLabel")} ({images.length} {t("camera.listLabelPcs")})
        </IonLabel>
      </IonListHeader>
      <IonList>
        {images.map((imageItem, i) => (
          <IonItem key={imageItem.dataUrl}>
            <IonThumbnail slot="start">
              <IonImg src={imageItem.dataUrl} />
            </IonThumbnail>
            <IonLabel>
              <Moment format={dateTimeFormat}>{imageItem.date}</Moment>
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
