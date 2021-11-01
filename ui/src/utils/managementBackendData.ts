import type { Dispatch } from "redux";
import ICompany from "../interfaces/ICompany";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import IRouteTransportPassword from "../interfaces/IRouteTransportPassword";
import ISupervisor from "../interfaces/ISupervisor";
import { getOrigin } from "./request";
import { actions as managementActions } from "../store/managementSlice";

const notOkError = "Network response was not ok";

export const onRetry = (failureCount: number, error: string): boolean => {
  // Retry forever by returning true
  console.error("ERROR", failureCount, error);
  return true;
};

export const getCompany = async (companyId: number, dispatch: Dispatch): Promise<ICompany> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: false } });

    const companyResponse = await fetch(`${getOrigin()}/api/company/getcompany?companyId=${companyId}`);

    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      console.log("getCompany", company);
      return await company;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: true } });
    throw new Error(err as string);
  }
};

export const getPermit = async (permitId: number, dispatch: Dispatch): Promise<IPermit> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: false } });

    const permitResponse = await fetch(`${getOrigin()}/api/permit/getpermit?permitId=${permitId}`);

    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      console.log("getPermit", permit);
      return await permit;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<IPermit> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: false } });

    const permitOfRouteTransportResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroutetransport?routeTransportId=${routeTransportId}`);

    if (permitOfRouteTransportResponse.ok) {
      const permitOfRouteTransport = (await permitOfRouteTransportResponse.json()) as Promise<IPermit>;
      console.log("getPermitOfRouteTransport", permitOfRouteTransport);
      return await permitOfRouteTransport;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransport?routeTransportId=${routeTransportId}`);

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      console.log("getRouteTransport", routeTransport);
      return await routeTransport;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const findRouteTransportPassword = async (transportPassword: string, dispatch: Dispatch): Promise<IRouteTransportPassword> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const rtpResponse = await fetch(`${getOrigin()}/api/transport/login?transportPassword=${transportPassword}`);

    if (rtpResponse.ok) {
      const rtp = (await rtpResponse.json()) as Promise<IRouteTransportPassword>;
      console.log("findRouteTransportPassword", transportPassword);
      return await rtp;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { findRouteTransportByPassword: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportsOfPermit = async (permitId: number, dispatch: Dispatch): Promise<IRouteTransport[]> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: false } });

    const routeTransportListResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransportsofpermit?permitId=${permitId}`);

    if (routeTransportListResponse.ok) {
      const routeTransportList = (await routeTransportListResponse.json()) as Promise<IRouteTransport[]>;
      console.log("getRouteTransportsOfPermit", routeTransportList);
      return await routeTransportList;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
    throw new Error(err as string);
  }
};

export const createRouteTransport = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { createRouteTransport: false } });

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
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { createRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { createRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const updateRouteTransport = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { updateRouteTransport: false } });

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
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { updateRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { updateRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const deleteRouteTransport = async (routeTransportId: number, dispatch: Dispatch): Promise<boolean> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { deleteRouteTransport: false } });

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
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { deleteRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { deleteRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getSupervisors = async (dispatch: Dispatch): Promise<ISupervisor[]> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: false } });

    const supervisorsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisors`);

    if (supervisorsResponse.ok) {
      const supervisors = (await supervisorsResponse.json()) as Promise<ISupervisor[]>;
      console.log("getSupervisors", supervisors);
      return await supervisors;
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: true } });
    throw new Error(err as string);
  }
};
