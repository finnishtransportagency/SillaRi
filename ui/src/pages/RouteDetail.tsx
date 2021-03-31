import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonList, IonPage, IonRow, IonText } from "@ionic/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import routeQuery from "../graphql/RouteQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import BridgeCardList from "../components/BridgeCardList";
import IAuthorization from "../interfaces/IAuthorization";
import authorizationQuery from "../graphql/AuthorizationQuery";
import IAuthorizationDetail from "../interfaces/IAuthorizationDetail";

interface RouteDetailProps {
  routeId: string;
  authorizationId: string;
}

const RouteDetail = ({ match }: RouteComponentProps<RouteDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedRouteDetail } = crossingsState;
  const { bridges = [], name = "", id } = selectedRouteDetail || {};
  const {
    params: { routeId, authorizationId },
  } = match;

  useQuery<IAuthorizationDetail>(authorizationQuery(Number(authorizationId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_AUTHORIZATION, payload: response }),
    onError: (err) => console.error(err),
  });
  useQuery<IRouteDetail>(routeQuery(Number(routeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_ROUTE, payload: response }),
    onError: (err) => console.error(err),
  });
  return (
    <IonPage>
      <Header title={name} />
      <IonContent>
        <div className="cardListContainer" />
        <BridgeCardList bridges={bridges} />
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
