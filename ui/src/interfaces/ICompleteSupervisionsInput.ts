import ISupervisionInput from "./ISupervisionInput";

export default interface ICompleteSupervisionsInput {
  supervisionInputs: ISupervisionInput[];
  completeTime: Date;
}
