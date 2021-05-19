import IBridge from "./IBridge";

export default interface IRouteBridge {
  id: number;
  routeId: number;
  bridge: IBridge;
  crossingInstruction?: string;
}
