import type { Dispatch } from "redux";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import ISupervisionImageInput from "../interfaces/ISupervisionImageInput";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { getOrigin } from "./request";
import { actions as supervisionActions } from "../store/supervisionSlice";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IRouteTransport from "../interfaces/IRouteTransport";

const notOkError = "Network response was not ok";

export const onRetry = (failureCount: number, error: string): boolean => {
  // Retry forever by returning true
  console.error("ERROR", failureCount, error);
  return true;
};

export const getCompanyTransportsList = async (username: string, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: false } });

    const companyTransportsResponse = await fetch(`${getOrigin()}/api/company/getcompanytransportlistofsupervisor?username=${username}`);

    if (companyTransportsResponse.ok) {
      const companyTransportsList = (await companyTransportsResponse.json()) as Promise<ICompanyTransports[]>;
      dispatch({ type: supervisionActions.GET_COMPANY_TRANSPORTS_LIST, payload: companyTransportsList });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
    throw new Error(err as string);
  }
};

export const getRoute = async (routeId: number, dispatch: Dispatch, selectedRouteDetail?: IRoute): Promise<void> => {
  try {
    if (selectedRouteDetail && selectedRouteDetail.id !== routeId) {
      dispatch({ type: supervisionActions.GET_ROUTE, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: false } });

    const routeResponse = await fetch(`${getOrigin()}/api/route/getroute?routeId=${routeId}`);

    if (routeResponse.ok) {
      const route = (await routeResponse.json()) as Promise<IRoute>;
      dispatch({ type: supervisionActions.GET_ROUTE, payload: route });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRoute: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportOfSupervisor = async (
  routeTransportId: number,
  username: string,
  dispatch: Dispatch,
  selectedRouteTransportDetail?: IRouteTransport
): Promise<void> => {
  try {
    if (selectedRouteTransportDetail && selectedRouteTransportDetail.id !== routeTransportId) {
      dispatch({ type: supervisionActions.GET_ROUTE_TRANSPORT, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(
      `${getOrigin()}/api/routetransport/getroutetransportofsupervisor?routeTransportId=${routeTransportId}&username=${username}`
    );

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      dispatch({ type: supervisionActions.GET_ROUTE_TRANSPORT, payload: routeTransport });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw new Error(err as string);
  }
};

export const getRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: supervisionActions.GET_ROUTE_BRIDGE, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: false } });

    const routeBridgeResponse = await fetch(`${getOrigin()}/api/routebridge/getroutebridge?routeBridgeId=${routeBridgeId}`);

    if (routeBridgeResponse.ok) {
      const routeBridge = (await routeBridgeResponse.json()) as Promise<IRouteBridge>;
      dispatch({ type: supervisionActions.GET_ROUTE_BRIDGE, payload: routeBridge });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
    throw new Error(err as string);
  }
};

export const getSupervisionList = async (username: string, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: false } });

    const supervisionsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionsofsupervisor?username=${username}`);

    if (supervisionsResponse.ok) {
      const supervisions = (await supervisionsResponse.json()) as Promise<ISupervision[]>;

      dispatch({ type: supervisionActions.GET_SUPERVISION_LIST, payload: supervisions });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
    throw new Error(err as string);
  }
};

export const getSupervision = async (supervisionId: number, dispatch: Dispatch, selectedSupervisionDetail?: ISupervision): Promise<void> => {
  try {
    if (selectedSupervisionDetail && selectedSupervisionDetail.id !== supervisionId) {
      dispatch({ type: supervisionActions.GET_SUPERVISION, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: false } });

    const supervisionResponse = await fetch(`${getOrigin()}/api/supervision/getsupervision?supervisionId=${supervisionId}`);

    if (supervisionResponse.ok) {
      const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.GET_SUPERVISION, payload: supervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: true } });
    throw new Error(err as string);
  }
};

export const updateConformsToPermit = async (updateRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateConformsToPermit: false } });

    const updateSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/updateconformstopermit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRequest),
    });

    if (updateSupervisionResponse.ok) {
      const updatedSupervision = (await updateSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.UPDATE_CONFORMS_TO_PERMIT, payload: updatedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
    throw new Error(err as string);
  }
};

export const startSupervision = async (supervisionId: number, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: false } });

    const startSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/startsupervision?supervisionId=${supervisionId}`, {
      method: "POST",
    });

    if (startSupervisionResponse.ok) {
      const startedSupervision = (await startSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.START_SUPERVISION, payload: startedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: true } });
    throw new Error(err as string);
  }
};

export const denyCrossing = async (denyRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { denyCrossing: false } });

    const denyCrossingResponse = await fetch(`${getOrigin()}/api/supervision/denycrossing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(denyRequest),
    });

    if (denyCrossingResponse.ok) {
      const supervision = (await denyCrossingResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.DENY_CROSSING, payload: supervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
    throw new Error(err as string);
  }
};

export const finishSupervision = async (finishRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: false } });

    const finishSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/finishsupervision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finishRequest),
    });

    if (finishSupervisionResponse.ok) {
      const finishedSupervision = (await finishSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.FINISH_SUPERVISION, payload: finishedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
    throw new Error(err as string);
  }
};

export const updateSupervisionReport = async (updateRequest: ISupervisionReport, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateSupervisionReport: false } });

    const updateReportResponse = await fetch(`${getOrigin()}/api/supervision/updatesupervisionreport`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRequest),
    });

    if (updateReportResponse.ok) {
      const updatedSupervision = (await updateReportResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.SUPERVISION_SUMMARY, payload: updatedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateSupervisionReport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateSupervisionReport: true } });
    throw new Error(err as string);
  }
};

export const sendImageUpload = async (fileUpload: ISupervisionImageInput, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendImageUpload: false } });

    const imageUploadResponse = await fetch(`${getOrigin()}/api/images/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileUpload),
    });

    if (imageUploadResponse.ok) {
      const imageUpload = (await imageUploadResponse.json()) as Promise<ISupervisionImage>;
      console.log("imageUpload response", imageUpload);
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
    throw new Error(err as string);
  }
};

export const deleteImage = async (objectKey: string, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: false } });

    const imageDeleteResponse = await fetch(`${getOrigin()}/api/images/delete?objectKey=${objectKey}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (imageDeleteResponse.ok) {
      const imageDelete = (await imageDeleteResponse.json()) as Promise<ISupervisionImage>;
      console.log("deleteImage response", imageDelete);
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
    throw new Error(err as string);
  }
};
