import ISupervisionImage from "./ISupervisionImage";
import ISupervisionStatus from "./ISupervisionStatus";
import ISupervisionReport from "./ISupervisionReport";
import ISupervisor from "./ISupervisor";
import { SupervisorType } from "../utils/constants";
import IRouteBridge from "./IRouteBridge";
import IRouteTransport from "./IRouteTransport";

export default interface ISupervision {
  id: number;
  routeBridgeId: number;
  routeBridge?: IRouteBridge;
  routeTransportId: number;
  routeTransport?: IRouteTransport;
  plannedTime: Date;
  conformsToPermit: boolean;
  supervisor?: string;
  supervisorType: SupervisorType;
  denyCrossingReason?: string;
  supervisors?: ISupervisor[];
  statusHistory?: ISupervisionStatus[];
  currentStatus?: ISupervisionStatus; // Not in DB, latest status picked from statusHistory
  startedTime?: Date; // Not in DB, first IN_PROGRESS status timestamp filtered from statusHistory
  crossingDeniedTime?: Date; // Not in DB, first CROSSING_DENIED status timestamp filtered from statusHistory
  finishedTime?: Date; // Not in DB, first FINISHED status timestamp filtered from statusHistory
  report?: ISupervisionReport;
  images?: ISupervisionImage[];
}
