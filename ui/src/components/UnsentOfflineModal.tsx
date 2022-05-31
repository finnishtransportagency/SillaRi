import React from "react";
import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import close from "../theme/icons/close_large_white.svg";
import infoOutline from "../theme/icons/info-outline.svg";
import outgoing from "../theme/icons/outgoing_white_no_badge.svg";
import "./UnsentOfflineModal.css";

interface UnsentOfflineModalProps {
  isUnsentOfflineOpen: boolean;
  setUnsentOfflineOpen: (isOpen: boolean) => void;
  setSendingListOpen: (isOpen: boolean) => void;
}

const UnsentOfflineModal = ({ isUnsentOfflineOpen, setUnsentOfflineOpen, setSendingListOpen }: UnsentOfflineModalProps): JSX.Element => {
  const { t } = useTranslation();

  const showSendingList = () => {
    setUnsentOfflineOpen(false);
    setSendingListOpen(true);
  };

  return (
    <IonModal isOpen={isUnsentOfflineOpen} onDidDismiss={() => setUnsentOfflineOpen(false)} className="unsentOfflineModal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("unsentOffline.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setUnsentOfflineOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="unsentOfflineGrid ion-padding">
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("unsentOffline.notice")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("unsentOffline.question")}</IonText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton color="primary" expand="block" size="large" onClick={showSendingList}>
                <IonIcon slot="start" icon={outgoing} />
                <IonText>{t("unsentOffline.goToSendingList")}</IonText>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton color="secondary" expand="block" size="large" onClick={() => setUnsentOfflineOpen(false)}>
                <IonText>{t("unsentOffline.continueToMain")}</IonText>
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow className="ion-align-items-center">
            <IonCol size="auto">
              <IonIcon className="otherIcon" icon={infoOutline} />
            </IonCol>
            <IonCol>
              <IonText>{t("unsentOffline.info")}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default UnsentOfflineModal;
