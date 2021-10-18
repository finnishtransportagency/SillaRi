import IRouteTransport from "./IRouteTransport";
import ICompany from "./ICompany";

export default interface ICompanyTransports {
  company: ICompany;
  transports: IRouteTransport[];
  lastOngoingTransportDepartureTime: Date;
  lastFinishedTransportDepartureTime: Date;
  lastFinishedTransportArrivalTime: Date;
  nextPlannedTransportDepartureTime: Date;
}
