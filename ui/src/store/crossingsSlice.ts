import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICompany from "../interfaces/ICompany";
import ICompanies from "../interfaces/ICompanies";
import IAuthorization from "../interfaces/IAuthorization";
import ITab from "../interfaces/ITab";
import IRoute from "../interfaces/IRoute";
import ISelectRoute from "../interfaces/ISelectRoute";
import ISelectCrossing from "../interfaces/ISelectCrossing";
import IStartCrossing from "../interfaces/IStartCrossing";
import IRadioValue from "../interfaces/IRadioValue";

interface IStateProps {
  Companies: ICompany[];
  selectedCompany: number;
  selectedAuthorization: number;
  selectedRoute: number;
  selectedCrossing: number;
  loaded: boolean;
  tabName: string;
}

const initialState: IStateProps = {
  Companies: [],
  selectedCompany: 0,
  selectedAuthorization: 0,
  selectedRoute: 0,
  selectedCrossing: 0,
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
    },
    START_CROSSING: (state, action: PayloadAction<IStartCrossing>) => {
      const crossing =
        state.Companies[state.selectedCompany].authorizations[state.selectedAuthorization].routes[state.selectedRoute].crossings[
          state.selectedCrossing
        ];
      // eslint-disable-next-line no-param-reassign
      state.tabName = "crossing";
      crossing.started = new Date().toLocaleString();
    },
    SELECT_CROSSING: (state, action: PayloadAction<ISelectCrossing>) => {
      // eslint-disable-next-line no-param-reassign
      state.selectedCrossing = action.payload.selectedCrossings;
      // eslint-disable-next-line no-param-reassign
      state.tabName = "viewcrossing";
    },
    SELECT_ROUTE: (state, action: PayloadAction<ISelectRoute>) => {
      // eslint-disable-next-line no-param-reassign
      state.selectedAuthorization = action.payload.authorization;
      // eslint-disable-next-line no-param-reassign
      state.selectedRoute = action.payload.route;
      // eslint-disable-next-line no-param-reassign
      state.selectedCompany = action.payload.company;
      // eslint-disable-next-line no-param-reassign
      state.tabName = "route";
    },
    SELECT_COMPANY: (state, action: PayloadAction<ICompany>) => {
      // eslint-disable-next-line no-param-reassign
      state.selectedCompany = action.payload.id;
      // eslint-disable-next-line no-param-reassign
      state.tabName = "authorizations";
    },
    GET_COMPANIES: (state, action: PayloadAction<ICompanies>) => {
      // eslint-disable-next-line no-param-reassign
      state.Companies = action.payload.Companies;
      // eslint-disable-next-line no-param-reassign
      state.loaded = true;
      // eslint-disable-next-line no-param-reassign
      state.tabName = "companies";
    },
    SELECT_TAB: (state, action: PayloadAction<ITab>) => {
      // eslint-disable-next-line no-param-reassign
      state.tabName = action.payload.tabName;
    },
  },
});

export const { actions } = crossingsSlice;
export default crossingsSlice;
