import React from "react";
import IRoute from "../interfaces/IRoute";
import RouteCard from "./RouteCard";
import "./RouteCardList.css";

interface RouteCardListProps {
  routes: IRoute[];
  authorizationId: number;
}

const RouteCardList = ({ routes, authorizationId }: RouteCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
      {routes.map((route, index) => {
        const key = `route_${index}`;
        return <RouteCard key={key} route={route} index={index} authorizationId={authorizationId} />;
      })}
    </div>
  );
};

export default RouteCardList;
