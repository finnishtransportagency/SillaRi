import React, { useState } from "react";
import { IonButton, IonContent, IonFab, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonThumbnail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import Moment from "react-moment";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { RootState, useTypedSelector } from "../store/store";
import { actions as supervisionActions } from "../store/supervisionSlice";
import camera from "../theme/icons/camera_white.svg";
import erase from "../theme/icons/erase_white.svg";
import { deleteImage, getSupervision, onRetry, sendImageUpload } from "../utils/supervisionBackendData";
import { DATE_TIME_FORMAT } from "../utils/constants";
import { getOrigin } from "../utils/request";
import ImagePreview from "./ImagePreview";
import ISupervisionImageInput from "../interfaces/ISupervisionImageInput";
import Header from "./Header";

interface CameraContainerProps {
  supervisionId: string;
}

const CameraContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<CameraContainerProps>();
  const { images = [] } = useTypedSelector((state: RootState) => state.supervisionReducer);

  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

  const { data: supervision } = useQuery(["getSupervision", supervisionId], () => getSupervision(Number(supervisionId), dispatch), {
    retry: onRetry,
  });
  const { images: savedImages = [] } = supervision || {};

  // Set-up mutations for modifying data later
  const imageUploadMutation = useMutation((fileUpload: ISupervisionImageInput) => sendImageUpload(fileUpload, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSupervision", supervisionId]);
    },
  });
  const { isLoading: isSendingImageUpload } = imageUploadMutation;

  const imageDeleteMutation = useMutation((objectKey: string) => deleteImage(objectKey, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // Fetch the supervision data again to update the image list after the delete has finished
      queryClient.invalidateQueries(["getSupervision", supervisionId]);
    },
  });
  const { isLoading: isSendingImageDelete } = imageDeleteMutation;

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
        type: supervisionActions.SET_IMAGES,
        payload: [...images, { id: uuid, filename: fname, dataUrl: image.dataUrl, date: now }],
      });
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const removeImageItem = (uuid: string) => {
    const imagesToEdit = images.filter((image) => image.id !== uuid);
    dispatch({ type: supervisionActions.SET_IMAGES, payload: imagesToEdit });
  };

  const deleteImageObject = (objectKey: string) => {
    const { isLoading: isDeletingImage } = imageDeleteMutation;
    if (!isDeletingImage) {
      imageDeleteMutation.mutate(objectKey);
    }
  };

  const saveImages = (): void => {
    images.forEach((image) => {
      const fileUpload = {
        supervisionId: supervisionId.toString(),
        filename: image.filename,
        base64: image.dataUrl,
        taken: moment(image.date).format(DATE_TIME_FORMAT),
      } as ISupervisionImageInput;

      imageUploadMutation.mutate(fileUpload);
    });

    history.goBack();
  };

  const allImagesAmount = (images ? images.length : 0) + (savedImages ? savedImages.length : 0);

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonPage>
      <Header title={t("main.header.title")} confirmGoBack={saveImages} />
      <IonContent fullscreen>
        <IonContent>
          <IonListHeader>
            <IonLabel>
              {t("camera.listLabel")} ({allImagesAmount} {t("camera.listLabelPcs")})
            </IonLabel>
          </IonListHeader>
          <IonList>
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
                    <IonItem key={imageItem.id}>
                      <IonThumbnail slot="start" onClick={() => showImage(true, imageUrl as string)}>
                        <IonImg src={imageUrl} />
                      </IonThumbnail>
                      <IonLabel>
                        <Moment format={DATE_TIME_FORMAT}>{imageItem.date}</Moment>
                      </IonLabel>
                      <IonButton
                        slot="end"
                        expand="block"
                        size="default"
                        disabled={isSendingImageUpload || isSendingImageDelete}
                        onClick={() => removeImageItem(imageItem.id)}
                      >
                        <IonIcon className="otherIcon" icon={erase} slot="start" />
                        {t("camera.item.deleteButtonLabel")}
                      </IonButton>
                    </IonItem>
                  );
                })}

            {savedImages &&
              savedImages.length > 0 &&
              [...savedImages]
                .sort((a, b) => {
                  const am = moment(a.taken);
                  const bm = moment(b.taken);
                  return bm.diff(am, "seconds");
                })
                .map((supervisionImage) => {
                  const imageUrl = `${getOrigin()}/api/images/get?objectKey=${supervisionImage.objectKey}`;

                  return (
                    <IonItem key={supervisionImage.id}>
                      <IonThumbnail slot="start" onClick={() => showImage(true, imageUrl)}>
                        <IonImg src={imageUrl} />
                      </IonThumbnail>
                      <IonLabel>{supervisionImage.taken}</IonLabel>
                      <IonButton
                        slot="end"
                        expand="block"
                        size="default"
                        disabled={isSendingImageUpload || isSendingImageDelete}
                        onClick={() => deleteImageObject(supervisionImage.objectKey)}
                      >
                        <IonIcon className="otherIcon" icon={erase} slot="start" />
                        {t("camera.item.deleteButtonLabel")}
                      </IonButton>
                    </IonItem>
                  );
                })}
          </IonList>

          <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />

          <IonFab slot="fixed" horizontal="end" vertical="bottom">
            <IonButton expand="block" size="large" onClick={() => takePicture()}>
              <IonIcon className="otherIcon" icon={camera} slot="start" />
              {t("camera.takePhotoButtonLabel")}
            </IonButton>
          </IonFab>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default CameraContainer;
