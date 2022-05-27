import React, { Dispatch, SetStateAction } from "react";
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
import { useTranslation } from "react-i18next";
import close from "../../theme/icons/close.svg";
import IPermit from "../../interfaces/IPermit";
import "./TransportCountModal.css";
import IRouteTransport from "../../interfaces/IRouteTransport";

interface TransportCountModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  permit: IPermit;
  routeTransports: IRouteTransport[];
}

const TransportCountModal = ({ isOpen, setOpen, permit, routeTransports = [] }: TransportCountModalProps): JSX.Element => {
  const { t } = useTranslation();

  const { permitNumber, routes = [] } = permit;

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle class="headingText">
            <IonText>{t("management.companySummary.transportCountModal.countByRoute")}</IonText>
          </IonTitle>
          <IonText slot="end">{`${t("management.companySummary.transportCountModal.permit")}: ${permitNumber}`}</IonText>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal()}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="transportCountGrid ion-margin ion-no-padding">
          <IonRow className="lightBackground ion-padding ion-justify-content-between">
            <IonCol size="6">{t("management.companySummary.route.route").toUpperCase()}</IonCol>
            <IonCol>{t("management.companySummary.transportCountModal.used").toUpperCase()}</IonCol>
            <IonCol>{t("management.companySummary.transportCountModal.amount").toUpperCase()}</IonCol>
          </IonRow>
          {routes.map((route) => {
            const { id, name = "", transportCount = 0 } = route || {};
            const key = `route_${id}`;
            const transports = routeTransports
              ? routeTransports.filter((transport) => {
                  const { route: transportRoute } = transport || {};
                  const { id: routeId = -1 } = transportRoute || {};
                  return id === routeId;
                })
              : [];

            return (
              <IonRow key={key} className="ion-padding">
                <IonCol size="6">{name}</IonCol>
                <IonCol>{transports.length}</IonCol>
                <IonCol>{transportCount !== 0 ? transportCount : t("management.companySummary.transportCountModal.unlimited")}</IonCol>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default TransportCountModal;
