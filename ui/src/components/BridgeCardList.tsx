import React from "react";
import "./RouteCardList.css";
import BridgeCard from "./BridgeCard";
import IRouteBridge from "../interfaces/IRouteBridge";

interface BridgeCardListProps {
  routeBridges: IRouteBridge[];
}

const BridgeCardList = ({ routeBridges }: BridgeCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
      {routeBridges.map((bridge, index) => {
        const key = `bridge_${index}`;
        return <BridgeCard key={key} routeBridge={bridge} />;
      })}
    </div>
  );
};

export default BridgeCardList;
