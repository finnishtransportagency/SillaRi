import IRoute from "./IRoute";
import IRouteTransportPassword from "./IRouteTransportPassword";
import IRouteTransportStatus from "./IRouteTransportStatus";
import ISupervision from "./ISupervision";

export default interface IRouteTransport {
  id: number;
  routeId: number;
  plannedDepartureTime: Date;
  tractorUnit: string;
  departureTime?: Date; // actual departure time from statusHistory
  arrivalTime?: Date; // actual arrival time from statusHistory
  currentStatus?: IRouteTransportStatus;
  statusHistory?: IRouteTransportStatus[];
  route?: IRoute;
  supervisions?: ISupervision[];
  currentTransportPassword?: IRouteTransportPassword;
}
