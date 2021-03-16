import IAddress from "./IAddress";
import ICrossing from "./ICrossing";

export default interface IRoute {
  id: number;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  departureTime: string;
  arrivalTime: string;
  crossings: ICrossing[];
}
