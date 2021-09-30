import IBridge from "./IBridge";
import ISupervision from "./ISupervision";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  bridge: IBridge;
  crossingInstruction?: string;
  supervision: ISupervision;
}
