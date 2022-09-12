import type { Dispatch } from "redux";
import moment from "moment";
import { getOrigin } from "./request";
import { FORBIDDEN_ERROR, NETWORK_RESPONSE_NOT_OK, SupervisionListType } from "./constants";
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
import { constructStorageKey, getPasswordAndIdFromStorage, getPasswordFromStorage } from "./trasportCodeStorageUtil";
import { createCustomError, createErrorFromStatusCode } from "./backendData";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";
import IKeyValue from "../interfaces/IKeyValue";
import ISupervisionInput from "../interfaces/ISupervisionInput";

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

export const getRouteTransportOfSupervisor = async (
  routeTransportId: number,
  username: string,
  transportCode: string | null,
  dispatch: Dispatch
): Promise<IRouteTransport> => {
  try {
    console.log("GetRouteTransportOfSupervisor", routeTransportId);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: false } });

    // Use transportCode if already fetched, otherwise get from storage
    const code = transportCode ? transportCode : await getPasswordFromStorage(username, SupervisionListType.TRANSPORT, routeTransportId);

    if (code) {
      const routeTransportResponse = await fetch(
        `${getOrigin()}/api/routetransport/getroutetransportofsupervisor?routeTransportId=${routeTransportId}&transportCode=${code}`
      );

      if (routeTransportResponse.ok) {
        const routeTransport = (await routeTransportResponse.json()) as Promise<IRouteTransport>;
        return await routeTransport;
      } else {
        console.log(`getRouteTransportOfSupervisor with routeTransportId ${routeTransportId} backend fail, status ${routeTransportResponse.status}`);
        dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });

        //if storage has old or tampered transport code -> remove it
        if (routeTransportResponse.status === 403) {
          console.log(`getRouteTransportOfSupervisor with routeTransportId ${routeTransportId} incorrect transportCode`);
          await Storage.remove({ key: constructStorageKey(username, SupervisionListType.TRANSPORT, routeTransportId) });
        }
        throw createErrorFromStatusCode(routeTransportResponse.status);
      }
    } else {
      console.log(`getRouteTransportOfSupervisor with routeTransportId ${routeTransportId} missing transportCode`);
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(FORBIDDEN_ERROR);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
    throw createCustomError(err);
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

export const getSupervisionListAreaContractor = async (dispatch: Dispatch): Promise<ISupervision[]> => {
  try {
    console.log("GetACSupervisionList");
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervisionList: false } });

    const supervisionsResponse = await fetch(`${getOrigin()}/api/supervision/getsupervisionsofareacontractorsupervisor`);

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

export const getSupervision = async (
  supervisionId: number,
  username: string,
  transportCode: string | null,
  dispatch: Dispatch
): Promise<ISupervision> => {
  try {
    console.log("GetSupervision", supervisionId);
    console.log("Klockan är: ", Date.now());
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: false } });

    // Use transportCode if already fetched, otherwise get from storage
    const code = transportCode ? transportCode : await getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId);

    if (code) {
      const supervisionResponse = await fetch(`${getOrigin()}/api/supervision/getsupervision?supervisionId=${supervisionId}&transportCode=${code}`);

      if (supervisionResponse.ok) {
        const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
        return await supervision;
      } else {
        // If storage has old or tampered transport code -> remove it
        if (supervisionResponse.status === 403) {
          console.log(`getSupervision with supervisionId ${supervisionId} incorrect transportCode`);
          await Storage.remove({ key: constructStorageKey(username, SupervisionListType.BRIDGE, supervisionId) });
        }

        dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
        throw createErrorFromStatusCode(supervisionResponse.status);
      }
    } else {
      console.log(`getSupervision with supervisionId ${supervisionId} missing transportCode`);
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getRouteTransport: true } });
      throw new Error(FORBIDDEN_ERROR);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
    throw createCustomError(err);
  }
};

export const getSupervisionNoPasscode = async (supervisionId: number, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("GetSupervisionNoPASS", supervisionId);
    console.log("Klockan är: ", Date.now());
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: false } });
    const supervisionResponse = await fetch(`${getOrigin()}/api/supervision/getsupervision?supervisionId=${supervisionId}`);
    if (supervisionResponse.ok) {
      const supervision = (await supervisionResponse.json()) as Promise<ISupervision>;
      return await supervision;
    } else {
      dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
      throw createErrorFromStatusCode(supervisionResponse.status);
    }
  } catch (err) {
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { getSupervision: true } });
    throw createCustomError(err);
  }
};

