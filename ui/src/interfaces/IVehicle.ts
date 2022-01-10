import { VehicleRole } from "../utils/constants";

export default interface IVehicle {
  id: number;
  permitId: number;
  ordinal: number;
  type: string;
  role?: VehicleRole;
  identifier: string;
}
