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
  const [supervisions, setSupervisions] = useState<Array<ISupervision>>([]);

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

  console.log(ownListIds);
  const supervisions2: Array<ISupervision> = [];
  ownListIds.forEach((id) => {
    console.log(id);
    const { data: supervision } = useQuery(["getSupervision", id], () => getSupervisionNoPasscode(id, dispatch), {
      retry: onRetry,
    });
    if (supervision) {
      supervisions2.push(supervision);
    }
  });
  setSupervisions(supervisions.concat(supervisions2));

  console.log(supervisions);

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
