import React, { useState } from "react";
import { IonButton, IonContent, IonFab, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonThumbnail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Plugins, CameraSource, CameraResultType } from "@capacitor/core";
import Moment from "react-moment";
import { camera, trash } from "ionicons/icons";
import { useDispatch } from "react-redux";
import { RootState, useTypedSelector } from "../store/store";
import IImageItem from "../interfaces/IImageItem";
import { actions as crossingActions } from "../store/crossingsSlice";

const CameraContainer: React.FC = () => {
  const { t } = useTranslation();
  const { Camera } = Plugins;
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const company = crossingProps.Companies[crossingProps.selectedCompany];
  const authorization = company.authorizations[crossingProps.selectedAuthorization];
  const transportRoute = authorization.routes[crossingProps.selectedRoute];
  const crossing = transportRoute.crossings[crossingProps.selectedCrossing];
  const dispatch = useDispatch();
  if (crossing.images === undefined) {
    crossing.images = [];
  }

  // const [imageItems, setImageItems] = useState<IImageItem[]>([]);

  const TakePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });
      const now = new Date();
      const fname = crossing.images.length;
      dispatch({
        type: crossingActions.SAVE_IMAGES,
        payload: [...crossing.images, { id: crossing.images.length, filename: fname, dataUrl: image.dataUrl, date: now }],
      });
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const RemoveImageItem = (index: number) => {
    crossing.images.splice(index, 1);
    dispatch({ type: crossingActions.SAVE_IMAGES, payload: crossing.images });
  };

  return (
    <IonContent>
      <IonListHeader>
        <IonLabel>
          {t("camera.listLabel")} ({crossing.images.length} {t("camera.listLabelPcs")})
        </IonLabel>
      </IonListHeader>
      <IonList>
        {crossing.images.map((imageItem, i) => (
          <IonItem key={imageItem.dataUrl}>
            <IonThumbnail slot="start">
              <IonImg src={imageItem.dataUrl} />
            </IonThumbnail>
            <IonLabel>
              <Moment format="DD.MM.YYYY HH:mm:ss">{imageItem.date.toString()}</Moment>
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
