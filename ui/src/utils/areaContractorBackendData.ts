import type { Dispatch } from "redux";
import { getOrigin } from "./request";
import { NETWORK_RESPONSE_NOT_OK } from "./constants";
import { actions } from "../store/rootSlice";
import IRoute from "../interfaces/IRoute";

export const getPermitRoutes = async (permitNumber: string, dispatch: Dispatch): Promise<Array<IRoute>> => {
  try {
    dispatch({
      type: actions.SET_FAILED_QUERY_STATUS,
      payload: { failedQuery: { getPermitRoutes: false }, failedQueryStatus: -1 },
    });

    const rResponse = await fetch(`${getOrigin()}/api/areaContractor/getRoutes?permitNumber=${encodeURIComponent(permitNumber)}`);

    if (rResponse.ok) {
      const routes = rResponse.json() as Promise<Array<IRoute>>;
      console.log("areaContractor/getRoutes", permitNumber);
      return await routes;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitRoutes: true } });
      dispatch({
        type: actions.SET_FAILED_QUERY_STATUS,
        payload: { failedQuery: { getPermitRoutes: true }, failedQueryStatus: { getPermitRoutes: rResponse.status } },
      });
      throw new Error(rResponse.status.toString());
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitRoutes: true } });
    throw new Error(err as string);
  }
};

export const initiateSupervisions = async (routeBridgeTemplateIds: Array<number>, dispatch: Dispatch): Promise<Array<number>> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { initiateSupervisions: false } });

    const idsArrayParam = `[${routeBridgeTemplateIds.toString()}]`;
    console.log("idsArrayParam" + idsArrayParam);
    const rResponse = await fetch(
      `${getOrigin()}/api/areaContractor/initiateSupervisions?routeBridgeTemplateIds=${encodeURIComponent(idsArrayParam)}`
    );

    if (rResponse.ok) {
      const supervisionIds = rResponse.json() as Promise<Array<number>>;
      console.log("areaContractor/initiateSupervisions", routeBridgeTemplateIds);
      return await supervisionIds;
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
