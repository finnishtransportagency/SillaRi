import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import INetworkStatus from "../interfaces/INetworkStatus";

interface IStateProps {
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  networkStatus: {
    isFailed: {},
  },
};

const supervisionSlice = createSlice({
  name: "supervision",
  initialState,
  reducers: {
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      // console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
  },
});

export const { actions } = supervisionSlice;
export default supervisionSlice;
