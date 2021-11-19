export default interface IRouteTransportPassword {
  id: number;
  routeTransportId: number;
  transportPassword: string;
  validFrom: Date;
  validTo: Date;
}
