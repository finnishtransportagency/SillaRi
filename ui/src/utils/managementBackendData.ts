import type { Dispatch } from "redux";
import { getOrigin } from "./request";
import { NETWORK_RESPONSE_NOT_OK } from "./constants";
import { actions } from "../store/rootSlice";
import ICompany from "../interfaces/ICompany";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import IRouteTransportPassword from "../interfaces/IRouteTransportPassword";
import ISupervision from "../interfaces/ISupervision";

export const getCompany = async (dispatch: Dispatch): Promise<ICompany> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompany: false } });

    const companyResponse = await fetch(`${getOrigin()}/api/company/getcompany`);

    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      console.log("getCompany", company);
      return await company;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompany: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompany: true } });
    throw new Error(err as string);
  }
};

export const getPermit = async (permitId: number, dispatch: Dispatch): Promise<IPermit> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermit: false } });

    const permitResponse = await fetch(`${getOrigin()}/api/permit/getpermit?permitId=${permitId}`);

    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      console.log("getPermit", permit);
      return await permit;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermit: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermit: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<IPermit> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: false } });

    const permitOfRouteTransportResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroutetransport?routeTransportId=${routeTransportId}`);

    if (permitOfRouteTransportResponse.ok) {
      const permitOfRouteTransport = (await permitOfRouteTransportResponse.json()) as Promise<IPermit>;
      console.log("getPermitOfRouteTransport", permitOfRouteTransport);
      return await permitOfRouteTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransport?routeTransportId=${routeTransportId}`);

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      console.log("getRouteTransport", routeTransport);
      return await routeTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const generateNewRouteTransportPassword = async (routeTransportId: number, dispatch: Dispatch): Promise<IRouteTransportPassword> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { generateNewRouteTransportPassword: false } });

    const rtpResponse = await fetch(`${getOrigin()}/api/transportpassword/generate?routeTransportId=${routeTransportId}`);

    if (rtpResponse.ok) {
      const rtp = (await rtpResponse.json()) as Promise<IRouteTransportPassword>;
      console.log("generateNewRouteTransportPassword", routeTransportId);
      return await rtp;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { generateNewRouteTransportPassword: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { generateNewRouteTransportPassword: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportsOfPermit = async (permitId: number, dispatch: Dispatch): Promise<IRouteTransport[]> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: false } });

    const routeTransportListResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransportsofpermit?permitId=${permitId}`);

    if (routeTransportListResponse.ok) {
      const routeTransportList = (await routeTransportListResponse.json()) as Promise<IRouteTransport[]>;
      console.log("getRouteTransportsOfPermit", routeTransportList);
      return await routeTransportList;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
    throw new Error(err as string);
  }
};

export const createRouteTransport = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { createRouteTransport: false } });

    const createRouteTransportResponse = await fetch(`${getOrigin()}/api/routetransport/createroutetransport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeTransport),
    });

    if (createRouteTransportResponse.ok) {
      const plannedRouteTransport = (await createRouteTransportResponse.json()) as Promise<IRouteTransport>;
      console.log("createRouteTransport", plannedRouteTransport);
      return await plannedRouteTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { createRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { createRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const updateRouteTransport = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateRouteTransport: false } });

    const updateRouteTransportResponse = await fetch(`${getOrigin()}/api/routetransport/updateroutetransport`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeTransport),
    });

    if (updateRouteTransportResponse.ok) {
      const updatedRouteTransport = (await updateRouteTransportResponse.json()) as Promise<IRouteTransport>;
      console.log("updateRouteTransport", updatedRouteTransport);
      return await updatedRouteTransport;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const deleteRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<boolean> => {
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteRouteTransport: false } });

    const deleteRouteTransportResponse = await fetch(`${getOrigin()}/api/routetransport/deleteroutetransport?routeTransportId=${routeTransportId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRouteTransportResponse.ok) {
      const deleteRouteTransportResult = (await deleteRouteTransportResponse.json()) as Promise<boolean>;
      console.log("deleteRouteTransport", deleteRouteTransportResult);
      return await deleteRouteTransportResult;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteRouteTransport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getSupervisionOfTransportCompany = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("GetSupervisionOfTransportCompany", supervisionId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionOfTransportCompany: false } });

    const supervisionResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionoftransportcompany?supervisionId=${supervisionId}`);

    if (supervisionResponse.ok) {
      const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
      return await supervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionOfTransportCompany: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionOfTransportCompany: true } });
    throw new Error(err as string);
  }
};
