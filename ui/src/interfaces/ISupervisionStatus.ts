import { SupervisionStatus } from "../utils/constants";

export default interface ISupervisionStatus {
  id: number;
  supervisionId: number;
  status: SupervisionStatus;
  time: Date;
}
