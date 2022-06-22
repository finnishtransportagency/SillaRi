import type { Dispatch } from "redux";
import { getOrigin } from "./request";
import { NETWORK_RESPONSE_NOT_OK } from "./constants";
import { actions } from "../store/rootSlice";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import IRouteTransportPassword from "../interfaces/IRouteTransportPassword";
import IRouteTransportStatus from "../interfaces/IRouteTransportStatus";
import { getUserData } from "./backendData";
import { MD5 } from "crypto-js";

export const findRouteTransportPassword = async (transportPassword: string, dispatch: Dispatch): Promise<IRouteTransportPassword> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: false } });

    const rtpResponse = await fetch(`${getOrigin()}/api/transport/login?transportPassword=${encodeURIComponent(transportPassword)}`);

    if (rtpResponse.ok) {
      const rtp = rtpResponse.json() as Promise<IRouteTransportPassword>;
      console.log("transport/findRouteTransportPassword", transportPassword);
      return await rtp;
    } else if (rtpResponse.status === 403) {
      return {} as IRouteTransportPassword;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteTransport = async (transportPassword: string, dispatch: Dispatch): Promise<IPermit> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: false } });

    // Get the user data from the cache when offline or the backend when online
    const { username } = await getUserData(dispatch);

    const permitOfRouteTransportResponse = await fetch(
      `${getOrigin()}/api/transport/getpermitofroutetransport?transportPassword=${encodeURIComponent(MD5(username + transportPassword).toString())}`
    );

    if (permitOfRouteTransportResponse.ok) {
      const permitOfRouteTransport = (await permitOfRouteTransportResponse.json()) as Promise<IPermit>;
      console.log("transport/getPermitOfRouteTransport", permitOfRouteTransport);
      return await permitOfRouteTransport;
    } else if (permitOfRouteTransportResponse.status === 403) {
      return {} as IPermit;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransport = async (transportPassword: string, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(
      `${getOrigin()}/api/transport/getroutetransport?transportPassword=${encodeURIComponent(transportPassword)}`
    );

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      console.log("transport/getRouteTransport", routeTransport);
      return await routeTransport;
    } else if (routeTransportResponse.status === 403) {
      return {} as IRouteTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const changeRouteTransportStatus = async (
  transportPassword: string,
  routeTransportStatus: IRouteTransportStatus,
  dispatch: Dispatch
): Promise<IRouteTransport> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { changeRouteTransportStatus: false } });

    const changeRouteTransportStatusResponse = await fetch(
      `${getOrigin()}/api/transport/changeroutetransportstatus?transportPassword=${encodeURIComponent(transportPassword)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeTransportStatus),
      }
    );

    if (changeRouteTransportStatusResponse.ok) {
      const changedRouteTransport = (await changeRouteTransportStatusResponse.json()) as Promise<IRouteTransport>;
      console.log("changeRouteTransportStatus", changedRouteTransport);
      return await changedRouteTransport;
    } else if (changeRouteTransportStatusResponse.status === 403) {
      return {} as IRouteTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { changeRouteTransportStatus: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { changeRouteTransportStatus: true } });
    throw new Error(err as string);
  }
};
