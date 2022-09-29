import React, { useState } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./OwnListAddModal.css";
import PermitNumberInputs from "./PermitNumberInputs";
import SelectRouteInputs from "./SelectRouteInputs";
import close from "../../theme/icons/close_large_white.svg";
import IRoute from "../../interfaces/IRoute";

interface OwnListAddModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const OwnListAddModal = ({ isOpen, closeModal }: OwnListAddModalProps): JSX.Element => {
  const { t } = useTranslation();
  const [permitRoutes, setPermitRoutes] = useState<Array<{ permitNumber: string; routes: Array<IRoute> }>>([]);

  const cancel = () => {
    setPermitRoutes([]);
    closeModal();
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
        {permitRoutes.length > 0 ? (
          <SelectRouteInputs permitRoutes={permitRoutes} cancel={cancel} />
        ) : (
          <PermitNumberInputs cancel={cancel} setRoutes={setPermitRoutes} />
        )}
      </IonContent>
    </IonModal>
  );
};

export default OwnListAddModal;
