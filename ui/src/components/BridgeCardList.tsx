import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import BridgeCard from "./BridgeCard";
import ISupervision from "../interfaces/ISupervision";

interface BridgeCardListProps {
  supervisions: ISupervision[];
}

const BridgeCardList = ({ supervisions }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>
          <IonLabel className="headingText">{t("route.bridgesToSupervise")}</IonLabel>
        </IonLabel>
      </IonItem>

      <div className="listContainer">
        {supervisions.map((supervision, index) => {
          const key = `bridge_${index}`;
          return <BridgeCard key={key} supervision={supervision} />;
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
