import { TransportStatus } from "../utils/constants";

export default interface IRouteTransportStatus {
  id: number;
  routeTransportId: number;
  status: TransportStatus;
  time: Date;
}
