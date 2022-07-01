import type { Dispatch } from "redux";
import { getOrigin } from "./request";
import { CONFLICT_ERROR, FORBIDDEN_ERROR, NETWORK_RESPONSE_NOT_OK, SillariErrorCode } from "./constants";
import { actions } from "../store/rootSlice";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import IUserData from "../interfaces/IUserData";
import IVersionInfo from "../interfaces/IVersionInfo";

// Must use err type any, because it might be either string or Error. If we use type 'unknown', mutation result is the wrong type.
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const onRetry = (failureCount: number, err: any): boolean => {
  // By default, retry forever by returning true - unless error is FORBIDDEN.
  console.log("err is Error type", err instanceof Error);
  console.log("err is string type", typeof err === "string" || err instanceof String);
  // FIXME find out when err is string and when Error (preferably fix so that it's never a string, although might not be possible)
  const isForbiddenError = (err instanceof Error && err.message === FORBIDDEN_ERROR) || err === FORBIDDEN_ERROR;
  console.log("isForbiddenError", isForbiddenError);
  return !isForbiddenError;
};

export const createErrorFromStatusCode = (statusCode: number): Error => {
  if (statusCode === 403) {
    return new Error(FORBIDDEN_ERROR);
  } else if (statusCode === 409) {
    return new Error(CONFLICT_ERROR);
  } else {
    return new Error(NETWORK_RESPONSE_NOT_OK);
  }
};

export const createErrorFromUnknown = (err: unknown): Error => {
  const errMessage = err instanceof Error ? err.message : (err as string);
  throw new Error(errMessage);
};

export const getUserData = async (dispatch: Dispatch): Promise<IUserData> => {
  try {
    console.log("getUserData");
    dispatch({
      type: actions.SET_FAILED_QUERY_STATUS,
      payload: { failedQuery: { getUserData: false }, failedQueryStatus: { getUserData: -1 } },
    });

    const userDataResponse = await fetch(`${getOrigin()}/api/ui/userdata`);

    if (userDataResponse.ok) {
      const userData = (await userDataResponse.json()) as Promise<IUserData>;
      return await userData;
    } else {
      // Use the status redux action so that the status code (401, 403, etc) is stored for later use
      dispatch({
        type: actions.SET_FAILED_QUERY_STATUS,
        payload: { failedQuery: { getUserData: true }, failedQueryStatus: { getUserData: userDataResponse.status } },
      });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    if (err instanceof Error && err.message === NETWORK_RESPONSE_NOT_OK) {
      // This error came from the error thrown above, so preserve the status code for use in App.tsx
    } else {
      // Otherwise this is a different error, so store a general error code in redux
      // This can happen when the application is offline and there is no cached data
      dispatch({
        type: actions.SET_FAILED_QUERY_STATUS,
        payload: { failedQuery: { getUserData: true }, failedQueryStatus: { getUserData: SillariErrorCode.OTHER_USER_FETCH_ERROR } },
      });
    }
    throw new Error(err as string);
  }
};

export const getVersionInfo = async (dispatch: Dispatch): Promise<IVersionInfo> => {
  try {
    console.log("getVersionInfo");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getVersionInfo: false } });

    const versionInfoResponse = await fetch(`${getOrigin()}/api/ui/versioninfo`);

    if (versionInfoResponse.ok) {
      const versionInfo = (await versionInfoResponse.json()) as Promise<IVersionInfo>;
      return await versionInfo;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getVersionInfo: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getVersionInfo: true } });
    throw new Error(err as string);
  }
};

export const getRouteGeometry = async (routeId: number, dispatch: Dispatch): Promise<IRoute> => {
  try {
    console.log("GetRouteGeometry", routeId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRoute: false } });

    const routeResponse = await fetch(`${getOrigin()}/api/route/getroute?routeId=${routeId}`);

    if (routeResponse.ok) {
      const route = (await routeResponse.json()) as Promise<IRoute>;
      return await route;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRoute: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRoute: true } });
    throw new Error(err as string);
  }
};

export const getRouteBridgeGeometry = async (routeBridgeId: number, dispatch: Dispatch): Promise<IRouteBridge> => {
  try {
    console.log("getRouteBridgeGeometry", routeBridgeId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteBridge: false } });

    const routeBridgeResponse = await fetch(`${getOrigin()}/api/routebridge/getroutebridge?routeBridgeId=${routeBridgeId}`);

    if (routeBridgeResponse.ok) {
      const routeBridge = (await routeBridgeResponse.json()) as Promise<IRouteBridge>;
      return await routeBridge;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
    throw new Error(err as string);
  }
};
