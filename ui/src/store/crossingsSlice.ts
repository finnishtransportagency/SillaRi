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
        if (action.payload.name === "extrainfo") {
          selectedCrossingDetail.extraInfoDesc = action.payload.value;
        } else if (action.payload.name === "speedinfo") {
          selectedCrossingDetail.speedInfoDesc = action.payload.value;
        } else if (action.payload.name === "drivingline") {
          selectedCrossingDetail.drivingLineInfoDesc = action.payload.value;
        } else if (action.payload.name === "description") {
          selectedCrossingDetail.descriptionDesc = action.payload.value;
        } else if (action.payload.name === "exception") {
          selectedCrossingDetail.exceptionsInfoDesc = action.payload.value;
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
          selectedCrossingDetail.permantBendings = action.payload.value;
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
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompanyList>) => {
      return { ...state, companyList: action.payload.CompanyList };
    },
    GET_COMPANY: (state, action: PayloadAction<ICompanyDetail>) => {
      return { ...state, selectedCompanyDetail: action.payload.Company };
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
