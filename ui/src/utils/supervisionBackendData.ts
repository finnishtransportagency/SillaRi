import type { Dispatch } from "redux";
import moment from "moment";
import { getOrigin } from "./request";
import { NETWORK_RESPONSE_NOT_OK, SupervisionListType } from "./constants";
import { actions } from "../store/rootSlice";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IRouteTransport from "../interfaces/IRouteTransport";
import ICancelCrossingInput from "../interfaces/ICancelCrossingInput";
import ICompleteCrossingInput from "../interfaces/ICompleteCrossingInput";
import IDenyCrossingInput from "../interfaces/IDenyCrossingInput";
import IFinishCrossingInput from "../interfaces/IFinishCrossingInput";
import IStartCrossingInput from "../interfaces/IStartCrossingInput";
import { getUserData } from "./backendData";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";

export const getCompanyTransportsList = async (dispatch: Dispatch): Promise<ICompanyTransports[]> => {
  try {
    console.log("getCompanyTransportsList");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: false } });

    const companyTransportsResponse = await fetch(`${getOrigin()}/api/company/getcompanytransportlistofsupervisor`);

    if (companyTransportsResponse.ok) {
      const companyTransportsList = (await companyTransportsResponse.json()) as Promise<ICompanyTransports[]>;
      return await companyTransportsList;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getCompanyTransportsList: true } });
    throw new Error(err as string);
  }
};

export const getRouteTransportOfSupervisor = async (routeTransportId: number, dispatch: Dispatch): Promise<IRouteTransport> => {
  try {
    console.log("GetRouteTransportOfSupervisor", routeTransportId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    const routeTransportResponse = await fetch(
      `${getOrigin()}/api/routetransport/getroutetransportofsupervisor?routeTransportId=${routeTransportId}`
    );

    if (routeTransportResponse.ok) {
      const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
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

export const getSupervisionList = async (dispatch: Dispatch): Promise<ISupervision[]> => {
  try {
    console.log("GetSupervisionList");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionList: false } });

    const supervisionsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionsofsupervisor`);

    if (supervisionsResponse.ok) {
      const supervisions = (await supervisionsResponse.json()) as Promise<ISupervision[]>;
      return await supervisions;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionList: true } });
    throw new Error(err as string);
  }
};

export const getSupervisionSendingList = async (dispatch: Dispatch): Promise<ISupervision[]> => {
  try {
    console.log("getSupervisionSendingList");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionSendingList: false } });

    const supervisionsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionsendinglistofsupervisor`);

    if (supervisionsResponse.ok) {
      const supervisions = (await supervisionsResponse.json()) as Promise<ISupervision[]>;
      return await supervisions;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionSendingList: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionSendingList: true } });
    throw new Error(err as string);
  }
};

export const getSupervision = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("GetSupervision", supervisionId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: false } });

    // Get the user data from the cache when offline or the backend when online
    const { username } = await getUserData(dispatch);
    //console.log("username: " + username);
    const usernamePasswordHash = await Storage.get({ key: `${username}_${SupervisionListType.BRIDGE}_${supervisionId}` });
    //console.log(usernamePasswordHash);

    const supervisionResponse = await fetch(
      `${getOrigin()}/api/supervision/getsupervision?supervisionId=${supervisionId}&transportCode=${usernamePasswordHash.value}`
    );

    if (supervisionResponse.ok) {
      const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
      return await supervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
    throw new Error(err as string);
  }
};

export const updateConformsToPermit = async (updateRequest: ISupervision, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("UpdateConformsToPermit", updateRequest);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateConformsToPermit: false } });

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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateConformsToPermit: true } });
    throw new Error(err as string);
  }
};

export const startSupervision = async (startCrossingInput: IStartCrossingInput, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("StartSupervision", startCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { startSupervision: false } });

    // The time can't be used as a parameter in this case since there is a post body, so include it in the body instead
    const { initialReport, startTime } = startCrossingInput;
    const report = { ...initialReport, startTime };

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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { startSupervision: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { startSupervision: true } });
    throw new Error(err as string);
  }
};

