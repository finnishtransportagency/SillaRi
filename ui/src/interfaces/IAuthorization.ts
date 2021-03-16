import IRoute from "./IRoute";

export default interface IAuthorization {
  id: number;
  companyId: number;
  permissionId: string;
  validStartDate: string;
  validEndDate: string;
  routes: IRoute[];
}
