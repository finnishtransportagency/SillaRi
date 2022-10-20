import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import NoNetworkNoData from "../NoNetworkNoData";
import OwnListAddModal from "./OwnListAddModal";
import { useTranslation } from "react-i18next";
import { getOwnlist } from "../../utils/ownlistStorageUtil";

interface OwnListProps {
  username: string;
  noNetworkNoData: boolean;
  isOnline: boolean;
}

const OwnList = ({ username, noNetworkNoData, isOnline }: OwnListProps): JSX.Element => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("E.F.F.E.C.T");
  });

  const ownList = getOwnlist(username);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              <IonButton onClick={() => setModalOpen(true)}>{t("supervisionOwnList.addButtonLabel")}</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <OwnListAddModal isOpen={isModalOpen} closeModal={closeModal} />
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default OwnList;
