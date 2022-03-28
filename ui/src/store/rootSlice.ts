import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import IFailedQueryStatus from "../interfaces/IFailedQueryStatus";
import INetworkStatus from "../interfaces/INetworkStatus";

interface IStateProps {
  networkStatus: INetworkStatus;
  selectedManagementPermitId?: number;
  selectedSupervisionListType?: string;
}

const initialState: IStateProps = {
  networkStatus: {
    isFailed: {},
    failedStatus: {},
  },
  selectedManagementPermitId: undefined,
  selectedSupervisionListType: undefined,
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      // console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
    SET_FAILED_QUERY_STATUS: (state, action: PayloadAction<{ failedQuery: IFailedQuery; failedQueryStatus: IFailedQueryStatus }>) => {
      // console.log("SET_FAILED_QUERY_STATUS", action.payload);
      return {
        ...state,
        networkStatus: {
          ...state.networkStatus,
          isFailed: { ...state.networkStatus.isFailed, ...action.payload.failedQuery },
          failedStatus: { ...state.networkStatus.failedStatus, ...action.payload.failedQueryStatus },
        },
      };
    },
    SET_MANAGEMENT_PERMIT_ID: (state, action: PayloadAction<number | undefined>) => {
      // console.log("SET_MANAGEMENT_PERMIT_ID", action.payload);
      return { ...state, selectedManagementPermitId: action.payload };
    },
    SET_SUPERVISION_LIST_TYPE: (state, action: PayloadAction<string | undefined>) => {
      // console.log("SET_SUPERVISION_LIST_TYPE", action.payload);
      return { ...state, selectedSupervisionListType: action.payload };
    },
  },
});

export const { actions } = rootSlice;
export default rootSlice;
