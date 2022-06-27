import React from "react";
import IRouteTransport from "../interfaces/IRouteTransport";
import TransportCard from "./TransportCard";
import { getTransportTime } from "../utils/supervisionUtil";
import moment from "moment";
import ICompany from "../interfaces/ICompany";

interface TransportCardListProps {
  company: ICompany;
  transports: IRouteTransport[];
}

const TransportCardList = ({ company, transports }: TransportCardListProps): JSX.Element => {
  return (
    <div className="listContainer selectedBackground ion-padding-bottom">
      {transports
        .sort((a, b) => {
          // Sort by time visible in TransportCard - planned departure time or departure time
          const timeA = getTransportTime(a);
          const timeB = getTransportTime(b);
          return moment(timeA).diff(moment(timeB));
        })
        .map((transport) => {
          const { id: transportId } = transport;
          const key = `transport_${transportId}`;
          return <TransportCard key={key} company={company} transport={transport} />;
        })}
    </div>
  );
};

export default TransportCardList;
