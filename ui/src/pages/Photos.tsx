import React, { useState } from "react";
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonList, IonPage, IonRow } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import camera from "../theme/icons/camera_white.svg";
import { onRetry } from "../utils/backendData";
import { deleteImage, getSupervision, sendImageUpload } from "../utils/supervisionBackendData";
import { DATE_TIME_FORMAT } from "../utils/constants";
import { getOrigin } from "../utils/request";
import ImagePreview from "../components/ImagePreview";
import ISupervisionImageInput from "../interfaces/ISupervisionImageInput";
import Header from "../components/Header";
import PhotoItem from "../components/PhotoItem";
import IImageItem from "../interfaces/IImageItem";

interface PhotosProps {
  supervisionId: string;
}

const Photos = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<PhotosProps>();

  const [images, setImages] = useState<IImageItem[]>([]);
  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
    }
  );
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

  const isLoading = isLoadingSupervision || isSendingImageUpload || isSendingImageDelete;

  const showImage = (isOpen: boolean, imageUrl?: string) => {
    setImagePreviewOpen(isOpen);
    setImagePreviewUrl(imageUrl || imagePreviewUrl);
  };

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

      const newImage: IImageItem = { id: uuid, filename: fname, dataUrl: image.dataUrl, date: now };
      setImages([...images, newImage]);
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const removeImageItem = (uuid: string) => {
    const imagesToEdit = images.filter((image) => image.id !== uuid);
    setImages(imagesToEdit);
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

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonPage>
      <Header title={t("supervision.photos")} confirmGoBack={saveImages} />
      <IonContent fullscreen>
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
                const thumbnailClicked = (): void => showImage(true, imageItem.dataUrl as string);
                const deleteClicked = (): void => removeImageItem(imageItem.id);

                return (
                  <PhotoItem
                    key={imageItem.id}
                    imageUrl={imageItem.dataUrl}
                    taken={imageItem.date}
                    isLoading={isLoading}
                    showImage={thumbnailClicked}
                    removeImage={deleteClicked}
                  />
                );
              })}
          {savedImages &&
            savedImages.length > 0 &&
            [...savedImages]
              .sort((a, b) => {
                const am = moment(a.taken, DATE_TIME_FORMAT);
                const bm = moment(b.taken, DATE_TIME_FORMAT);
                return bm.diff(am, "seconds");
              })
              .map((supervisionImage) => {
                const imageUrl = `${getOrigin()}/api/images/get?objectKey=${supervisionImage.objectKey}`;
                const thumbnailClicked = (): void => showImage(true, imageUrl);
                const deleteClicked = (): void => deleteImageObject(supervisionImage.objectKey);

                return (
                  <PhotoItem
                    key={supervisionImage.id}
                    imageUrl={imageUrl}
                    taken={moment(supervisionImage.taken, DATE_TIME_FORMAT).toDate()}
                    isLoading={isLoading}
                    showImage={thumbnailClicked}
                    removeImage={deleteClicked}
                  />
                );
              })}
        </IonList>

        <ImagePreview imageUrl={imagePreviewUrl} isOpen={isImagePreviewOpen} setIsOpen={() => showImage(false)} />
      </IonContent>

      <IonFooter className="lightBackground">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="secondary" expand="block" size="large" onClick={() => takePicture()}>
                <IonIcon className="otherIcon" icon={camera} slot="start" />
                {t("camera.takePhotoButtonLabel")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default Photos;
