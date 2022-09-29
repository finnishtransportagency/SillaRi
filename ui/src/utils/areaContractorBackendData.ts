import type { Dispatch } from "redux";
import { getOrigin } from "./request";
import { NETWORK_RESPONSE_NOT_OK } from "./constants";
import { actions } from "../store/rootSlice";
import IRoute from "../interfaces/IRoute";

export const getPermitRoutes = async (permitNumber: string, dispatch: Dispatch): Promise<Array<IRoute>> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitRoutes: false } });

    const rResponse = await fetch(`${getOrigin()}/api/areaContractor/getRoutes?permitNumber=${encodeURIComponent(permitNumber)}`);

    if (rResponse.ok) {
      const routes = rResponse.json() as Promise<Array<IRoute>>;
      console.log("areaContractor/getRoutes", permitNumber);
      return await routes;
    } else if (rResponse.status === 403) {
      return [];
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
    throw new Error(err as string);
  }
};
