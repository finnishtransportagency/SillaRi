import IRouteBridge from "./IRouteBridge";

export default interface IBridge {
  id: number;
  name: string;
  identifier: string;
  municipality: string;
  geojson: string;
  routeBridges?: IRouteBridge[];
}
