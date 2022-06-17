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
import IRoute from "../../interfaces/IRoute";
import IRouteTransportNumber from "../../interfaces/IRouteTransportNumber";

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

  const transportNumbersForOtherPermitVersions = (route: IRoute): IRouteTransportNumber[] => {
    const { id, routeTransportNumbers = [] } = route || {};
    // Check if list of routeTransportNumbers includes results with a different routeId than current.
    // List includes all routeTransportNumbers for routes with the same leluId and permitNumber,
    // so if the same route exists in multiple permit versions, we have multiple routeIds in the results.
    return routeTransportNumbers.filter((routeTransportNumber) => routeTransportNumber.routeId !== id);
  };

  const permitIncludesMultipleVersionsForSomeRoute = routes.some((route) => transportNumbersForOtherPermitVersions(route).length > 0);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle class="headingText">
            <IonText>{t("management.companySummary.transportCountModal.title", { permit: permitNumber })}</IonText>
          </IonTitle>
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
            <IonCol size={permitIncludesMultipleVersionsForSomeRoute ? "3" : "6"}>{t("management.companySummary.route.route").toUpperCase()}</IonCol>
            <IonCol size="3">{t("management.companySummary.transportCountModal.used").toUpperCase()}</IonCol>
            {permitIncludesMultipleVersionsForSomeRoute && (
              <IonCol>{t("management.companySummary.transportCountModal.usedFromPrevious").toUpperCase()}</IonCol>
            )}
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

            const otherVersionsForThisRoute = transportNumbersForOtherPermitVersions(route);
            const usedRouteTransportNumbersFromOtherVersions = otherVersionsForThisRoute.filter((rtn) => rtn.used);

            return (
              <IonRow key={key} className="ion-padding">
                <IonCol size={permitIncludesMultipleVersionsForSomeRoute ? "3" : "6"}>{name}</IonCol>
                <IonCol size="3">{transports.length}</IonCol>
                {permitIncludesMultipleVersionsForSomeRoute && (
                  <IonCol>{otherVersionsForThisRoute.length > 0 ? usedRouteTransportNumbersFromOtherVersions.length : ""}</IonCol>
                )}
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
