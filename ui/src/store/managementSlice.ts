import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import INetworkStatus from "../interfaces/INetworkStatus";
import ICompany from "../interfaces/ICompany";
import IPermit from "../interfaces/IPermit";
import IRoute from "../interfaces/IRoute";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervisor from "../interfaces/ISupervisor";

interface IStateProps {
  routeTransportList: IRouteTransport[];
  supervisorList: ISupervisor[];
  selectedCompanyDetail?: ICompany;
  selectedPermitDetail?: IPermit;
  selectedRouteTransportDetail: { [routeTransportId: number]: IRouteTransport };
  modifiedRouteTransportDetail: { [routeTransportId: number]: IRouteTransport };
  selectedRouteOption: { [routeTransportId: number]: IRoute };
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  routeTransportList: [],
  supervisorList: [],
  selectedCompanyDetail: undefined,
  selectedPermitDetail: undefined,
  selectedRouteTransportDetail: {},
  modifiedRouteTransportDetail: {},
  selectedRouteOption: {},
  networkStatus: {
    isFailed: {},
  },
};

const managementSlice = createSlice({
  name: "management",
  initialState,
  reducers: {
    GET_COMPANY: (state, action: PayloadAction<ICompany>) => {
      console.log("GET_COMPANY", action.payload);
      return { ...state, selectedCompanyDetail: action.payload };
    },
    GET_PERMIT: (state, action: PayloadAction<IPermit>) => {
      console.log("GET_PERMIT", action.payload);
      return { ...state, selectedPermitDetail: action.payload };
    },
    GET_ROUTE_TRANSPORT_LIST: (state, action: PayloadAction<IRouteTransport[]>) => {
      console.log("GET_ROUTE_TRANSPORT_LIST", action.payload);
      return { ...state, routeTransportList: action.payload };
    },
    GET_ROUTE_TRANSPORT: (state, action: PayloadAction<IRouteTransport>) => {
      console.log("GET_ROUTE_TRANSPORT", action.payload);
      if (action.payload.id) {
        return { ...state, selectedRouteTransportDetail: { ...state.selectedRouteTransportDetail, [action.payload.id]: action.payload } };
      } else {
        return state;
      }
    },
    SET_MODIFIED_ROUTE_TRANSPORT_DETAIL: (state, action: PayloadAction<IRouteTransport>) => {
      console.log("SET_MODIFIED_ROUTE_TRANSPORT_DETAIL", action.payload);
      if (action.payload.id) {
        return { ...state, modifiedRouteTransportDetail: { ...state.modifiedRouteTransportDetail, [action.payload.id]: action.payload } };
      } else {
        return state;
      }
    },
    MODIFY_ROUTE_TRANSPORT: (state, action: PayloadAction<IRouteTransport>) => {
      // console.log("MODIFY_ROUTE_TRANSPORT", action.payload);
      if (state.modifiedRouteTransportDetail) {
        return {
          ...state,
          modifiedRouteTransportDetail: { ...state.modifiedRouteTransportDetail, ...action.payload },
        };
      } else {
        return state;
      }
    },
    GET_SUPERVISOR_LIST: (state, action: PayloadAction<ISupervisor[]>) => {
      console.log("GET_SUPERVISOR_LIST", action.payload);
      return { ...state, supervisorList: action.payload };
    },
    SET_SELECTED_ROUTE_OPTION: (state, action: PayloadAction<{ routeTransportId: number; route: IRoute }>) => {
      console.log("SET_SELECTED_ROUTE_OPTION", action.payload);
      if (action.payload.routeTransportId) {
        return { ...state, selectedRouteOption: { ...state.selectedRouteOption, [action.payload.routeTransportId]: action.payload.route } };
      } else {
        return state;
      }
    },
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      // console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
  },
});

export const { actions } = managementSlice;
export default managementSlice;
