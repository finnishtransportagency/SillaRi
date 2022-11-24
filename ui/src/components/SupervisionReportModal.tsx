import React from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import "./SentSupervisionReportsAccordion.css";
import { useTranslation } from "react-i18next";
import ISupervision from "../interfaces/ISupervision";
import close from "../theme/icons/close_large_white.svg";
import SupervisionHeader from "./SupervisionHeader";
import SupervisionPhotos from "./SupervisionPhotos";
import SupervisionObservationsSummary from "./SupervisionObservationsSummary";

interface SupervisionReportModalProps {
  isOpen: boolean;
  supervision: ISupervision;
  closeModal: () => void;
}

const SupervisionReportModal = ({ isOpen, supervision, closeModal }: SupervisionReportModalProps): JSX.Element => {
  const { t } = useTranslation();

  const { report, images = [] } = supervision || {};

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("supervision.summary.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal()}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SupervisionHeader supervision={supervision as ISupervision} />
        <SupervisionPhotos images={images} headingKey="supervision.photos" disabled={true} supervisionId={supervision ? supervision.id : -1} />
        <SupervisionObservationsSummary report={report} />
      </IonContent>
    </IonModal>
  );
};

export default SupervisionReportModal;
