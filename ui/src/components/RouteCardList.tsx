import React from "react";
import IRoute from "../interfaces/IRoute";
import RouteCard from "./RouteCard";
import "./RouteCardList.css";

interface RouteCardListProps {
  routes: IRoute[];
}

const RouteCardList = ({ routes }: RouteCardListProps): JSX.Element => {
  // TODO - change this to a list of route transports
  return (
    <div className="cardListContainer">
      {routes.map((route, index) => {
        const key = `route_${index}`;
        return <RouteCard key={key} route={route} />;
      })}
    </div>
  );
};

export default RouteCardList;
