import React from "react";
import {useTranslation} from "react-i18next";
import {IonCol, IonGrid, IonRow, IonText} from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";
import BridgeCard from "./BridgeCard";
import "./RouteCardList.css";

interface BridgeCardListProps {
  routeBridges: IRouteBridge[];
}

const BridgeCardList = ({ routeBridges }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className="headingText">{t("route.bridgesToSupervise")}</IonText>
          </IonCol>
        </IonRow>
      </IonGrid>

      <div className="cardListContainer">
        {routeBridges.map((routeBridge, index) => {
          const key = `bridge_${index}`;
          return <BridgeCard key={key} routeBridge={routeBridge} supervision={routeBridge.supervision} />;
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
