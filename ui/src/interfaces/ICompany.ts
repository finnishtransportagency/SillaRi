import IAuthorization from "./IAuthorization";

export default interface ICompany {
  id: number;
  name: string;
  authorizations: IAuthorization[];
}
