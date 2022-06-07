import IPermit from "./IPermit";

export default interface ICompany {
  id: number;
  name: string;
  businessId: string;
  permits: IPermit[];
}
