import type { Dispatch } from "redux";
import ICompany from "../interfaces/ICompany";
import IFile from "../interfaces/IFile";
import IFileInput from "../interfaces/IFileInput";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { getOrigin } from "./request";
import { actions as supervisionActions } from "../store/supervisionSlice";

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
      dispatch({ type: supervisionActions.GET_COMPANY, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompany: false } });

    const companyResponse = await fetch(`${getOrigin()}/api/company/getcompany?companyId=${companyId}`);

    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      dispatch({ type: supervisionActions.GET_COMPANY, payload: company });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompany: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompany: true } });
    throw new Error(err as string);
  }
};

export const getCompanyList = async (username: string, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyList: false } });

    const companyListResponse = await fetch(`${getOrigin()}/api/company/getcompanylist?username=${username}`);

    if (companyListResponse.ok) {
      const companyList = (await companyListResponse.json()) as Promise<ICompany[]>;
      dispatch({ type: supervisionActions.GET_COMPANY_LIST, payload: companyList });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getCompanyList: true } });
    throw new Error(err as string);
  }
};

export const getPermit = async (permitId: number, dispatch: Dispatch, selectedPermitDetail?: IPermit): Promise<void> => {
  try {
    if (selectedPermitDetail && selectedPermitDetail.id !== permitId) {
      dispatch({ type: supervisionActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermit: false } });

    const permitResponse = await fetch(`${getOrigin()}/api/permit/getpermit?permitId=${permitId}`);

    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      dispatch({ type: supervisionActions.GET_PERMIT, payload: permit });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermit: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRoute = async (routeId: number, dispatch: Dispatch, selectedRouteDetail?: IRoute): Promise<void> => {
  try {
    if (selectedRouteDetail && selectedRouteDetail.id !== routeId) {
      dispatch({ type: supervisionActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: false } });

    const permitOfRouteResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroute?routeId=${routeId}`);

    if (permitOfRouteResponse.ok) {
      const permitOfRoute = (await permitOfRouteResponse.json()) as Promise<IPermit>;
      dispatch({ type: supervisionActions.GET_PERMIT, payload: permitOfRoute });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: supervisionActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: false } });

    const permitOfRouteBridgeResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroutebridge?routeBridgeId=${routeBridgeId}`);

    if (permitOfRouteBridgeResponse.ok) {
      const permitOfRouteBridge = (await permitOfRouteBridgeResponse.json()) as Promise<IPermit>;
      dispatch({ type: supervisionActions.GET_PERMIT, payload: permitOfRouteBridge });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: true } });
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

export const getSupervisionOfRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: supervisionActions.GET_SUPERVISION, payload: undefined });
    }
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionOfRouteBridge: false } });

    const supervisionOfRouteBridgeResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionofroutebridge?routeBridgeId=${routeBridgeId}`);

    if (supervisionOfRouteBridgeResponse.ok) {
      const supervisionOfRouteBridge = (await supervisionOfRouteBridgeResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.GET_SUPERVISION, payload: supervisionOfRouteBridge });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionOfRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { getSupervisionOfRouteBridge: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionPlanned = async (createRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionPlanned: false } });

    const createSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/createSupervision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createRequest),
    });

    if (createSupervisionResponse.ok) {
      const plannedSupervision = (await createSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.CREATE_SUPERVISION, payload: plannedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionPlanned: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionPlanned: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionUpdate = async (updateRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionUpdate: false } });

    const updateSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/updatesupervision`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRequest),
    });

    if (updateSupervisionResponse.ok) {
      const updatedSupervision = (await updateSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.UPDATE_SUPERVISION, payload: updatedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionUpdate: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionUpdate: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionStarted = async (supervisionId: number, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionStarted: false } });

    const startSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/startsupervision?supervisionId=${supervisionId}`, {
      method: "POST",
    });

    if (startSupervisionResponse.ok) {
      const startedSupervision = (await startSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.START_SUPERVISION, payload: startedSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionStarted: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionStarted: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionCancelled = async (cancelRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionCancelled: false } });

    const cancelSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/cancelsupervision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cancelRequest),
    });

    if (cancelSupervisionResponse.ok) {
      const cancelledSupervision = (await cancelSupervisionResponse.json()) as Promise<ISupervision>;
      dispatch({ type: supervisionActions.CANCEL_SUPERVISION, payload: cancelledSupervision });
    } else {
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionCancelled: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionCancelled: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionFinished = async (finishRequest: ISupervision, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionFinished: false } });

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
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionFinished: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionFinished: true } });
    throw new Error(err as string);
  }
};

export const sendSupervisionReportUpdate = async (updateRequest: ISupervisionReport, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionReportUpdate: false } });

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
      dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionReportUpdate: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: supervisionActions.SET_FAILED_QUERY, payload: { sendSupervisionReportUpdate: true } });
    throw new Error(err as string);
  }
};

export const sendImageUpload = async (fileUpload: IFileInput, dispatch: Dispatch): Promise<void> => {
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
      const imageUpload = (await imageUploadResponse.json()) as Promise<IFile>;
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
      const imageDelete = (await imageDeleteResponse.json()) as Promise<IFile>;
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
