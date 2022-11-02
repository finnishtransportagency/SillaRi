import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import NoNetworkNoData from "../NoNetworkNoData";
import OwnListAddModal from "./OwnListAddModal";
import { useTranslation } from "react-i18next";
import { removeFromOwnlist, getOwnlist } from "../../utils/ownlistStorageUtil";
import OwnListItem from "./OwnListItem";

interface OwnListProps {
  username: string;
  noNetworkNoData: boolean;
  isOnline: boolean;
}

const OwnList = ({ username, noNetworkNoData, isOnline }: OwnListProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [ownListIds, setOwnListIds] = useState<Array<number>>([]);

  const updateListFromStorage = () => {
    getOwnlist(username, dispatch).then((result) => {
      if (result) {
        setOwnListIds(result);
      }
    });
  };

  useEffect(() => {
    getOwnlist(username, dispatch).then((result) => {
      if (result) {
        setOwnListIds(result);
      }
    });
  }, [isModalOpen, username]);

  const removeItem = (supervisionId: number | undefined) => {
    removeFromOwnlist(username, supervisionId, dispatch).then(() =>
      getOwnlist(username, dispatch).then((result) => {
        if (result) {
          console.log(result);
          setOwnListIds(result);
        }
      })
    );
  };

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
              <IonButton disabled={!isOnline} onClick={() => setModalOpen(true)}>
                {t("supervisionOwnList.addButtonLabel")}
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <OwnListAddModal isOpen={isModalOpen} closeModal={closeModal} updateOwnlistPage={updateListFromStorage} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {ownListIds.map((id: number, dIndex) => {
                const bridgeKey = `bridge_${dIndex}`;
                return <OwnListItem key={bridgeKey} supervisionId={id} removalCallback={removeItem}></OwnListItem>;
              })}
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default OwnList;
