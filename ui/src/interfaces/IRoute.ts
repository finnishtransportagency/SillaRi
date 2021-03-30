import IAddress from "./IAddress";
import ICrossing from "./ICrossing";

export default interface IRoute {
  id: number;
  name: string;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  departureTime: string;
  arrivalTime: string;
  crossings: ICrossing[];
}
