import React, { Dispatch, SetStateAction, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
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
import help from "../../theme/icons/help.svg";
import InfoPopover from "../common/InfoPopover";

interface TransportCountModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  permit: IPermit;
  routeTransports: IRouteTransport[];
}

const TransportCountModal = ({ isOpen, setOpen, permit, routeTransports = [] }: TransportCountModalProps): JSX.Element => {
  const { t } = useTranslation();
  const [countInfoPopoverOpen, setCountInfoPopoverOpen] = useState<boolean>(false);
  const [amountInfoPopoverOpen, setAmountInfoPopoverOpen] = useState<boolean>(false);

  const countInfoTriggerId = "countInfoPopoverTrigger";
  const amountInfoTriggerId = "amountInfoPopoverTrigger";

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
          <IonTitle className="headingText">
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
          <IonRow className="lightBackground ion-justify-content-between">
            <IonCol size="5">
              <IonItem lines="none" color="light">
                {t("management.companySummary.route.route").toUpperCase()}
              </IonItem>
            </IonCol>
            <IonCol size="3">
              {permitIncludesMultipleVersionsForSomeRoute ? (
                <IonItem
                  id={countInfoTriggerId}
                  lines="none"
                  color="light"
                  className="itemIcon iconLink"
                  detail
                  detailIcon={help}
                  onClick={() => setCountInfoPopoverOpen(true)}
                >
                  <IonLabel>
                    <IonText>{t("management.companySummary.transportCountModal.used").toUpperCase()}</IonText>
                  </IonLabel>
                </IonItem>
              ) : (
                <IonItem lines="none" color="light">
                  {t("management.companySummary.transportCountModal.used").toUpperCase()}
                </IonItem>
              )}
            </IonCol>
            <IonCol size="4">
              <IonItem
                id={amountInfoTriggerId}
                lines="none"
                color="light"
                className="itemIcon iconLink"
                detail
                detailIcon={help}
                onClick={() => setAmountInfoPopoverOpen(true)}
              >
                <IonLabel>
                  <IonText>{t("management.companySummary.transportCountModal.amount").toUpperCase()}</IonText>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          {routes
            .sort((a, b) => {
              return a.ordinal - b.ordinal;
            })
            .map((route) => {
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

              const totalTransportCount =
                transports.length > 0 && usedRouteTransportNumbersFromOtherVersions.length > 0
                  ? transports.length + usedRouteTransportNumbersFromOtherVersions.length
                  : transports.length || usedRouteTransportNumbersFromOtherVersions.length;

              return (
                <IonRow key={key}>
                  <IonCol size="5" className="ion-padding-start ion-padding-top ion-padding-bottom">
                    {name}
                  </IonCol>
                  <IonCol size="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
                    <IonText>{totalTransportCount}</IonText>
                    {usedRouteTransportNumbersFromOtherVersions.length > 0 && (
                      <IonText>{` (${transports.length} + ${usedRouteTransportNumbersFromOtherVersions.length})`}</IonText>
                    )}
                  </IonCol>
                  <IonCol size="4" className="ion-padding-start ion-padding-top ion-padding-bottom">
                    {transportCount !== 0 ? transportCount : t("management.companySummary.transportCountModal.unlimited")}
                  </IonCol>
                </IonRow>
              );
            })}
        </IonGrid>
        <InfoPopover
          triggerId={countInfoTriggerId}
          title={t("management.companySummary.transportCountModal.used")}
          text={t("management.companySummary.transportCountModal.usedInfo")}
          isOpen={countInfoPopoverOpen}
          setOpen={setCountInfoPopoverOpen}
        />
        <InfoPopover
          triggerId={amountInfoTriggerId}
          title={t("management.companySummary.transportCountModal.amount")}
          text={t("management.companySummary.transportCountModal.amountInfo")}
          isOpen={amountInfoPopoverOpen}
          setOpen={setAmountInfoPopoverOpen}
        />
      </IonContent>
    </IonModal>
  );
};

export default TransportCountModal;
