import IBridge from "./IBridge";
import IImageItem from "./IImageItem";

export default interface ICrossing {
  id: number;
  bridge: IBridge;
  started: string;
  drivingLineInfo: boolean;
  drivingLineInfoDescription: string;
  speedInfo: boolean;
  speedInfoDescription: string;
  exceptionsInfo: boolean;
  exceptionsInfoDescription: string;
  describe: boolean;
  extraInfoDescription: string;
  permanentBendings: boolean;
  twist: boolean;
  damage: boolean;
}
