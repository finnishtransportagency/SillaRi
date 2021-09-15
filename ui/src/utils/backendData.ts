import { Dispatch } from "redux";
import ICompany from "../interfaces/ICompany";
import ICrossing from "../interfaces/ICrossing";
import ICrossingInput from "../interfaces/ICrossingInput";
import IFile from "../interfaces/IFile";
import IFileInput from "../interfaces/IFileInput";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import { getOrigin } from "./request";
import { actions as crossingActions } from "../store/crossingsSlice";

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
      dispatch({ type: crossingActions.GET_COMPANY, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompany: false } });

    const companyResponse = await fetch(`${getOrigin()}/api/company/getcompany?companyId=${companyId}`);

    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      dispatch({ type: crossingActions.GET_COMPANY, payload: company });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompany: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompany: true } });
    throw new Error(err as string);
  }
};

export const getCompanyList = async (dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompanyList: false } });

    const companyListResponse = await fetch(`${getOrigin()}/api/company/getcompanylist?limit=10`);

    if (companyListResponse.ok) {
      const companyList = (await companyListResponse.json()) as Promise<ICompany[]>;
      dispatch({ type: crossingActions.GET_COMPANY_LIST, payload: companyList });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompanyList: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCompanyList: true } });
    throw new Error(err as string);
  }
};

export const getCrossing = async (crossingId: number, dispatch: Dispatch, selectedCrossingDetail?: ICrossing): Promise<void> => {
  try {
    if (selectedCrossingDetail && selectedCrossingDetail.id !== crossingId) {
      dispatch({ type: crossingActions.GET_CROSSING, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossing: false } });

    const crossingResponse = await fetch(`${getOrigin()}/api/crossing/getcrossing?crossingId=${crossingId}`);

    if (crossingResponse.ok) {
      const crossing = (await crossingResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.GET_CROSSING, payload: crossing });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossing: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossing: true } });
    throw new Error(err as string);
  }
};

export const getCrossingOfRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: crossingActions.GET_CROSSING, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossingOfRouteBridge: false } });

    const crossingOfRouteBridgeResponse = await fetch(`${getOrigin()}/api/crossing/getcrossingofroutebridge?routeBridgeId=${routeBridgeId}`);

    if (crossingOfRouteBridgeResponse.ok) {
      const crossingOfRouteBridge = (await crossingOfRouteBridgeResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.GET_CROSSING, payload: crossingOfRouteBridge });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossingOfRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getCrossingOfRouteBridge: true } });
    throw new Error(err as string);
  }
};

export const sendCrossingStart = async (routeBridgeId: number, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingStart: false } });

    const crossingStartResponse = await fetch(`${getOrigin()}/api/crossing/startcrossing?routeBridgeId=${routeBridgeId}`, {
      method: "POST",
    });

    if (crossingStartResponse.ok) {
      const crossingStart = (await crossingStartResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.START_CROSSING, payload: crossingStart });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingStart: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingStart: true } });
    throw new Error(err as string);
  }
};

export const sendCrossingUpdate = async (updateRequest: ICrossingInput, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingUpdate: false } });

    console.log("SENDING CROSSING UPDATE", updateRequest);

    const crossingUpdateResponse = await fetch(`${getOrigin()}/api/crossing/updatecrossing`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRequest),
    });

    if (crossingUpdateResponse.ok) {
      const crossingUpdate = (await crossingUpdateResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.CROSSING_SUMMARY, payload: crossingUpdate });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingUpdate: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendCrossingUpdate: true } });
    throw new Error(err as string);
  }
};

export const sendImageUpload = async (fileUpload: IFileInput, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendImageUpload: false } });

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
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
    throw new Error(err as string);
  }
};

export const deleteImage = async (objectKey: string, dispatch: Dispatch): Promise<void> => {
  try {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { deleteImage: false } });

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
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { deleteImage: true } });
    throw new Error(err as string);
  }
};

export const getPermit = async (permitId: number, dispatch: Dispatch, selectedPermitDetail?: IPermit): Promise<void> => {
  try {
    if (selectedPermitDetail && selectedPermitDetail.id !== permitId) {
      dispatch({ type: crossingActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermit: false } });

    const permitResponse = await fetch(`${getOrigin()}/api/permit/getpermit?permitId=${permitId}`);

    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      dispatch({ type: crossingActions.GET_PERMIT, payload: permit });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermit: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermit: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRoute = async (routeId: number, dispatch: Dispatch, selectedRouteDetail?: IRoute): Promise<void> => {
  try {
    if (selectedRouteDetail && selectedRouteDetail.id !== routeId) {
      dispatch({ type: crossingActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: false } });

    const permitOfRouteResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroute?routeId=${routeId}`);

    if (permitOfRouteResponse.ok) {
      const permitOfRoute = (await permitOfRouteResponse.json()) as Promise<IPermit>;
      dispatch({ type: crossingActions.GET_PERMIT, payload: permitOfRoute });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRoute: true } });
    throw new Error(err as string);
  }
};

export const getPermitOfRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: crossingActions.GET_PERMIT, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: false } });

    const permitOfRouteBridgeResponse = await fetch(`${getOrigin()}/api/permit/getpermitofroutebridge?routeBridgeId=${routeBridgeId}`);

    if (permitOfRouteBridgeResponse.ok) {
      const permitOfRouteBridge = (await permitOfRouteBridgeResponse.json()) as Promise<IPermit>;
      dispatch({ type: crossingActions.GET_PERMIT, payload: permitOfRouteBridge });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getPermitOfRouteBridge: true } });
    throw new Error(err as string);
  }
};

export const getRoute = async (routeId: number, dispatch: Dispatch, selectedRouteDetail?: IRoute): Promise<void> => {
  try {
    if (selectedRouteDetail && selectedRouteDetail.id !== routeId) {
      dispatch({ type: crossingActions.GET_ROUTE, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRoute: false } });

    const routeResponse = await fetch(`${getOrigin()}/api/route/getroute?routeId=${routeId}`);

    if (routeResponse.ok) {
      const route = (await routeResponse.json()) as Promise<IRoute>;
      dispatch({ type: crossingActions.GET_ROUTE, payload: route });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRoute: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRoute: true } });
    throw new Error(err as string);
  }
};

export const getRouteBridge = async (routeBridgeId: number, dispatch: Dispatch, selectedBridgeDetail?: IRouteBridge): Promise<void> => {
  try {
    if (selectedBridgeDetail && selectedBridgeDetail.id !== routeBridgeId) {
      dispatch({ type: crossingActions.GET_ROUTE_BRIDGE, payload: undefined });
    }
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRouteBridge: false } });

    const routeBridgeResponse = await fetch(`${getOrigin()}/api/routebridge/getroutebridge?routeBridgeId=${routeBridgeId}`);

    if (routeBridgeResponse.ok) {
      const routeBridge = (await routeBridgeResponse.json()) as Promise<IRouteBridge>;
      dispatch({ type: crossingActions.GET_ROUTE_BRIDGE, payload: routeBridge });
    } else {
      dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
      throw new Error(notOkError);
    }
  } catch (err) {
    dispatch({ type: crossingActions.SET_FAILED_QUERY, payload: { getRouteBridge: true } });
    throw new Error(err as string);
  }
};
