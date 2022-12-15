import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
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
import { getCompanyTransportsList } from "../utils/supervisionBackendData";
import "./LoggedOutInfoModal.css";

interface LoggedOutInfoModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const LoggedOutInfoModal = ({ isOpen, setOpen }: LoggedOutInfoModalProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Use the date when the main page data was updated
  const { dataUpdatedAt } = useQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
    // retry: onRetry,
    staleTime: Infinity,
  });

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)} className="loggedOutInfoModal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("loggedOutInfo.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="loggedOutInfoGrid ion-padding">
          <IonRow>
            <IonCol>
              <IonText>{`${t("loggedOutInfo.info1")} `}</IonText>
              <IonText className="headingText">{moment(dataUpdatedAt).format(DATE_TIME_FORMAT_MIN)}</IonText>
              <IonText>.</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("loggedOutInfo.info2")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("loggedOutInfo.info3")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("loggedOutInfo.info4")}</IonText>
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

export default LoggedOutInfoModal;
