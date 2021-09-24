import IFile from "./IFile";
import ISupervisionStatus from "./ISupervisionStatus";
import ISupervisionReport from "./ISupervisionReport";

export default interface ISupervision {
  id: number;
  routeBridgeId: number;
  routeTransportId: number;
  plannedTime: Date;
  conformsToPermit: boolean;
  // TODO supervisor
  statusHistory: [ISupervisionStatus];
  currentStatus: ISupervisionStatus; // Not in DB, latest status picked from statusHistory
  createdTime: Date; // Not in DB, first PLANNED status timestamp filtered from statusHistory
  startedTime: Date; // Not in DB, first IN_PROGRESS status timestamp filtered from statusHistory
  cancelledTime: Date; // Not in DB, first CANCELLED status timestamp filtered from statusHistory
  finishedTime: Date; // Not in DB, first FINISHED status timestamp filtered from statusHistory
  report: ISupervisionReport;
  images: [IFile];
}
