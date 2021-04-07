import IBridge from "./IBridge";
import IRoute from "./IRoute";
import IAuthorization from "./IAuthorization";
import IFile from "./IFile";

export default interface ICrossing {
  id: number;
  bridge: IBridge;
  route: IRoute;
  authorization: IAuthorization;
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
