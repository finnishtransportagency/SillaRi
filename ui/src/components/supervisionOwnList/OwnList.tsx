import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import NoNetworkNoData from "../NoNetworkNoData";
import OwnListAddModal from "./OwnListAddModal";
import { useTranslation } from "react-i18next";
import { getOwnlist } from "../../utils/ownlistStorageUtil";
import { useQuery } from "react-query";
import { getRouteTransportsOfPermit } from "../../utils/managementBackendData";
import { onRetry } from "../../utils/backendData";
import { getSupervisionNoPasscode } from "../../utils/supervisionBackendData";
import { useDispatch } from "react-redux";
import ISupervision from "../../interfaces/ISupervision";

interface OwnListProps {
  username: string;
  noNetworkNoData: boolean;
  isOnline: boolean;
}

const OwnList = ({ username, noNetworkNoData, isOnline }: OwnListProps): JSX.Element => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [ownListIds, setOwnListIds] = useState<Array<number>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("efect");
    getOwnlist(username).then((result) => {
      if (result) {
        console.log("rsult" + result);
        setOwnListIds(result);
        console.log(ownListIds);
      }
    });
  }, [isModalOpen]);



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
