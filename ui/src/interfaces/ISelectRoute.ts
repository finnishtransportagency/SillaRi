import IAuthorization from "./IAuthorization";
import IRoute from "./IRoute";
import ICompany from "./ICompany";

export default interface ISelectRoute {
  company: number;
  authorization: number;
  route: number;
}
