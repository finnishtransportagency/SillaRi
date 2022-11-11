export default interface IRouteTransportNumber {
  id: number;
  routeId: number;
  routeLeluId: number;
  routeTotalTransportCount: number;
  permitId: number;
  permitNumber: string;
  permitLeluVersion: number;
  permitIsCurrentVersion: boolean;
  routeTransportId: number;
  transportNumber: number;
  used: boolean;
}
