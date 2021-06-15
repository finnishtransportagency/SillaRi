import { Dispatch } from "redux";
import ICompany from "../interfaces/ICompany";
import ICrossing from "../interfaces/ICrossing";
import ICrossingInput from "../interfaces/ICrossingInput";
import IFile from "../interfaces/IFile";
import IFileInput from "../interfaces/IFileInput";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import { actions as crossingActions } from "../store/crossingsSlice";

export const getCompany = async (dispatch: Dispatch, companyId: number, payloadOnFailure?: ICompany | null): Promise<void> => {
  try {
    const companyResponse = await fetch(`/api/company/getcompany?companyId=${companyId}`);
    if (companyResponse.ok) {
      const company = (await companyResponse.json()) as Promise<ICompany>;
      dispatch({ type: crossingActions.GET_COMPANY, payload: company });
    } else {
      dispatch({ type: crossingActions.GET_COMPANY, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_COMPANY, payload: payloadOnFailure });
  }
};

export const getCompanyList = async (dispatch: Dispatch, payloadOnFailure?: ICompany[] | null): Promise<void> => {
  try {
    const companyListResponse = await fetch("/api/company/getcompanylist?limit=10");
    if (companyListResponse.ok) {
      const companyList = (await companyListResponse.json()) as Promise<ICompany[]>;
      dispatch({ type: crossingActions.GET_COMPANY_LIST, payload: companyList });
    } else {
      dispatch({ type: crossingActions.GET_COMPANY_LIST, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_COMPANY_LIST, payload: payloadOnFailure });
  }
};

export const getCrossing = async (dispatch: Dispatch, crossingId: number, payloadOnFailure?: ICrossing | null): Promise<void> => {
  try {
    const crossingResponse = await fetch(`/api/crossing/getcrossing?crossingId=${crossingId}`);
    if (crossingResponse.ok) {
      const crossing = (await crossingResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.GET_CROSSING, payload: crossing });
    } else {
      dispatch({ type: crossingActions.GET_CROSSING, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_CROSSING, payload: payloadOnFailure });
  }
};

export const getCrossingOfRouteBridge = async (dispatch: Dispatch, routeBridgeId: number, payloadOnFailure?: ICrossing | null): Promise<void> => {
  try {
    const crossingOfRouteBridgeResponse = await fetch(`/api/crossing/getcrossingofroutebridge?routeBridgeId=${routeBridgeId}`);
    if (crossingOfRouteBridgeResponse.ok) {
      const crossingOfRouteBridge = (await crossingOfRouteBridgeResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.GET_CROSSING, payload: crossingOfRouteBridge });
    } else {
      dispatch({ type: crossingActions.GET_CROSSING, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_CROSSING, payload: payloadOnFailure });
  }
};

export const sendCrossingStart = async (dispatch: Dispatch, routeBridgeId: number, payloadOnFailure?: ICrossing | null): Promise<void> => {
  try {
    const crossingStartResponse = await fetch(`/api/crossing/startcrossing?routeBridgeId=${routeBridgeId}`, {
      method: "POST",
    });
    if (crossingStartResponse.ok) {
      const crossingStart = (await crossingStartResponse.json()) as Promise<ICrossing>;
      dispatch({ type: crossingActions.START_CROSSING, payload: crossingStart });
    } else {
      dispatch({ type: crossingActions.START_CROSSING, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.START_CROSSING, payload: payloadOnFailure });
  }
};

export const sendCrossingUpdate = async (dispatch: Dispatch, updateRequest: ICrossingInput, payloadOnFailure?: ICrossing | null): Promise<void> => {
  try {
    const crossingUpdateResponse = await fetch("/api/crossing/updatecrossing", {
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
      dispatch({ type: crossingActions.CROSSING_SUMMARY, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.CROSSING_SUMMARY, payload: payloadOnFailure });
  }
};

export const sendSingleUpload = async (fileUpload: IFileInput): Promise<void> => {
  try {
    const singleUploadResponse = await fetch("/api/upload/singleupload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileUpload),
    });
    if (singleUploadResponse.ok) {
      const singleUpload = (await singleUploadResponse.json()) as Promise<IFile>;
      console.log("singleUpload", singleUpload);
    }
  } catch (err) {
    console.error("ERROR", err);
  }
};

export const getPermit = async (dispatch: Dispatch, permitId: number, payloadOnFailure?: IPermit | null): Promise<void> => {
  try {
    const permitResponse = await fetch(`/api/permit/getpermit?permitId=${permitId}`);
    if (permitResponse.ok) {
      const permit = (await permitResponse.json()) as Promise<IPermit>;
      dispatch({ type: crossingActions.GET_PERMIT, payload: permit });
    } else {
      dispatch({ type: crossingActions.GET_PERMIT, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_PERMIT, payload: payloadOnFailure });
  }
};

export const getRoute = async (dispatch: Dispatch, routeId: number, payloadOnFailure?: IRouteBridge | null): Promise<void> => {
  try {
    const routeResponse = await fetch(`/api/route/getroute?routeId=${routeId}`);
    if (routeResponse.ok) {
      const route = (await routeResponse.json()) as Promise<IRoute>;
      dispatch({ type: crossingActions.GET_ROUTE, payload: route });
    } else {
      dispatch({ type: crossingActions.GET_ROUTE, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_ROUTE, payload: payloadOnFailure });
  }
};

export const getRouteBridge = async (dispatch: Dispatch, routeBridgeId: number, payloadOnFailure?: IRouteBridge | null): Promise<void> => {
  try {
    const routeBridgeResponse = await fetch(`/api/routebridge/getroutebridge?routeBridgeId=${routeBridgeId}`);
    if (routeBridgeResponse.ok) {
      const routeBridge = (await routeBridgeResponse.json()) as Promise<IRouteBridge>;
      dispatch({ type: crossingActions.GET_ROUTE_BRIDGE, payload: routeBridge });
    } else {
      dispatch({ type: crossingActions.GET_ROUTE_BRIDGE, payload: payloadOnFailure });
    }
  } catch (err) {
    console.error("ERROR", err);
    dispatch({ type: crossingActions.GET_ROUTE_BRIDGE, payload: payloadOnFailure });
  }
};