export const cancelSupervision = async (cancelCrossingInput: ICancelCrossingInput, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("CancelSupervision", cancelCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { cancelSupervision: false } });

    const { supervisionId, cancelTime } = cancelCrossingInput;
    const time = encodeURIComponent(moment(cancelTime).format());

    const cancelSupervisionResponse = await fetch(
      `${getOrigin()}/api/supervision/cancelsupervision?supervisionId=${supervisionId}&cancelTime=${time}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (cancelSupervisionResponse.ok) {
      const cancelledSupervision = (await cancelSupervisionResponse.json()) as Promise<ISupervision>;
      return await cancelledSupervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { cancelSupervision: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { cancelSupervision: true } });
    throw new Error(err as string);
  }
};

export const denyCrossing = async (denyCrossingInput: IDenyCrossingInput, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("DenyCrossing", denyCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { denyCrossing: false } });

    const { supervisionId, denyReason, denyTime } = denyCrossingInput;
    const time = encodeURIComponent(moment(denyTime).format());

    const denyCrossingResponse = await fetch(
      `${getOrigin()}/api/supervision/denycrossing?supervisionId=${supervisionId}&denyReason=${denyReason}&denyTime=${time}`,
      {
        method: "POST",
      }
    );

    if (denyCrossingResponse.ok) {
      const supervision = (await denyCrossingResponse.json()) as Promise<ISupervision>;
      return await supervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { denyCrossing: true } });
    throw new Error(err as string);
  }
};

export const finishSupervision = async (finishCrossingInput: IFinishCrossingInput, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("FinishSupervision", finishCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { finishSupervision: false } });

    const { supervisionId, finishTime } = finishCrossingInput;
    const time = encodeURIComponent(moment(finishTime).format());

    const finishSupervisionResponse = await fetch(
      `${getOrigin()}/api/supervision/finishsupervision?supervisionId=${supervisionId}&finishTime=${time}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (finishSupervisionResponse.ok) {
      const finishedSupervision = (await finishSupervisionResponse.json()) as Promise<ISupervision>;
      return await finishedSupervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { finishSupervision: true } });
    throw new Error(err as string);
  }
};

export const completeSupervisions = async (completeCrossingInput: ICompleteCrossingInput, dispatch: Dispatch): Promise<void> => {
  try {
    console.log("CompleteSupervisions", completeCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { completeSupervisions: false } });

    const { supervisionIds, completeTime } = completeCrossingInput;
    const time = encodeURIComponent(moment(completeTime).format());

    const completeSupervisionsResponse = await fetch(
      `${getOrigin()}/api/supervision/completesupervisions?supervisionIds=${supervisionIds.join()}&completeTime=${time}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (completeSupervisionsResponse.ok) {
      // TODO - check if any data should be returned
      const completeSupervisionsResult = (await completeSupervisionsResponse.json()) as Promise<ISupervision>;
      console.log("completeSupervisions response", completeSupervisionsResult);
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { completeSupervisions: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { completeSupervisions: true } });
    throw new Error(err as string);
  }
};

export const updateSupervisionReport = async (updateRequest: ISupervisionReport, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("UpdateSupervisionReport", updateRequest);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateSupervisionReport: false } });

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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateSupervisionReport: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateSupervisionReport: true } });
    throw new Error(err as string);
  }
};

export const sendImageUpload = async (fileUpload: ISupervisionImage, dispatch: Dispatch): Promise<void> => {
  try {
    console.log("SendImageUpload");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { sendImageUpload: false } });

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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { sendImageUpload: true } });
    throw new Error(err as string);
  }
};

export const deleteImage = async (id: number, dispatch: Dispatch): Promise<boolean> => {
  try {
    console.log("DeleteImage");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteImage: false } });

    const imageDeleteResponse = await fetch(`${getOrigin()}/api/images/delete?id=${id}`, {
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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteImage: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteImage: true } });
    throw new Error(err as string);
  }
};

export const deleteSupervisionImages = async (supervisionId: number, dispatch: Dispatch): Promise<boolean> => {
  console.log("DeleteSupervisionImages", supervisionId);
  try {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteImage: deleteSupervisionImages } });

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
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteSupervisionImages: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { deleteSupervisionImages: true } });
    throw new Error(err as string);
  }
};

export const checkTransportCode = async (username: string, routeTransportId: number, transportCode: string, dispatch: Dispatch): Promise<boolean> => {
  try {
    console.log("checkTransportCode", routeTransportId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { checkTransportCode: false } });

    console.log("username: " + username);
    const usernamePasswordHash = SHA1(`${username}${transportCode}`).toString();
    console.log(usernamePasswordHash);

    const transportCodeResponse = await fetch(
      `${getOrigin()}/api/routetransport/checkTransportCode?routeTransportId=${routeTransportId}&usernameAndPasswordHashed=${usernamePasswordHash}`
    );

    if (transportCodeResponse.ok) {
      const transportCodeOk = (await transportCodeResponse.json()) as Promise<boolean>;
      return await transportCodeOk;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { checkTransportCode: true } });
      throw new Error(NETWORK_RESPONSE_NOT_OK);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { checkTransportCode: true } });
    throw new Error(err as string);
  }
};
