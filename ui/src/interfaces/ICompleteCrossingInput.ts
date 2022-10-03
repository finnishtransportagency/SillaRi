import ISupervisionInput from "./ISupervisionInput";

export default interface ICompleteCrossingInput {
  supervisionInputs: ISupervisionInput[];
  completeTime: Date;
}
