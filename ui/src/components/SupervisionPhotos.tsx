import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow } from "@ionic/react";
import ISupervision from "../interfaces/ISupervision";
import camera from "../theme/icons/camera_white.svg";
import lane from "../theme/icons/lane_white.svg";
import ImageThumbnailRow from "./ImageThumbnailRow";
import { useHistory } from "react-router-dom";

interface SupervisionPhotosProps {
  supervision: ISupervision;
  headingKey: string;
  isButtonsIncluded?: boolean;
  disabled: boolean;
}

const SupervisionPhotos = ({ supervision, headingKey, isButtonsIncluded, disabled }: SupervisionPhotosProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  const { id: supervisionId, images = [] } = supervision || {};

  const takePhotosClicked = (): void => {
    history.push(`/takephotos/${supervisionId}`);
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
