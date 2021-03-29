import React from "react";
import { IonLabel, IonList, IonCol, IonGrid, IonItem, IonButton, IonRow } from "@ionic/react";
import { useDispatch } from "react-redux";
import { actions as crossingActions } from "../../store/crossingsSlice";
import ITab from "../../interfaces/ITab";
import ISelectRoute from "../../interfaces/ISelectRoute";
import { RootState, useTypedSelector } from "../../store/store";
import Authorization from "./Authorization";

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthorizationList: React.FC = () => {
  const companiesProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const dispatch = useDispatch();
  function authorizationSelected(authorizationid: string) {
    console.log(`selected ${authorizationid}`);
  }
  function selectTab(tabNameParam: string) {
    const iTab = { tabName: tabNameParam, tabNumber: 1 } as ITab;
    dispatch({ type: crossingActions.SELECT_TAB, payload: iTab });
  }
  const company = companiesProps.Companies[companiesProps.selectedCompany];
  function selectRoute(authindex: number, routeindex: number) {
    const selectedRoute = {
      company: companiesProps.selectedCompany,
      authorization: authindex,
      route: routeindex,
    } as ISelectRoute;
    dispatch({
      type: crossingActions.SELECT_ROUTE,
      payload: selectedRoute,
    });
  }
  return (
    <IonList>
      <IonLabel>Yritys:</IonLabel>
      <IonItem color="secondary" key="companyName">
        {company.name}
      </IonItem>
      <IonItem>
        {company.authorizations.map((authorization, authindex) => (
          // eslint-disable-next-line react/jsx-key
          <Authorization
            companyId={authorization.companyId}
            routes={authorization.routes}
            id={authorization.id}
            permissionId={authorization.permissionId}
            validEndDate={authorization.validStartDate}
            validStartDate={authorization.validStartDate}
          />
          // eslint-disable-next-line react/jsx-key
          /*        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>Kuljetus:</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem color="secondary">{authorization.validStartDate}</IonItem>
              <IonItem color="secondary">{authorization.validEndDate}</IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {authorization.routes.map((route, routeindex) => (
                // eslint-disable-next-line react/jsx-key
                <IonGrid
                  onClick={() => {
                    selectRoute(authindex, routeindex);
                  }}
                >
                  <IonRow>
                    <IonCol>
                      <IonLabel>Reitti:</IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel slot="start">Alku</IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonItem key={`DT_${route.id}`} slot="start">
                        {route.departureTime}
                      </IonItem>
                    </IonCol>
                    <IonCol>
                      <IonItem color="primary" key={`D_${route.id}`} slot="start">
                        {route.departureAddress.street} {route.departureAddress.postalcode} {route.departureAddress.city}
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel slot="start">Loppu</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonItem color="primary" key={`aT_${route.id}`} slot="start">
                        {route.arrivalTime}
                      </IonItem>
                    </IonCol>
                    <IonCol>
                      <IonItem color="primary" key={`A_${route.id}`} slot="start">
                        {route.arrivalAddress.street} {route.arrivalAddress.postalcode} {route.arrivalAddress.city}
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              ))}
            </IonCol>
          </IonRow>
        </IonGrid> */
        ))}
      </IonItem>
    </IonList>
  );
};

export default AuthorizationList;
