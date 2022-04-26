import IRouteTransport from "./IRouteTransport";
import ICompany from "./ICompany";

export default interface ICompanyTransports {
  company: ICompany;
  transports: IRouteTransport[];
}
