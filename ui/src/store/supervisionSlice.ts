import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, current } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import IImageItem from "../interfaces/IImageItem";
import INetworkStatus from "../interfaces/INetworkStatus";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface IStateProps {
  companyTransportsList: ICompanyTransports[];
  selectedRouteTransport?: IRouteTransport;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IRouteBridge;
  supervisionList: ISupervision[];
  modifiedReport?: ISupervisionReport;
  images: IImageItem[];
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  companyTransportsList: [],
  selectedRouteTransport: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  supervisionList: [],
  modifiedReport: undefined,
  images: [],
  networkStatus: {
    isFailed: {},
  },
};

const supervisionSlice = createSlice({
  name: "supervision",
  initialState,
  reducers: {
    GET_COMPANY_TRANSPORTS_LIST: (state, action: PayloadAction<ICompanyTransports[]>) => {
      console.log("GET_COMPANY_TRANSPORTS_LIST", action.payload);
      return { ...state, companyTransportsList: action.payload };
    },
    GET_ROUTE_TRANSPORT: (state, action: PayloadAction<IRouteTransport>) => {
      console.log("GET_ROUTE_TRANSPORT", action.payload);
      return { ...state, selectedRouteTransport: action.payload };
    },
    GET_ROUTE: (state, action: PayloadAction<IRoute>) => {
      console.log("GET_ROUTE", action.payload);
      return { ...state, selectedRouteDetail: action.payload };
    },
    GET_ROUTE_BRIDGE: (state, action: PayloadAction<IRouteBridge>) => {
      console.log("GET_ROUTE_BRIDGE", action.payload);
      return { ...state, selectedBridgeDetail: action.payload };
    },
    GET_SUPERVISION_LIST: (state, action: PayloadAction<ISupervision[]>) => {
      console.log("GET_SUPERVISION_LIST", action.payload);
      return { ...state, supervisionList: action.payload };
    },
    SET_MODIFIED_REPORT: (state, action: PayloadAction<ISupervisionReport>) => {
      console.log("SET_MODIFIED_REPORT", action.payload);
      return { ...state, modifiedReport: action.payload };
    },
    SET_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      console.log("SET_IMAGES", action.payload);
      return { ...state, images: action.payload };
    },
    UPDATE_IMAGES: (state, action: PayloadAction<ISupervisionImage[]>) => {
      // Remove any camera images from the state that have been uploaded, and so are now in the supervision images
      console.log("UPDATE_IMAGES", action.payload);
      const supervisionImages = action.payload || [];
      const cameraImages = current(state.images).reduce((acc: IImageItem[], image) => {
        const isStateImageInPayload = supervisionImages.some((supervisionImage) => supervisionImage.filename === image.filename);
        return isStateImageInPayload ? acc : [...acc, image];
      }, []);
      console.log("CAMERA_IMAGES", cameraImages);
      return { ...state, images: cameraImages };
    },
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      // console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
  },
});

export const { actions } = supervisionSlice;
export default supervisionSlice;
