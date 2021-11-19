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

export const getCompanyTransportsList = async (dispatch: Dispatch): Promise<ICompanyTransports[]> => {
  try {
    console.log("getCompanyTransportsList");
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: false } });

    const companyTransportsResponse = await fetch(`${getOrigin()}/api/company/getcompanytransportlistofsupervisor`);

    if (companyTransportsResponse.ok) {
      const companyTransportsList = (await companyTransportsResponse.json()) as Promise<ICompanyTransports[]>;
      return await companyTransportsList;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportOfSupervisor = async (routeTransportId: number, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    console.log("GetRouteTransportOfSupervisor", routeTransportId);
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(
      `${getOrigin()}/api/routetransport/getroutetransportofsupervisor?routeTransportId=${routeTransportId}`
    );

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
      return await routeTransport;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
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

export const getSupervisionList = async (dispatch: Dispatch): Promise<ISupervision[]> => {
  try {
    console.log("GetSupervisionList");
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: false } });

    const supervisionsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionsofsupervisor`);

    if (supervisionsResponse.ok) {
      const supervisions = (await supervisionsResponse.json()) as Promise<ISupervision[]>;
      return await supervisions;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
    throw new Error(err as string);
  }
};

export const getSupervision = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("GetSupervision", supervisionId);
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: false } });

    const supervisionResponse = await fetch(`${getOrigin()}/api/supervision/getsupervision?supervisionId=${supervisionId}`);

    if (supervisionResponse.ok) {
      const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
      return await supervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervision: true } });
    throw new Error(err as string);
  }
};

export const updateConformsToPermit = async (updateRequest: ISupervision, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("UpdateConformsToPermit", updateRequest);
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
      return await updatedSupervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
    throw new Error(err as string);
  }
};

export const startSupervision = async (report: ISupervisionReport, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("StartSupervision", report);
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: false } });

    const startSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/startsupervision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });

    if (startSupervisionResponse.ok) {
      const startedSupervision = (await startSupervisionResponse.json()) as Promise<ISupervision>;
      return await startedSupervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { startSupervision: true } });
    throw new Error(err as string);
  }
};

export const cancelSupervision = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { cancelSupervision: false } });

    const cancelSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/cancelsupervision?supervisionId=${supervisionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (cancelSupervisionResponse.ok) {
      const cancelledSupervision = (await cancelSupervisionResponse.json()) as Promise<ISupervision>;
      return await cancelledSupervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { cancelSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { cancelSupervision: true } });
    throw new Error(err as string);
  }
};

export const denyCrossing = async (denyRequest: ISupervision, dispatch: Dispatch): Promise<ISupervision> => {
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
      return await supervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
    throw new Error(err as string);
  }
};

export const finishSupervision = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: false } });

    const finishSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/finishsupervision?supervisionId=${supervisionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (finishSupervisionResponse.ok) {
      const finishedSupervision = (await finishSupervisionResponse.json()) as Promise<ISupervision>;
      return await finishedSupervision;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
    throw new Error(err as string);
  }
};

export const updateSupervisionReport = async (updateRequest: ISupervisionReport, dispatch: Dispatch): Promise<ISupervision> => {
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
      return await updatedSupervision;
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

export const deleteImage = async (objectKey: string, dispatch: Dispatch): Promise<boolean> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: false } });

    const imageDeleteResponse = await fetch(`${getOrigin()}/api/images/delete?objectKey=${objectKey}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (imageDeleteResponse.ok) {
      const imageDeleteResult = (await imageDeleteResponse.json()) as Promise<boolean>;
      console.log("deleteImage response", imageDeleteResult);
      return await imageDeleteResult;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
    throw new Error(err as string);
  }
};

export const deleteSupervisionImages = async (supervisionId: number, dispatch: Dispatch): Promise<boolean> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteImage: deleteSupervisionImages } });

    const imageDeleteResponse = await fetch(`${getOrigin()}/api/images/deletesupervisionimages?supervisionId=${supervisionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (imageDeleteResponse.ok) {
      const imageDeleteResult = (await imageDeleteResponse.json()) as Promise<boolean>;
      console.log("deleteSupervisionImages response", imageDeleteResult);
      return await imageDeleteResult;
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteSupervisionImages: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { deleteSupervisionImages: true } });
    throw new Error(err as string);
  }
};
