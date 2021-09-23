import IFile from "./IFile";
import ISupervisionStatus from "./ISupervisionStatus";
import ISupervisionReport from "./ISupervisionReport";
import ISupervisionStatusTimes from "./ISupervisionStatusTimes";

export default interface ISupervision {
  id: number;
  routeBridgeId: number;
  routeTransportId: number;
  plannedTime: Date;
  conformsToPermit: boolean;
  // TODO supervisor
  currentStatus: ISupervisionStatus;
  statusTimes: ISupervisionStatusTimes;
  statusHistory: [ISupervisionStatus];
  report: ISupervisionReport;
  images: [IFile];
}
