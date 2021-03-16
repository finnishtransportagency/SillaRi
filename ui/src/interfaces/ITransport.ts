import IAddress from "./IAddress";
import ICompany from "./ICompany";
import ICrossing from "./ICrossing";

export default interface ITransport {
  id: number;
  title: string;
  arrivalAddress: IAddress;
  departureAddress: IAddress;
  company: ICompany;
  beginDate: string;
  endDate: string;
  crossings: ICrossing[];
}
