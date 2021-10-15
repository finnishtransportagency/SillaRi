import IRouteTransport from "./IRouteTransport";

export default interface ICompanyTransports {
  id: number;
  name: string;
  businessId: string;
  lastTransportDepartureTime: Date;
  lastTransportArrivalTime: Date;
  nextPlannedTransportDepartureTime: Date;
  transports: IRouteTransport[];
}
