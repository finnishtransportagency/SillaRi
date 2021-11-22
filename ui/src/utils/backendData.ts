import type { Dispatch } from "redux";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import { getOrigin } from "./request";
import { actions as supervisionActions } from "../store/supervisionSlice";
import IUserData from "../interfaces/IUserData";

const notOkError = "Network response was not ok";

export const onRetry = (failureCount: number, error: string): boolean => {
  // Retry forever by returning true
  console.error("ERROR", failureCount, error);
  return true;
};

export const getUserData = async (dispatch: Dispatch): Promise<IUserData> => {
  try {
    console.log("getSupervisorUser");
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisorUser: false } });

    const userDataResponse = await fetch(`${getOrigin()}/api/ui/userdata`);

    if (userDataResponse.ok) {
      const userData = (await userDataResponse.json()) as Promise<IUserData>;
      return await userData;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisorUser: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisorUser: true } });
    throw new Error(err as string);
  }
};

export const getRouteGeometry = async (routeId: number, dispatch: Dispatch): Promise<IRoute> => {
  try {
    console.log("GetRouteGeometry", routeId);
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: false } });

    const routeResponse = await fetch(`${getOrigin()}/api/route/getroute?routeId=${routeId}`);

    if (routeResponse.ok) {
      const route = (await routeResponse.json()) as Promise<IRoute>;
      return await route;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: true } });
    throw new Error(err as string);
  }
};

export const getRouteBridgeGeometry = async (routeBridgeId: number, dispatch: Dispatch): Promise<IRouteBridge> => {
  try {
    console.log("getRouteBridgeGeometry", routeBridgeId);
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: false } });

    const routeBridgeResponse = await fetch(`${getOrigin()}/api/routebridge/getroutebridge?routeBridgeId=${routeBridgeId}`);

    if (routeBridgeResponse.ok) {
      const routeBridge = (await routeBridgeResponse.json()) as Promise<IRouteBridge>;
      return await routeBridge;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
    throw new Error(err as string);
  }
};
