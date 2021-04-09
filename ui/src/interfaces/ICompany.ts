import IPermit from "./IPermit";

export default interface ICompany {
  id: number;
  name: string;
  permits: IPermit[];
}
