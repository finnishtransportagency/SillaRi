import IFile from "./IFile";
import ICrossing from "./ICrossing";

export default interface ISupervision {
  id: number;
  routeBridgeId: number;
  routeTransportId: number;
  plannedTime: string;
  conformsToPermit: boolean;
  // TODO supervisor
  // TODO status
  report: ICrossing; // TODO change type
  images: [IFile];
}
