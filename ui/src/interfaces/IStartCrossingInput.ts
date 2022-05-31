import ISupervisionReport from "./ISupervisionReport";

export default interface IStartCrossingInput {
  initialReport: ISupervisionReport;
  startTime: Date;
}
