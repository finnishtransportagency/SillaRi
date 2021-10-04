import IBridge from "./IBridge";
import ISupervision from "./ISupervision";
import IRoute from "./IRoute";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  bridge: IBridge;
  crossingInstruction?: string;
  supervision: ISupervision;
  route?: IRoute;
}
