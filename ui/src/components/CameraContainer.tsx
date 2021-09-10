import React, { useState } from "react";
import { IonButton, IonContent, IonFab, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonThumbnail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import Moment from "react-moment";
import { camera, trash } from "ionicons/icons";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { RootState, useTypedSelector } from "../store/store";
import { actions as crossingActions } from "../store/crossingsSlice";
import { deleteImage, getCrossing, onRetry } from "../utils/backendData";
import { dateTimeFormat } from "../utils/constants";
import { getOrigin } from "../utils/request";
import ImagePreview from "./ImagePreview";

interface CameraContainerProps {
  crossingId: string;
}

const CameraContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { crossingId = "0" } = useParams<CameraContainerProps>();

  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

  const { selectedCrossingDetail, images = [] } = crossingProps;

  const { images: crossingImages = [] } = selectedCrossingDetail || {};

  useQuery(["getCrossing", crossingId], () => getCrossing(Number(crossingId), dispatch, selectedCrossingDetail), { retry: onRetry });

  // Set-up mutations for modifying data later
  const imageDeleteMutation = useMutation((objectKey: string) => deleteImage(objectKey, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // Fetch the crossing data again to update the image list after the delete has finished
      queryClient.invalidateQueries("getCrossing");
    },
  });

  const takePicture = async () => {
    try {
      // Use uuid in the filename to make it unique
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });
      const now = new Date();
      const uuid = uuidv4();
      const fname = `image_${uuid}.jpg`;
      dispatch({
        type: crossingActions.SAVE_IMAGES,
        payload: [...images, { id: uuid, filename: fname, dataUrl: image.dataUrl, date: now }],
      });
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const removeImageItem = (uuid: string) => {
    const imagesToEdit = images.filter((image) => image.id !== uuid);
    dispatch({ type: crossingActions.SAVE_IMAGES, payload: imagesToEdit });
  };

  const deleteImageObject = (objectKey: string) => {
    const { isLoading: isDeletingImage } = imageDeleteMutation;
    if (!isDeletingImage) {
      imageDeleteMutation.mutate(objectKey);
    }
  };

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonContent>
      <IonListHeader>
        <IonLabel>
          {t("camera.listLabel")} ({images.length + crossingImages.length} {t("camera.listLabelPcs")})
        </IonLabel>
      </IonListHeader>
      <IonList>
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
                  <IonThumbnail slot="start" onClick={() => showImage(true, imageUrl as string)}>
                    <IonImg src={imageUrl} />
                  </IonThumbnail>
                  <IonLabel>
                    <Moment format={dateTimeFormat}>{imageItem.date}</Moment>
                  </IonLabel>
                  <IonButton slot="end" onClick={() => removeImageItem(imageItem.id)}>
                    <IonIcon icon={trash} slot="start" />
                    {t("camera.item.deleteButtonLabel")}
                  </IonButton>
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
                  <IonThumbnail slot="start" onClick={() => showImage(true, imageUrl)}>
                    <IonImg src={imageUrl} />
                  </IonThumbnail>
                  <IonLabel>{crossingImage.taken}</IonLabel>
                  <IonButton slot="end" onClick={() => deleteImageObject(crossingImage.objectKey)}>
                    <IonIcon icon={trash} slot="start" />
                    {t("camera.item.deleteButtonLabel")}
                  </IonButton>
                </IonItem>
              );
            })}
      </IonList>

      <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />

      <IonFab slot="fixed" horizontal="end" vertical="bottom">
        <IonButton expand="block" shape="round" size="large" onClick={() => takePicture()}>
          <IonIcon icon={camera} slot="start" />
          {t("camera.takePhotoButtonLabel")}
        </IonButton>
      </IonFab>
    </IonContent>
  );
};

export default CameraContainer;
