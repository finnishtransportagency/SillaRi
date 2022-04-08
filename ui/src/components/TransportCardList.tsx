import React from "react";
import IRouteTransport from "../interfaces/IRouteTransport";
import TransportCard from "./TransportCard";

interface TransportCardListProps {
  transports: IRouteTransport[];
}

const TransportCardList = ({ transports }: TransportCardListProps): JSX.Element => {
  return (
    <div className="listContainer selectedBackground ion-padding-bottom">
      {transports.map((transport) => {
        const { id: transportId } = transport;
        const key = `transport_${transportId}`;
        return <TransportCard key={key} transport={transport} />;
      })}
    </div>
  );
};

export default TransportCardList;
