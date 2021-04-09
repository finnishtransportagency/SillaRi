import IPermit from "./IPermit";
import IRoute from "./IRoute";
import ICompany from "./ICompany";

export default interface ISelectRoute {
  company: number;
  permit: number;
  route: number;
}
