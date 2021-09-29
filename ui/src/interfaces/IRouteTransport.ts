import IRoute from "./IRoute";
import IRouteTransportStatus from "./IRouteTransportStatus";
import ISupervision from "./ISupervision";

export default interface IRouteTransport {
  id: number;
  routeId: number;
  plannedDepartureTime: Date;
  currentStatus: IRouteTransportStatus;
  statusHistory: IRouteTransportStatus[];
  route: IRoute;
  supervisions: ISupervision[];
}
