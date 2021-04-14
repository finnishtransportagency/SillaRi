import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import IRadioValue from "../interfaces/IRadioValue";
import IImageItem from "../interfaces/IImageItem";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import ICompanyList from "../interfaces/ICompanyList";
import ICrossing from "../interfaces/ICrossing";
import IRoute from "../interfaces/IRoute";
import IRouteDetail from "../interfaces/IRouteDetail";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import IPermit from "../interfaces/IPermit";
import IPermitDetail from "../interfaces/IPermitDetail";
import ICrossingDetail from "../interfaces/ICrossingDetails";
import ICrossingUpdate from "../interfaces/ICrossingUpdate";
import IGetCrossing from "../interfaces/IGetCrossing";
import IRouteBridge from "../interfaces/IRouteBridge";

interface IStateProps {
  Companies: ICompany[];
  companyList: ICompany[];
  selectedCompany: number;
  selectedCompanyDetail?: ICompany;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IRouteBridge;
  selectedCrossingDetail?: ICrossing;
  selectedPermitDetail?: IPermit;
  images: IImageItem[];
  selectedPermit: number;
  selectedRoute: number;
  selectedCrossing: number;
  crossing?: ICrossing;
}

const initialState: IStateProps = {
  Companies: [],
  companyList: [],
  selectedCompany: 0,
  selectedCompanyDetail: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  selectedCrossingDetail: undefined,
  selectedPermitDetail: undefined,
  images: [],
  selectedPermit: 0,
  selectedRoute: 0,
  selectedCrossing: 0,
  crossing: undefined,
};

const crossingsSlice = createSlice({
  name: "selectedCrossing",
  initialState,
  reducers: {
    GET_PERMIT: (state, action: PayloadAction<IPermitDetail>) => {
      return { ...state, selectedPermitDetail: action.payload.Permit };
    },
    GET_BRIDGE: (state, action: PayloadAction<IBridgeDetail>) => {
      return { ...state, selectedBridgeDetail: action.payload.RouteBridge };
    },
    GET_ROUTE: (state, action: PayloadAction<IRouteDetail>) => {
      return { ...state, selectedRouteDetail: action.payload.Route };
    },
    SAVE_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      return { ...state, images: action.payload };
    },
    CROSSING_TEXTAREA_CHANGED: (state, action: PayloadAction<ITextAreaValue>) => {
      const { selectedCrossingDetail } = state;
      if (selectedCrossingDetail !== undefined) {
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
      const { selectedCrossingDetail } = state;
      if (selectedCrossingDetail !== undefined) {
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
    START_CROSSING: (state, action: PayloadAction<ICrossingDetail>) => {
      // TODO - use action.payload.crossing?
      console.log("START_CROSSING");
      return { ...state, selectedCrossingDetail: action.payload.startCrossing };
    },
    GET_CROSSING: (state, action: PayloadAction<IGetCrossing>) => {
      console.log("GET_CROSSING");
      return { ...state, selectedCrossingDetail: action.payload.Crossing };
    },
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompanyList>) => {
      return { ...state, companyList: action.payload.CompanyList };
    },
    GET_COMPANY: (state, action: PayloadAction<ICompanyDetail>) => {
      return { ...state, selectedCompanyDetail: action.payload.Company };
    },
    CROSSING_SAVED: (state, action: PayloadAction<ICrossingUpdate>) => {
      alert("Talletettu");
    },
    CROSSING_SUMMARY: (state, action: PayloadAction<ICrossingUpdate>) => {
      console.log("CROSSING_SUMMARY");
      return { ...state, loading: false, selectedCrossingDetail: action.payload.updateCrossing };
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
