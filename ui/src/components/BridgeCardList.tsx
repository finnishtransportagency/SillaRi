import React from "react";
import "./RouteCardList.css";
import BridgeCard from "./BridgeCard";
import ICrossing from "../interfaces/ICrossing";

interface BridgeCardListProps {
  crossings: ICrossing[];
}

const BridgeCardList = ({ crossings }: BridgeCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
      {crossings.map((crossing, index) => {
        const key = `route_${index}`;
        return <BridgeCard key={key} bridge={crossing.bridge} />;
      })}
    </div>
  );
};

export default BridgeCardList;
