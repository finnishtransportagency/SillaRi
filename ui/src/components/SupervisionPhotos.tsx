import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonItem, IonLabel, IonRow } from "@ionic/react";
import { document } from "ionicons/icons";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import ImageThumbnailRow from "./ImageThumbnailRow";

interface SupervisionPhotosProps {
  supervision: ISupervision;
  headingKey: string;
  isButtonsIncluded?: boolean;
}

const SupervisionPhotos = ({ supervision, headingKey, isButtonsIncluded }: SupervisionPhotosProps): JSX.Element => {
  const { t } = useTranslation();

  const { images = [] } = useTypedSelector((state) => state.supervisionReducer);
  const { id: supervisionId, images: supervisionImages = [] } = supervision || {};

  return (
    <>
      <IonItem className="header" detailIcon={document} lines="none">
        <IonLabel className="headingText">{t(headingKey)}</IonLabel>
      </IonItem>

      <IonGrid>
        <ImageThumbnailRow images={images} supervisionImages={supervisionImages} />
      </IonGrid>

      {isButtonsIncluded && (
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="tertiary" routerLink={`/takephotos/${supervisionId}`}>
                {t("supervision.buttons.takePhotos")}
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton color="tertiary" disabled>
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
