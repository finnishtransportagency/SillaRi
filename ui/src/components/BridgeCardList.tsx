import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import BridgeCard from "./BridgeCard";

interface BridgeCardListProps {
  routeBridges: IRouteBridge[];
}

const BridgeCardList = ({ routeBridges }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>
          <IonLabel className="headingText">{t("route.bridgesToSupervise")}</IonLabel>
        </IonLabel>
      </IonItem>

      <div className="listContainer">
        {routeBridges.map((routeBridge, index) => {
          const key = `bridge_${index}`;
          return <BridgeCard key={key} routeBridge={routeBridge} />;
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
