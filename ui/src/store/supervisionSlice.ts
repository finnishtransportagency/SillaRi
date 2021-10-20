import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, current } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import IImageItem from "../interfaces/IImageItem";
import INetworkStatus from "../interfaces/INetworkStatus";
import IPermit from "../interfaces/IPermit";
import IRadioValue from "../interfaces/IRadioValue";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IRouteTransport from "../interfaces/IRouteTransport";

interface IStateProps {
  companyTransportsList: ICompanyTransports[];
  selectedRouteTransport?: IRouteTransport;
  selectedPermitDetail?: IPermit;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IRouteBridge;
  supervisionList: ISupervision[];
  selectedSupervisionDetail?: ISupervision;
  images: IImageItem[];
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  companyTransportsList: [],
  selectedRouteTransport: undefined,
  selectedPermitDetail: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  supervisionList: [],
  selectedSupervisionDetail: undefined,
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
    GET_PERMIT: (state, action: PayloadAction<IPermit>) => {
      console.log("GET_PERMIT", action.payload);
      return { ...state, selectedPermitDetail: action.payload };
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
    GET_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("GET_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    CREATE_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("CREATE_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    UPDATE_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("UPDATE_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    START_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("START_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    CANCEL_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("CANCEL_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    FINISH_SUPERVISION: (state, action: PayloadAction<ISupervision>) => {
      console.log("FINISH_SUPERVISION", action.payload);
      return { ...state, selectedSupervisionDetail: action.payload };
    },
    SUPERVISION_SUMMARY: (state, action: PayloadAction<ISupervision>) => {
      console.log("SUPERVISION_SUMMARY", action.payload);
      return { ...state, loading: false, selectedSupervisionDetail: action.payload };
    },
    REPORT_RADIO_CHANGED: (state, action: PayloadAction<IRadioValue>) => {
      const { selectedSupervisionDetail } = state;
      if (selectedSupervisionDetail && selectedSupervisionDetail.report) {
        if (action.payload.name === "drivingLineOk") {
          selectedSupervisionDetail.report.drivingLineOk = action.payload.value;
        } else if (action.payload.name === "speedLimitOk") {
          selectedSupervisionDetail.report.speedLimitOk = action.payload.value;
        } else if (action.payload.name === "anomalies") {
          selectedSupervisionDetail.report.anomalies = action.payload.value;
        } else if (action.payload.name === "surfaceDamage") {
          selectedSupervisionDetail.report.surfaceDamage = action.payload.value;
        } else if (action.payload.name === "jointDamage") {
          selectedSupervisionDetail.report.jointDamage = action.payload.value;
        } else if (action.payload.name === "bendOrDisplacement") {
          selectedSupervisionDetail.report.bendOrDisplacement = action.payload.value;
        } else if (action.payload.name === "otherObservations") {
          selectedSupervisionDetail.report.otherObservations = action.payload.value;
        }
      }
    },
    REPORT_TEXTAREA_CHANGED: (state, action: PayloadAction<ITextAreaValue>) => {
      const { selectedSupervisionDetail } = state;
      if (selectedSupervisionDetail && selectedSupervisionDetail.report) {
        if (action.payload.name === "drivingLineInfo") {
          selectedSupervisionDetail.report.drivingLineInfo = action.payload.value;
        } else if (action.payload.name === "speedLimitInfo") {
          selectedSupervisionDetail.report.speedLimitInfo = action.payload.value;
        } else if (action.payload.name === "otherObservationsInfo") {
          selectedSupervisionDetail.report.otherObservationsInfo = action.payload.value;
        } else if (action.payload.name === "anomaliesDescription") {
          selectedSupervisionDetail.report.anomaliesDescription = action.payload.value;
        } else if (action.payload.name === "additionalInfo") {
          selectedSupervisionDetail.report.additionalInfo = action.payload.value;
        }
      }
    },
    SAVE_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      console.log("SAVE_IMAGES", action.payload);
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
