import { PositionAlign, PositionSide } from "@ionic/core";

export default interface IPopoverPlacement {
  trigger: string;
  side: PositionSide;
  alignment: PositionAlign;
}
