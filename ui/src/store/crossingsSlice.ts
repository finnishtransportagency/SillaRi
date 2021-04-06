import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import IStartCrossing from "../interfaces/IStartCrossing";
import IRadioValue from "../interfaces/IRadioValue";
import ISelectCompany from "../interfaces/ISelectCompany";
import IImageItem from "../interfaces/IImageItem";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import ICompanyList from "../interfaces/ICompanyList";
import ICrossing from "../interfaces/ICrossing";
import IRoute from "../interfaces/IRoute";
import IRouteDetail from "../interfaces/IRouteDetail";
import IBridge from "../interfaces/IBridge";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import IAuthorization from "../interfaces/IAuthorization";
import IAuthorizationDetail from "../interfaces/IAuthorizationDetail";
import ICrossingDetail from "../interfaces/ICrossingDetails";
import ICrossingUpdate from "../interfaces/ICrossingUpdate";

interface IStateProps {
  Companies: ICompany[];
  companyList: ICompany[];
  selectedCompany: number;
  selectedCompanyDetail?: ICompany;
  selectedRouteDetail?: IRoute;
  selectedBridgeDetail?: IBridge;
  selectedCrossingDetail?: ICrossing;
  selectedAuthorizationDetail?: IAuthorization;
  images: IImageItem[];
  selectedAuthorization: number;
  selectedRoute: number;
  selectedCrossing: number;
  crossing?: ICrossing;
  loading: boolean;
}

const initialState: IStateProps = {
  Companies: [],
  companyList: [],
  selectedCompany: 0,
  selectedCompanyDetail: undefined,
  selectedRouteDetail: undefined,
  selectedBridgeDetail: undefined,
  selectedCrossingDetail: undefined,
  selectedAuthorizationDetail: undefined,
  images: [],
  selectedAuthorization: 0,
  selectedRoute: 0,
  selectedCrossing: 0,
  crossing: undefined,
  loading: false,
};

const crossingsSlice = createSlice({
  name: "selectedCrossing",
  initialState,
  reducers: {
    GET_AUTHORIZATION: (state, action: PayloadAction<IAuthorizationDetail>) => {
      return { ...state, selectedAuthorizationDetail: action.payload.Authorization };
    },
    GET_BRIDGE: (state, action: PayloadAction<IBridgeDetail>) => {
      return { ...state, selectedBridgeDetail: action.payload.Bridge };
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
      return { ...state, loading: false, selectedCrossingDetail: action.payload.startCrossing };
    },
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompanyList>) => {
      return { ...state, companyList: action.payload.CompanyList };
    },
    GET_COMPANY: (state, action: PayloadAction<ICompanyDetail>) => {
      return { ...state, selectedCompanyDetail: action.payload.Company };
    },
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      return { ...state, loading: action.payload };
    },
    CROSSING_SAVED: (state, action: PayloadAction<ICrossingUpdate>) => {
      alert("Talletettu");
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
