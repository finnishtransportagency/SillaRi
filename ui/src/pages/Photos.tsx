import React, { useState } from "react";
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonList, IonPage, IonRow } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Camera, CameraSource, CameraResultType, CameraDirection } from "@capacitor/camera";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import camera from "../theme/icons/camera_white.svg";
import { onRetry } from "../utils/backendData";
import { deleteImage, getSupervision, sendImageUpload } from "../utils/supervisionBackendData";
import { DATE_TIME_FORMAT } from "../utils/constants";
import ImagePreview from "../components/ImagePreview";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import Header from "../components/Header";
import PhotoItem from "../components/PhotoItem";

interface PhotosProps {
  supervisionId: string;
}

const Photos = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<PhotosProps>();
  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const [images, setImages] = useState<ISupervisionImage[]>([]);
  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    supervisionQueryKey,
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );
  const { images: savedImages = [] } = supervision || {};

  // Set-up mutations for modifying data later
  // This mutationKey is used in ImageThumbnailRow to check if images are being uploaded
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const imageUploadMutation = useMutation((fileUpload: ISupervisionImage) => sendImageUpload(fileUpload, dispatch), {
    mutationKey: "imageUpload",
    retry: onRetry,
    onMutate: async (newData: ISupervisionImage) => {
      // onMutate fires before the mutation function

      // Cancel any outgoing refetches so they don't overwrite the optimistic update below
      await queryClient.cancelQueries(supervisionQueryKey);

      // Optimistically update by adding the new image
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
        return {
          ...oldData,
          images: [...(oldData && oldData.images ? oldData.images : []), newData],
        } as ISupervision;
      });
    },
    onSuccess: () => {
      // onSuccess doesn't fire when offline due to the retry option, but should fire when online again
      queryClient.invalidateQueries(supervisionQueryKey);
    },
  });
  const { isLoading: isSendingImageUpload } = imageUploadMutation;

  const imageDeleteMutation = useMutation((id: number) => deleteImage(id, dispatch), {
    retry: onRetry,
    onMutate: async (idToDelete: number) => {
      // onMutate fires before the mutation function

      // Cancel any outgoing refetches so they don't overwrite the optimistic update below
      await queryClient.cancelQueries(supervisionQueryKey);

      // Optimistically update by removing the old image
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
        return {
          ...oldData,
          images: (oldData && oldData.images ? oldData.images : []).reduce(
            (acc: ISupervisionImage[], image) => (image.id === idToDelete ? acc : [...acc, image]),
            []
          ),
        } as ISupervision;
      });
    },
    onSuccess: () => {
      // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

      // Fetch the supervision data again to update the image list after the delete has finished
      queryClient.invalidateQueries(supervisionQueryKey);
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
        direction: CameraDirection.Rear,
        resultType: CameraResultType.DataUrl,
      });
      const now = new Date();
      const uuid = uuidv4();
      const fname = `image_${uuid}.${image.format}`;

      const newImage: ISupervisionImage = {
        id: now.getTime(),
        supervisionId: Number(supervisionId),
        objectKey: "",
        filename: fname,
        base64: image.dataUrl,
        taken: moment(now).format(DATE_TIME_FORMAT),
      };
      setImages([...images, newImage]);
    } catch (err) {
      console.log("TakePicture REJECTED:");
      console.log(err);
    }
  };

  const removeImageItem = (id: number) => {
    const imagesToEdit = images.filter((image) => image.id !== id);
    setImages(imagesToEdit);
  };

  const deleteImageObject = (id: number) => {
    const { isLoading: isDeletingImage } = imageDeleteMutation;
    if (!isDeletingImage) {
      imageDeleteMutation.mutate(id);
    }
  };

  const saveImages = (): void => {
    images.forEach((image) => {
      // Set the image id to -1 so the backend doesn't throw an error
      const fileUpload = { ...image, id: -1 };
      imageUploadMutation.mutate(fileUpload);
    });

    history.goBack();
  };

  // Sort using copies of the arrays to avoid the error "TypeError: Cannot delete property '0' of [object Array]"
  return (
    <IonPage>
      <Header title={t("supervision.photos")} confirmGoBack={saveImages} includeOfflineBanner />
      <IonContent>
        <IonList>
          {images &&
            images.length > 0 &&
            [...images]
              .sort((a, b) => {
                const am = moment(a.taken, DATE_TIME_FORMAT);
                const bm = moment(b.taken, DATE_TIME_FORMAT);
                return bm.diff(am, "seconds");
              })
              .map((imageItem) => {
                const deleteClicked = (): void => removeImageItem(imageItem.id);
                const key = `image_${imageItem.id}`;

                return (
                  <PhotoItem
                    key={key}
                    image={imageItem}
                    taken={moment(imageItem.taken, DATE_TIME_FORMAT).toDate()}
                    isLoading={isLoading}
                    showImage={(imageUrl) => showImage(true, imageUrl)}
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
                const deleteClicked = (): void => deleteImageObject(supervisionImage.id);
                const key = `savedimage_${supervisionImage.id}`;

                return (
                  <PhotoItem
                    key={key}
                    image={supervisionImage}
                    taken={moment(supervisionImage.taken, DATE_TIME_FORMAT).toDate()}
                    isLoading={isLoading}
                    showImage={(imageUrl) => showImage(true, imageUrl)}
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
