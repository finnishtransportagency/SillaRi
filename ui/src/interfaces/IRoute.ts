import IAddress from "./IAddress";
import IRouteBridge from "./IRouteBridge";

export default interface IRoute {
  id: number;
  permitId: number;
  name: string;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  departureTime: string;
  arrivalTime: string;
  routeBridges: IRouteBridge[];
}
