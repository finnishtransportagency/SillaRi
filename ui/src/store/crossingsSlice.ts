import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import ICompanies from "../interfaces/ICompanies";
import ITab from "../interfaces/ITab";
import ISelectRoute from "../interfaces/ISelectRoute";
import ISelectCrossing from "../interfaces/ISelectCrossing";
import IStartCrossing from "../interfaces/IStartCrossing";
import IRadioValue from "../interfaces/IRadioValue";
import ISelectCompany from "../interfaces/ISelectCompany";
import ICrossing from "../interfaces/ICrossing";

interface IStateProps {
  Companies: ICompany[];
  companyList: ICompany[];
  selectedCompany: number;
  selectedAuthorization: number;
  selectedRoute: number;
  selectedCrossing: number;
  crossing?: ICrossing;
  loaded: boolean;
  tabName: string;
}

const initialState: IStateProps = {
  Companies: [],
  companyList: [],
  selectedCompany: 0,
  selectedAuthorization: 0,
  selectedRoute: 0,
  selectedCrossing: 0,
  crossing: undefined,
  loaded: false,
  tabName: "companies",
};

const crossingsSlice = createSlice({
  name: "selectedCrossing",
  initialState,
  reducers: {
    CROSSING_RADIO_CHANGED: (state, action: PayloadAction<IRadioValue>) => {
      const crossing =
        state.Companies[state.selectedCompany].authorizations[state.selectedAuthorization].routes[state.selectedRoute].crossings[
          state.selectedCrossing
        ];
      if (action.payload.name === "drivingLineInfo") {
        crossing.drivingLineInfo = action.payload.value;
      } else if (action.payload.name === "speedInfo") {
        crossing.speedInfo = action.payload.value;
      } else if (action.payload.name === "exceptionsInfo") {
        crossing.exceptionsInfo = action.payload.value;
      } else if (action.payload.name === "someThingElse") {
        crossing.describe = action.payload.value;
      } else if (action.payload.name === "twist") {
        crossing.twist = action.payload.value;
      } else if (action.payload.name === "permantBendings") {
        crossing.permantBendings = action.payload.value;
      } else if (action.payload.name === "damage") {
        crossing.damage = action.payload.value;
      }
      return { ...state, crossing };
    },
    START_CROSSING: (state, action: PayloadAction<IStartCrossing>) => {
      // TODO - use action.payload.crossing?
      const crossing = {
        ...state.Companies[state.selectedCompany].authorizations[state.selectedAuthorization].routes[state.selectedRoute].crossings[
          state.selectedCrossing
        ],
        started: new Date().toLocaleString(),
      };
      return { ...state, crossing, tabName: "crossing" };
    },
    SELECT_CROSSING: (state, action: PayloadAction<ISelectCrossing>) => {
      return { ...state, selectedCrossing: action.payload.selectedCrossings, tabName: "viewcrossing" };
    },
    SELECT_ROUTE: (state, action: PayloadAction<ISelectRoute>) => {
      return {
        ...state,
        selectedAuthorization: action.payload.authorization,
        selectedRoute: action.payload.route,
        selectedCompany: action.payload.company,
        tabName: "route",
      };
    },
    SELECT_COMPANY: (state, action: PayloadAction<ISelectCompany>) => {
      return { ...state, selectedCompany: action.payload.selectedCompany, tabName: "authorizations" };
    },
    GET_COMPANIES: (state, action: PayloadAction<ICompanies>) => {
      return { ...state, Companies: action.payload.Companies, loaded: true, tabName: "companies" };
    },
    GET_COMPANY_LIST: (state, action: PayloadAction<ICompanies>) => {
      return { ...state, companyList: action.payload.Companies };
    },
    SELECT_TAB: (state, action: PayloadAction<ITab>) => {
      return { ...state, tabName: action.payload.tabName };
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
