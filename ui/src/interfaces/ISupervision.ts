import IFile from "./IFile";
import ISupervisionStatus from "./ISupervisionStatus";
import ISupervisionReport from "./ISupervisionReport";
import ISupervisor from "./ISupervisor";
import { SupervisorType } from "../utils/constants";
import IRouteBridge from "./IRouteBridge";
import IRouteTransport from "./IRouteTransport";

export default interface ISupervision {
  id: number;
  routeBridgeId: number;
  routeBridge: IRouteBridge;
  routeTransportId: number;
  routeTransport: IRouteTransport;
  plannedTime: Date;
  conformsToPermit: boolean;
  statusHistory: ISupervisionStatus[];
  currentStatus: ISupervisionStatus; // Not in DB, latest status picked from statusHistory
  createdTime: Date; // Not in DB, first PLANNED status timestamp filtered from statusHistory
  startedTime: Date; // Not in DB, first IN_PROGRESS status timestamp filtered from statusHistory
  cancelledTime: Date; // Not in DB, first CANCELLED status timestamp filtered from statusHistory
  finishedTime: Date; // Not in DB, first FINISHED status timestamp filtered from statusHistory
  supervisorType: SupervisorType;
  supervisors: ISupervisor[];
  report: ISupervisionReport;
  images: IFile[];
}
