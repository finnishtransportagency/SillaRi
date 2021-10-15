import IRouteTransport from "./IRouteTransport";

export default interface ICompanyTransports {
  id: number;
  name: string;
  businessId: string;
  ongoingTransportDepartureTime: Date;
  nextPlannedTransportDepartureTime: Date;
  transports: IRouteTransport[];
}
