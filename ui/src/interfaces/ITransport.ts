import IAxle from "./IAxle";
import ITransportRegistration from "./ITransportRegistration";

export default interface ITransport {
  id: number;
  permitId: number;
  routeId: number;
  name: string;
  height: number;
  width: number;
  length: number;
  totalMass: number;
  registrations: ITransportRegistration[];
  axles: IAxle[];
}
