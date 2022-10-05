import React, { useState } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./OwnListAddModal.css";
import PermitNumberInputs from "./PermitNumberInputs";
import SelectRouteInputs from "./SelectRouteInputs";
import close from "../../theme/icons/close_large_white.svg";
import OwnListPermitRouteType from "./OwnListPermitRouteType";

interface OwnListAddModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const OwnListAddModal = ({ isOpen, closeModal }: OwnListAddModalProps): JSX.Element => {
  const { t } = useTranslation();
  const [permitRoutes, setPermitRoutes] = useState<Array<OwnListPermitRouteType>>([]);
  const [phase, setPhase] = useState<"PERMIT" | "ROUTE" | "BRIDGE">("PERMIT");

  const cancel = () => {
    setPermitRoutes([]);
    closeModal();
  };

  const phasePermitToRoute = (prs: Array<OwnListPermitRouteType>) => {
    setPermitRoutes(prs);
    setPhase("ROUTE");
  };

  const phaseRouteToPermit = () => {
    setPhase("PERMIT");
  };

  const phaseRouteToBridge = (prs: Array<OwnListPermitRouteType>) => {
    setPermitRoutes(prs);
    setPhase("BRIDGE");
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={cancel}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("supervisionOwnList.addModal.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={cancel}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {phase === "PERMIT" ? (
          <PermitNumberInputs cancel={cancel} permitRoutes={permitRoutes} toNextPhase={phasePermitToRoute} />
        ) : (
          <SelectRouteInputs permitRoutes={permitRoutes} toPreviousPhase={phaseRouteToPermit} toNextPhase={phaseRouteToBridge} />
        )}
      </IonContent>
    </IonModal>
  );
};

export default OwnListAddModal;
