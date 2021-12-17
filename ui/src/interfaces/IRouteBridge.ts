import IBridge from "./IBridge";
import ISupervision from "./ISupervision";
import IRoute from "./IRoute";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  ordinal: number;
  route: IRoute;
  bridge: IBridge;
  crossingInstruction?: string;
  contractNumber: number;
  supervisions: ISupervision[];
}
