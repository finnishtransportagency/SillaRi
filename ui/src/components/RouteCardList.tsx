import React from "react";
import IRoute from "../interfaces/IRoute";
import RouteCard from "./RouteCard";
import "./RouteCardList.css";

interface RouteCardListProps {
  routes: IRoute[];
  permitId: number;
}

const RouteCardList = ({ routes, permitId }: RouteCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
      {routes.map((route, index) => {
        const key = `route_${index}`;
        return <RouteCard key={key} route={route} index={index} permitId={permitId} />;
      })}
    </div>
  );
};

export default RouteCardList;
