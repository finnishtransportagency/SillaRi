import IAddress from "./IAddress";
import IRouteBridge from "./IRouteBridge";
import IPermit from "./IPermit";
import IRouteTransportNumber from "./IRouteTransportNumber";

export default interface IRoute {
  id: number;
  permitId: number;
  permit: IPermit;
  name: string;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  geojson: string;
  routeBridges: IRouteBridge[];
  transportCount?: number;
  routeTransportNumbers?: IRouteTransportNumber[];
}
