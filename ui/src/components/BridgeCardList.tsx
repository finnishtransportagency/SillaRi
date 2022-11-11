import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import BridgeCard from "./BridgeCard";
import ISupervision from "../interfaces/ISupervision";
import { SupervisionListType } from "../utils/constants";
import IRouteTransport from "../interfaces/IRouteTransport";

interface BridgeCardListProps {
  username: string;
  routeTransport: IRouteTransport;
  supervisions: ISupervision[];
  isOnline: boolean;
}

const BridgeCardList = ({ username, routeTransport, supervisions, isOnline }: BridgeCardListProps): JSX.Element => {
  const { t } = useTranslation();
  const supervisionListType = SupervisionListType.TRANSPORT;
  const count = supervisions.length;

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>
          <IonLabel>{`${t("route.bridgesToSupervise").toUpperCase()} (${count})`}</IonLabel>
        </IonLabel>
      </IonItem>

      <div className="listContainer">
        {supervisions.map((supervision, index) => {
          const key = `bridge_${index}`;
          return (
            <BridgeCard
              key={key}
              username={username}
              routeTransport={routeTransport}
              supervision={supervision}
              supervisionListType={supervisionListType}
              isOnline={isOnline}
            />
          );
        })}
      </div>
    </>
  );
};

export default BridgeCardList;
