import React from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import "./SentSupervisionReportsAccordion.css";
import { useTranslation } from "react-i18next";
import close from "../theme/icons/close_large_white.svg";

interface OwnListAddModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const OwnListAddModal = ({ isOpen, closeModal }: OwnListAddModalProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("supervisionOwnList.addModal.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal()}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>TODO: Lupien lisäys</IonContent>
    </IonModal>
  );
};

export default OwnListAddModal;
