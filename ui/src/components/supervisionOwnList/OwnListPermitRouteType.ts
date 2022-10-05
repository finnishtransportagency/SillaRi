import IRoute from "../../interfaces/IRoute";

export default interface OwnListPermitRouteType {
  permitNumber: string;
  routes: Array<IRoute>;
  selectedRouteIndex: number | null;
};
