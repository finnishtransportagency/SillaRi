import IBridge from "./IBridge";
import IImageItem from "./IImageItem";

export default interface ICrossing {
  id: number;
  bridge: IBridge;
  started: string;
  drivingLineInfo: boolean;
  drivingLineInfoDesc: string;
  speedInfo: boolean;
  speedInfoDesc: string;
  exceptionsInfo: boolean;
  exceptionsInfoDesc: string;
  describe: boolean;
  descriptionDesc: string;
  extraInfoDesc: string;
  permantBendings: boolean;
  twist: boolean;
  damage: boolean;
}
