import React from "react";
import "./RouteCardList.css";
import BridgeCard from "./BridgeCard";
import IBridge from "../interfaces/IBridge";

interface BridgeCardListProps {
  bridges: IBridge[];
}

const BridgeCardList = ({ bridges }: BridgeCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
      {bridges.map((bridge, index) => {
        const key = `route_${index}`;
        return <BridgeCard key={key} bridge={bridge} />;
      })}
    </div>
  );
};

export default BridgeCardList;