export const updateConformsToPermit = async (updateRequest: ISupervision, username: string, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("UpdateConformsToPermit", updateRequest);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateConformsToPermit: false } });

    const transportCode = await getPasswordFromStorage(username, SupervisionListType.TRANSPORT, updateRequest.routeTransportId);

    const updateSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/updateconformstopermit?transportCode=${transportCode}`, {
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

export const startSupervision = async (startCrossingInput: IStartCrossingInput, username: string, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("StartSupervision", startCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { startSupervision: false } });

    // The time can't be used as a parameter in this case since there is a post body, so include it in the body instead
    const { initialReport, routeTransportId, startTime } = startCrossingInput;
    const report = { ...initialReport, startTime };

    const transportCode = await getPasswordFromStorage(username, SupervisionListType.BRIDGE, startCrossingInput.initialReport.supervisionId);
    const transportCodeParam = transportCode ? transportCode : "";
    const routeTransportIdParam = routeTransportId ? routeTransportId : "";

    const startSupervisionResponse = await fetch(
      `${getOrigin()}/api/supervision/startsupervision?routeTransportId=${routeTransportIdParam}&transportCode=${transportCodeParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      }
    );

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

export const cancelSupervision = async (cancelCrossingInput: ICancelCrossingInput, username: string, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("CancelSupervision", cancelCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { cancelSupervision: false } });

    const { supervisionId, routeTransportId, cancelTime } = cancelCrossingInput;
    const time = encodeURIComponent(moment(cancelTime).format());

    const transportCode = await getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId);

    const supervisionInput: ISupervisionInput = {
      supervisionId: supervisionId,
      routeTransportId: routeTransportId,
      transportCode: transportCode,
    };

    const cancelSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/cancelsupervision?cancelTime=${time}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supervisionInput),
    });

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

export const denyCrossing = async (denyCrossingInput: IDenyCrossingInput, username: string, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("DenyCrossing", denyCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { denyCrossing: false } });

    const { supervisionId, routeTransportId, denyReason, denyTime } = denyCrossingInput;
    const time = encodeURIComponent(moment(denyTime).format());

    const transportCode = await getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId);

    const supervisionInput: ISupervisionInput = {
      supervisionId: supervisionId,
      routeTransportId: routeTransportId,
      transportCode: transportCode,
    };

    const denyCrossingResponse = await fetch(`${getOrigin()}/api/supervision/denycrossing?denyReason=${denyReason}&denyTime=${time}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supervisionInput),
    });

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

export const finishSupervision = async (finishCrossingInput: IFinishCrossingInput, username: string, dispatch: Dispatch): Promise<ISupervision> => {
  try {
    console.log("FinishSupervision", finishCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { finishSupervision: false } });

    const { supervisionId, routeTransportId, finishTime } = finishCrossingInput;
    const time = encodeURIComponent(moment(finishTime).format());

    const transportCode = await getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId);

    const supervisionInput: ISupervisionInput = {
      supervisionId: supervisionId,
      routeTransportId: routeTransportId,
      transportCode: transportCode,
    };

    const finishSupervisionResponse = await fetch(`${getOrigin()}/api/supervision/finishsupervision?finishTime=${time}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supervisionInput),
    });

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

export const completeSupervisions = async (completeCrossingInput: ICompleteCrossingInput, username: string, dispatch: Dispatch): Promise<void> => {
  try {
    console.log("CompleteSupervisions", completeCrossingInput);
    dispatch({ type: actions.SET_FAILED_QUERY, payload: { completeSupervisions: false } });

    // SupervisionInputs have only supervisions at this point
    const { supervisionInputs, completeTime } = completeCrossingInput;

    // Fetch transportCode from storage for each supervision
    const idsAndTransportCodes: IKeyValue[] = await Promise.all(
      supervisionInputs.map((input) => getPasswordAndIdFromStorage(username, SupervisionListType.BRIDGE, input.supervisionId))
    );

    // Map transportCodes from supervisionIds to supervisionInputs
    const completeSupervisionInputs = supervisionInputs.map((input) => {
      const codeResult = idsAndTransportCodes.find((kv) => input.supervisionId === kv.key);
      return codeResult ? { ...input, transportCode: codeResult.value } : input;
    });

    const time = encodeURIComponent(moment(completeTime).format());

    const completeSupervisionsResponse = await fetch(`${getOrigin()}/api/supervision/completesupervisions?completeTime=${time}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completeSupervisionInputs),
    });

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

export const updateSupervisionReport = async (
  updateRequest: ISupervisionReport,
  routeTransportId: number,
  username: string,
  dispatch: Dispatch
): Promise<ISupervision> => {
  try {
    console.log("UpdateSupervisionReport", updateRequest);
    const transportCode = await getPasswordFromStorage(username, SupervisionListType.BRIDGE, updateRequest.supervisionId);

    dispatch({ type: actions.SET_FAILED_QUERY, payload: { updateSupervisionReport: false } });

    const updateReportResponse = await fetch(
      `${getOrigin()}/api/supervision/updatesupervisionreport?routeTransportId=${routeTransportId}&transportCode=${transportCode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequest),
      }
    );

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
    const transportCodeHash = SHA1(`${username}${transportCode}`).toString();
    console.log(transportCodeHash);

    const transportCodeResponse = await fetch(
      `${getOrigin()}/api/routetransport/checkTransportCode?routeTransportId=${routeTransportId}&transportCode=${transportCodeHash}`
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
