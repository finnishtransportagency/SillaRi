import IRoute from "./IRoute";
import ITransport from "./ITransport";

export default interface IPermit {
  id: number;
  companyId: number;
  permitNumber: string;
  validStartDate: string;
  validEndDate: string;
  routes: IRoute[];
  transports: ITransport[];
}
