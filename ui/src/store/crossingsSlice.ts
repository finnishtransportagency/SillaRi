import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import IRadioValue from "../interfaces/IRadioValue";
import IImageItem from "../interfaces/IImageItem";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ICrossing from "../interfaces/ICrossing";
import IRoute from "../interfaces/IRoute";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";

interface IStateProps {
  companyList: ICompany[];
  selectedCompanyDetail?: ICompany;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IRouteBridge;
  selectedCrossingDetail?: ICrossing;
  selectedPermitDetail?: IPermit;
  images: IImageItem[];
}

const initialState: IStateProps = {
  companyList: [],
  selectedCompanyDetail: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  selectedCrossingDetail: undefined,
  selectedPermitDetail: undefined,
  images: [],
};

const crossingsSlice = createSlice({
  name: "selectedCrossing",
  initialState,
  reducers: {
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompany[]>) => {
      return { ...state, companyList: action.payload };
    },
    GET_COMPANY: (state, action: PayloadAction<ICompany>) => {
      return { ...state, selectedCompanyDetail: action.payload };
    },
    GET_PERMIT: (state, action: PayloadAction<IPermit>) => {
      return { ...state, selectedPermitDetail: action.payload };
    },
    GET_ROUTE: (state, action: PayloadAction<IRoute>) => {
      return { ...state, selectedRouteDetail: action.payload };
    },
    GET_ROUTE_BRIDGE: (state, action: PayloadAction<IRouteBridge>) => {
      return { ...state, selectedBridgeDetail: action.payload };
    },
    CROSSING_TEXTAREA_CHANGED: (state, action: PayloadAction<ITextAreaValue>) => {
      console.log("CROSSING_TEXTAREA_CHANGED", action.payload);
      const { selectedCrossingDetail } = state;
      if (selectedCrossingDetail) {
        if (action.payload.name === "extraInfoDescription") {
          selectedCrossingDetail.extraInfoDescription = action.payload.value;
        } else if (action.payload.name === "speedInfoDescription") {
          selectedCrossingDetail.speedInfoDescription = action.payload.value;
        } else if (action.payload.name === "drivingLineInfoDescription") {
          selectedCrossingDetail.drivingLineInfoDescription = action.payload.value;
        } else if (action.payload.name === "exceptionsInfoDescription") {
          selectedCrossingDetail.exceptionsInfoDescription = action.payload.value;
        }
      }
    },
    CROSSING_RADIO_CHANGED: (state, action: PayloadAction<IRadioValue>) => {
      console.log("CROSSING_RADIO_CHANGED", action.payload);
      const { selectedCrossingDetail } = state;
      if (selectedCrossingDetail) {
        if (action.payload.name === "drivingLineInfo") {
          selectedCrossingDetail.drivingLineInfo = action.payload.value;
        } else if (action.payload.name === "speedInfo") {
          selectedCrossingDetail.speedInfo = action.payload.value;
        } else if (action.payload.name === "exceptionsInfo") {
          selectedCrossingDetail.exceptionsInfo = action.payload.value;
        } else if (action.payload.name === "someThingElse") {
          selectedCrossingDetail.describe = action.payload.value;
        } else if (action.payload.name === "twist") {
          selectedCrossingDetail.twist = action.payload.value;
        } else if (action.payload.name === "permantBendings") {
          selectedCrossingDetail.permanentBendings = action.payload.value;
        } else if (action.payload.name === "damage") {
          selectedCrossingDetail.damage = action.payload.value;
        }
      }
    },
    GET_CROSSING: (state, action: PayloadAction<ICrossing>) => {
      console.log("GET_CROSSING", action.payload);
      return { ...state, selectedCrossingDetail: action.payload };
    },
    START_CROSSING: (state, action: PayloadAction<ICrossing>) => {
      console.log("START_CROSSING", action.payload);
      return { ...state, selectedCrossingDetail: action.payload };
    },
    CROSSING_SUMMARY: (state, action: PayloadAction<ICrossing>) => {
      console.log("CROSSING_SUMMARY", action.payload);
      return { ...state, loading: false, selectedCrossingDetail: action.payload };
    },
    SAVE_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      console.log("SAVE_IMAGES", action.payload);
      return { ...state, images: action.payload };
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
