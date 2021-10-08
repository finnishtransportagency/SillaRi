import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import BridgeCard from "./BridgeCard";
import "./BridgeCardList.css";

interface BridgeCardListProps {
  routeBridges: IRouteBridge[];
}

const BridgeCardList = ({ routeBridges }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <IonItem className="bridgeListHeader" lines="none">
        <IonLabel>
          <IonLabel className="headingText">{t("route.bridgesToSupervise")}</IonLabel>
        </IonLabel>
      </IonItem>

      <div className="cardListContainer">
        {routeBridges.map((bridge, index) => {
          const key = `bridge_${index}`;
          return <BridgeCard key={key} routeBridge={bridge} />;
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
