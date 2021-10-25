import IRoute from "./IRoute";
import IVehicle from "./IVehicle";
import ITransportDimensions from "./ITransportDimensions";
import IAxleChart from "./IAxleChart";

export default interface IPermit {
  id: number;
  companyId: number;
  permitNumber: string;
  validStartDate: string;
  validEndDate: string;
  routes: IRoute[];
  transportDimensions: ITransportDimensions;
  vehicles: IVehicle[];
  axleChart: IAxleChart;
  transportTotalMass: number;
}
