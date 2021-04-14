import IBridge from "./IBridge";

export default interface IRouteBridge {
  id: number;
  bridge: IBridge;
  crossingInstruction?: string;
}
