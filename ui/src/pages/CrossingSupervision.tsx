import {
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonCheckbox,
  IonButton,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import store, { RootState, useTypedSelector } from "../store/store";
import CompaniesList from "./crossing/CompaniesList";
import client from "../service/apolloClient";
import ICompanies from "../interfaces/ICompanies";
import { companiesQuery } from "../graphql/CompanyQuery";
import AuthorizationList from "./crossing/AuthorizationList";
import { actions as crossingActions } from "../store/crossingsSlice";
import CrossingList from "./crossing/CrossingList";
import ViewCrossing from "./crossing/ViewCrossing";
import Crossing from "./crossing/Crossing";
import ITab from "../interfaces/ITab";

export const CrossingSupervision: React.FC = () => {
  const { t, i18n } = useTranslation();
  const companiesProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const dispatch = useDispatch();

  const onGetCompanies = (companies: ICompanies) => {
    dispatch({ type: crossingActions.GET_COMPANIES, payload: companies });
  };
  function parseCompanies(data: string) {
    return JSON.parse(JSON.stringify(data));
  }
  function previousTab() {
    let tabNameParam = "companies";
    if (companiesProps.tabName === "route") {
      tabNameParam = "authorizations";
    } else if (companiesProps.tabName === "viewcrossing") {
      tabNameParam = "route";
    } else if (companiesProps.tabName === "crossing") {
      tabNameParam = "viewcrossing";
    }
    const iTab = { tabName: tabNameParam, tabNumber: 1 } as ITab;
    dispatch({ type: crossingActions.SELECT_TAB, payload: iTab });
  }
  function getCompanies() {
    client
      .query({
        query: companiesQuery(),
        variables: { limit: 5 },
      })
      .then((response) => onGetCompanies(parseCompanies(response.data)))
      .catch((err) => console.error(err));
  }
  if (!companiesProps.loaded) {
    getCompanies();
  }

  return (
    <IonPage>
      <IonHeader title={t("crossing.title")}>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t("crossing.title")}</IonTitle>
          <IonButtons slot="end">
            {companiesProps.tabName === "companies" ? null : (
              <IonItem
                color="primary"
                button
                onClick={() => {
                  previousTab();
                }}
              >
                Takaisin
              </IonItem>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {companiesProps.tabName === "companies" ? <CompaniesList Companies={companiesProps.Companies} /> : null}
        {companiesProps.tabName === "authorizations" ? <AuthorizationList /> : null}
        {companiesProps.tabName === "route" ? <CrossingList /> : null}
        {companiesProps.tabName === "viewcrossing" ? <ViewCrossing /> : null}
        {companiesProps.tabName === "crossing" ? <Crossing /> : null}
      </IonContent>
    </IonPage>
  );
};

export default CrossingSupervision;
