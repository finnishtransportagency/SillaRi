import IBridge from "./IBridge";
import ISupervision from "./ISupervision";
import IRoute from "./IRoute";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  route: IRoute;
  bridge: IBridge;
  crossingInstruction?: string;
  supervisions: ISupervision[];
}
