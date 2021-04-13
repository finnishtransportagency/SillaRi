import IBridge from "./IBridge";
import IRoute from "./IRoute";
import IPermit from "./IPermit";
import IFile from "./IFile";

export default interface ICrossing {
  id: number;
  routeBridgeId: number;
  bridge: IBridge;
  route: IRoute;
  permit: IPermit;
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
  images: [IFile];
}
