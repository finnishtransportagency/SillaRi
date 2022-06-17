import IBridge from "./IBridge";
import ISupervision from "./ISupervision";
import IRoute from "./IRoute";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  ordinal: number;
  transportNumber: number;
  route: IRoute;
  bridge: IBridge;
  crossingInstruction?: string;
  contractNumber: number;
  contractBusinessId: string;
  supervisions: ISupervision[];
}
