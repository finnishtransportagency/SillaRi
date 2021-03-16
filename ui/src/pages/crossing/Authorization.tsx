import React from "react";
import { IonGrid, IonList, IonRow, IonCol, IonItem, IonLabel } from "@ionic/react";
import { grid } from "ionicons/icons";
import { useDispatch } from "react-redux";
import IAuthorization from "../../interfaces/IAuthorization";
import TransportRoute from "./TransportRoute";
import ISelectRoute from "../../interfaces/ISelectRoute";
import { actions as crossingActions } from "../../store/crossingsSlice";
import { RootState, useTypedSelector } from "../../store/store";

export const Authorization: React.FC<IAuthorization> = (authorization: IAuthorization) => {
  const companiesProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const dispatch = useDispatch();
  function selectRoute(routeindex: number) {
    const selectedRoute = {
      company: companiesProps.selectedCompany,
      authorization: companiesProps.selectedAuthorization,
      route: routeindex,
    } as ISelectRoute;
    dispatch({
      type: crossingActions.SELECT_ROUTE,
      payload: selectedRoute,
    });
  }
  return (
    <IonList>
      <IonLabel>Kuljetus: {authorization.permissionId}</IonLabel>
      <IonItem color="secondary">{authorization.validStartDate}</IonItem>
      <IonItem color="secondary">{authorization.validEndDate}</IonItem>
      <IonItem class="routeGrid">
        <IonList>
          {authorization.routes.map((route, routeindex) => (
            // eslint-disable-next-line react/jsx-key
            <IonItem
              class="routeGrid"
              onClick={() => {
                selectRoute(routeindex);
              }}
            >
              <TransportRoute
                id={route.id}
                departureAddress={route.departureAddress}
                arrivalAddress={route.arrivalAddress}
                departureTime={route.departureTime}
                arrivalTime={route.arrivalTime}
                crossings={route.crossings}
              />
            </IonItem>
          ))}
        </IonList>
      </IonItem>
    </IonList>
  );
};

export default Authorization;
