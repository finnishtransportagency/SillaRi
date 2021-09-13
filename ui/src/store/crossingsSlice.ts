import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import ICrossing from "../interfaces/ICrossing";
import IFailedQuery from "../interfaces/IFailedQuery";
import IImageItem from "../interfaces/IImageItem";
import INetworkStatus from "../interfaces/INetworkStatus";
import IPermit from "../interfaces/IPermit";
import IRadioValue from "../interfaces/IRadioValue";
import IRoute from "../interfaces/IRoute";
import IRouteBridge from "../interfaces/IRouteBridge";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ISupervision from "../interfaces/ISupervision";

interface IStateProps {
  companyList: ICompany[];
  selectedCompanyDetail?: ICompany;
  selectedPermitDetail?: IPermit;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IRouteBridge;
  selectedSupervisionDetail?: ISupervision;
  selectedCrossingDetail?: ICrossing;
  images: IImageItem[];
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  companyList: [],
  selectedCompanyDetail: undefined,
  selectedPermitDetail: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  selectedSupervisionDetail: undefined,
  selectedCrossingDetail: undefined,
  images: [],
  networkStatus: {
    isFailed: {},
  },
};

const crossingsSlice = createSlice({
  name: "selectedCrossing",
  initialState,
  reducers: {
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompany[]>) => {
      console.log("GET_COMPANY_LIST", action.payload);
      return { ...state, companyList: action.payload };
    },
    GET_COMPANY: (state, action: PayloadAction<ICompany>) => {
      console.log("GET_COMPANY", action.payload);
      return { ...state, selectedCompanyDetail: action.payload };
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
    SUPERVISION_TEXTAREA_CHANGED: (state, action: PayloadAction<ITextAreaValue>) => {
      console.log("SUPERVISION_TEXTAREA_CHANGED", action.payload);
      const { selectedSupervisionDetail } = state;
      const { report } = selectedSupervisionDetail || {};
      if (selectedSupervisionDetail && report) {
        if (action.payload.name === "drivingLineInfo") {
          report.drivingLineInfo = action.payload.value;
        } else if (action.payload.name === "speedLimitInfo") {
          report.speedLimitInfo = action.payload.value;
        } else if (action.payload.name === "otherObservationsInfo") {
          report.otherObservationsInfo = action.payload.value;
        } else if (action.payload.name === "anomaliesDescription") {
          report.anomaliesDescription = action.payload.value;
        } else if (action.payload.name === "additionalInfo") {
          report.additionalInfo = action.payload.value;
        }
      }
    },
    SUPERVISION_RADIO_CHANGED: (state, action: PayloadAction<IRadioValue>) => {
      console.log("SUPERVISION_RADIO_CHANGED", action.payload);
      const { selectedSupervisionDetail } = state;
      const { report } = selectedSupervisionDetail || {};
      if (selectedSupervisionDetail && report) {
        if (action.payload.name === "drivingLineOk") {
          report.drivingLineOk = action.payload.value;
        } else if (action.payload.name === "speedLimitOk") {
          report.speedLimitOk = action.payload.value;
        } else if (action.payload.name === "anomalies") {
          report.anomalies = action.payload.value;
        } else if (action.payload.name === "surfaceDamage") {
          report.surfaceDamage = action.payload.value;
        } else if (action.payload.name === "seamDamage") {
          report.seamDamage = action.payload.value;
        } else if (action.payload.name === "bendsDisplacements") {
          report.bendsDisplacements = action.payload.value;
        } else if (action.payload.name === "otherObservations") {
          report.otherObservations = action.payload.value;
        }
      }
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
    GET_CROSSING: (state, action: PayloadAction<ICrossing>) => {
      console.log("GET_CROSSING", action.payload);
      return { ...state, selectedCrossingDetail: action.payload };
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
    SAVE_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      console.log("SAVE_IMAGES", action.payload);
      return { ...state, images: action.payload };
    },
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
