import type { Dispatch } from "redux";
import ICompany from "../interfaces/ICompany";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervisor from "../interfaces/ISupervisor";
import { getOrigin } from "./request";
import { actions as managementActions } from "../store/managementSlice";

const notOkError = "Network response was not ok";

export const onRetry = (failureCount: number, error: string): boolean => {
  // Retry forever by returning true
  console.error("ERROR", failureCount, error);
  return true;
};

export const getCompany = async (companyId: number, dispatch: Dispatch, selectedCompanyDetail?: ICompany): Promise<void> => {
  try {
    // Clear the details in the state if the requested id doesn't match to avoid showing incorrect data
    if (selectedCompanyDetail && selectedCompanyDetail.id !== companyId) {
      dispatch({ type: managementActions.GET_COMPANY, payload: undefined });
    }
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: false } });

    const companyResponse = await fetch(`${getOrigin()}/api/company/getcompany?companyId=${companyId}`);

    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      dispatch({ type: managementActions.GET_COMPANY, payload: company });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getCompany: true } });
    throw new Error(err as string);
  }
};

export const getPermit = async (permitId: number, dispatch: Dispatch, selectedPermitDetail?: IPermit): Promise<void> => {
  try {
    if (selectedPermitDetail && selectedPermitDetail.id !== permitId) {
      dispatch({ type: managementActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: false } });

    const permitResponse = await fetch(`${getOrigin()}/api/permit/getpermit?permitId=${permitId}`);

    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      dispatch({ type: managementActions.GET_PERMIT, payload: permit });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermit: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteTransport = async (
  routeTransportId: number,
  dispatch: Dispatch,
  selectedRouteTransportDetail?: IRouteTransport
): Promise<void> => {
  try {
    if (selectedRouteTransportDetail && selectedRouteTransportDetail.id !== routeTransportId) {
      dispatch({ type: managementActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: false } });

    const permitOfRouteTransportResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroutetransport?routeTransportId=${routeTransportId}`);

    if (permitOfRouteTransportResponse.ok) {
      const permitOfRouteTransport = (await permitOfRouteTransportResponse.json()) as Promise<IPermit>;
      dispatch({ type: managementActions.GET_PERMIT, payload: permitOfRouteTransport });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getPermitOfRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransport = async (
  routeTransportId: number,
  dispatch: Dispatch,
  selectedRouteTransportDetail?: IRouteTransport
): Promise<void> => {
  try {
    if (selectedRouteTransportDetail && selectedRouteTransportDetail.id !== routeTransportId) {
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT, payload: undefined });
    }
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransport?routeTransportId=${routeTransportId}`);

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT, payload: routeTransport });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportsOfPermit = async (permitId: number, dispatch: Dispatch, selectedPermitDetail?: IPermit): Promise<void> => {
  try {
    if (selectedPermitDetail && selectedPermitDetail.id !== permitId) {
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT_LIST, payload: undefined });
    }
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: false } });

    const routeTransportListResponse = await fetch(`${getOrigin()}/api/routetransport/getroutetransportsofpermit?permitId=${permitId}`);

    if (routeTransportListResponse.ok) {
      const routeTransportList = (await routeTransportListResponse.json()) as Promise<IRouteTransport[]>;
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT_LIST, payload: routeTransportList });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getRouteTransportsOfPermit: true } });
    throw new Error(err as string);
  }
};

export const sendRouteTransportPlanned = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportPlanned: false } });

    const createRouteTransportResponse = await fetch(`${getOrigin()}/api/routetransport/createroutetransport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeTransport),
    });

    if (createRouteTransportResponse.ok) {
      const plannedRouteTransport = (await createRouteTransportResponse.json()) as Promise<IRouteTransport>;
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT, payload: plannedRouteTransport });
      dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: plannedRouteTransport });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportPlanned: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportPlanned: true } });
    throw new Error(err as string);
  }
};

export const sendRouteTransportUpdate = async (routeTransport: IRouteTransport, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportUpdate: false } });

    const updateRouteTransportResponse = await fetch(`${getOrigin()}/api/routetransport/updateroutetransport`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeTransport),
    });

    if (updateRouteTransportResponse.ok) {
      const updatedRouteTransport = (await updateRouteTransportResponse.json()) as Promise<IRouteTransport>;
      dispatch({ type: managementActions.GET_ROUTE_TRANSPORT, payload: updatedRouteTransport });
      dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: updatedRouteTransport });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportUpdate: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { sendRouteTransportUpdate: true } });
    throw new Error(err as string);
  }
};

export const getSupervisors = async (dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: false } });

    const supervisorsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisors`);

    if (supervisorsResponse.ok) {
      const supervisors = (await supervisorsResponse.json()) as Promise<ISupervisor[]>;
      dispatch({ type: managementActions.GET_SUPERVISOR_LIST, payload: supervisors });
    } else {
      dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: managementActions.SET_FAILED_QUERY, payload: { getSupervisors: true } });
    throw new Error(err as string);
  }
};
