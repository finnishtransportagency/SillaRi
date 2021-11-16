import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow } from "@ionic/react";
import camera from "../theme/icons/camera_white.svg";
import lane from "../theme/icons/lane_white.svg";
import ImageThumbnailRow from "./ImageThumbnailRow";
import ISupervisionImage from "../interfaces/ISupervisionImage";

interface SupervisionPhotosProps {
  images: ISupervisionImage[];
  headingKey: string;
  disabled: boolean;
  isButtonsIncluded?: boolean;
  takePhotos?: () => void;
}

const SupervisionPhotos = ({ images = [], headingKey, disabled, isButtonsIncluded, takePhotos }: SupervisionPhotosProps): JSX.Element => {
  const { t } = useTranslation();

  const takePhotosClicked = (): void => {
    if (takePhotos !== undefined) {
      takePhotos();
    }
  };

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>{t(headingKey).toUpperCase()}</IonLabel>
      </IonItem>

      <IonGrid>
        <ImageThumbnailRow images={images} />
      </IonGrid>

      {isButtonsIncluded && (
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="secondary" expand="block" size="large" disabled={disabled} onClick={() => takePhotosClicked()}>
                <IonIcon className="otherIcon" icon={camera} color="primary" slot="start" />
                {t("supervision.buttons.takePhotos")}
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="secondary" expand="block" size="large" disabled>
                <IonIcon className="otherIcon" icon={lane} color="primary" slot="start" />
                {t("supervision.buttons.drivingLine")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </>
  );
};

SupervisionPhotos.defaultProps = {
  isButtonsIncluded: false,
};

export default SupervisionPhotos;
