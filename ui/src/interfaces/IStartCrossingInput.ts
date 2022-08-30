import ISupervisionReport from "./ISupervisionReport";

export default interface IStartCrossingInput {
  initialReport: ISupervisionReport;
  routeTransportId: number;
  startTime: Date;
}
