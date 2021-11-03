import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow } from "@ionic/react";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { useTypedSelector } from "../store/store";
import camera from "../theme/icons/camera_white.svg";
import lane from "../theme/icons/lane_white.svg";
import ImageThumbnailRow from "./ImageThumbnailRow";

interface SupervisionPhotosProps {
  supervision: ISupervision;
  modifiedReport: ISupervisionReport | undefined;
  headingKey: string;
  isButtonsIncluded?: boolean;
}

const SupervisionPhotos = ({ supervision, modifiedReport, headingKey, isButtonsIncluded }: SupervisionPhotosProps): JSX.Element => {
  const { t } = useTranslation();

  const { images = [] } = useTypedSelector((state) => state.supervisionReducer);
  const { id: supervisionId, images: savedImages = [] } = supervision || {};
  const { draft } = modifiedReport || {};

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>{t(headingKey).toUpperCase()}</IonLabel>
      </IonItem>

      <IonGrid>
        <ImageThumbnailRow images={images} savedImages={savedImages} />
      </IonGrid>

      {isButtonsIncluded && (
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="secondary" expand="block" size="large" routerLink={`/takephotos/${supervisionId}`} disabled={!draft}>
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
