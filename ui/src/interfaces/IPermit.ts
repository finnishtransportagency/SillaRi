import IRoute from "./IRoute";
import IVehicle from "./IVehicle";
import IAxle from "./IAxle";
import ITransportDimensions from "./ITransportDimensions";

export default interface IPermit {
  id: number;
  companyId: number;
  permitNumber: string;
  validStartDate: string;
  validEndDate: string;
  routes: IRoute[];
  transportDimensions: ITransportDimensions;
  vehicles: IVehicle[];
  axles: IAxle[];
  totalMass: number;
}
