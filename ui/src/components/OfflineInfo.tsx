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
import moment from "moment";
import close from "../theme/icons/close_large_white.svg";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./OfflineInfo.css";

interface OfflineInfoProps {
  lastUpdated: Date;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const OfflineInfo = ({ lastUpdated, isOpen, setOpen }: OfflineInfoProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)} className="offlineInfoModal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("offlineInfo.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="offlineInfoGrid ion-padding">
          <IonRow>
            <IonCol>
              <IonText>{`${t("offlineInfo.info1")} `}</IonText>
              <IonText className="headingText">{moment(lastUpdated).format(DATE_TIME_FORMAT_MIN)}</IonText>
              <IonText>.</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("offlineInfo.info2")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("offlineInfo.info3")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonText className="linkText" onClick={() => setOpen(false)}>
                {t("common.buttons.close")}
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default OfflineInfo;
