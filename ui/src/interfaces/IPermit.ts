import IRoute from "./IRoute";
import IVehicle from "./IVehicle";
import ITransportDimensions from "./ITransportDimensions";
import IAxleChart from "./IAxleChart";
import ICompany from "./ICompany";

export default interface IPermit {
  id: number;
  companyId: number;
  permitNumber: string;
  validStartDate: string;
  validEndDate: string;
  leluVersion: number;
  isCurrentVersion: boolean;
  company?: ICompany;
  routes?: IRoute[];
  transportDimensions?: ITransportDimensions;
  vehicles?: IVehicle[];
  axleChart?: IAxleChart;
  transportTotalMass: number;
  pdfObjectKey: string;
  customerUsesSillari: boolean;
}
