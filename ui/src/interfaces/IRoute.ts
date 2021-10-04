import IAddress from "./IAddress";
import IRouteBridge from "./IRouteBridge";
import IPermit from "./IPermit";

export default interface IRoute {
  id: number;
  permitId: number;
  name: string;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  geojson: string;
  routeBridges: IRouteBridge[];
  permit?: IPermit;
}
