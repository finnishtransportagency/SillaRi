import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import BridgeCard from "./BridgeCard";
import ISupervision from "../interfaces/ISupervision";
import { SupervisionListType } from "../utils/constants";

interface BridgeCardListProps {
  supervisions: ISupervision[];
}

const BridgeCardList = ({ supervisions }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();
  const supervisionListType = SupervisionListType.TRANSPORT;

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>
          <IonLabel>{t("route.bridgesToSupervise").toUpperCase()}</IonLabel>
        </IonLabel>
      </IonItem>

      <div className="listContainer">
        {supervisions.map((supervision, index) => {
          const key = `bridge_${index}`;
          return <BridgeCard key={key} supervision={supervision} supervisionListType={supervisionListType} />;
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
