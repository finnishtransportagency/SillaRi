import IAddress from "./IAddress";
import IBridge from "./IBridge";

export default interface IRoute {
  id: number;
  name: string;
  departureAddress: IAddress;
  arrivalAddress: IAddress;
  departureTime: string;
  arrivalTime: string;
  bridges: IBridge[];
}
