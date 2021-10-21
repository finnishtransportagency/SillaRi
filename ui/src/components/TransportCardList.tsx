import React from "react";
import IRouteTransport from "../interfaces/IRouteTransport";
import TransportCard from "./TransportCard";

interface TransportCardListProps {
  transports: IRouteTransport[];
}

const TransportCardList = ({ transports }: TransportCardListProps): JSX.Element => {
  return (
    <div className="listContainer">
      {transports.map((transport, index) => {
        const key = `transport_${index}`;
        return <TransportCard key={key} transport={transport} />;
      })}
    </div>
  );
};

export default TransportCardList;
