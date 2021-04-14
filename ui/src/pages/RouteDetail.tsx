import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import { actions as crossingActions } from "../store/crossingsSlice";
import routeQuery from "../graphql/RouteQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import BridgeCardList from "../components/BridgeCardList";
import permitQuery from "../graphql/PermitQuery";
import IPermitDetail from "../interfaces/IPermitDetail";

interface RouteDetailProps {
  routeId: string;
  permitId: string;
}

const RouteDetail = ({ match }: RouteComponentProps<RouteDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedRouteDetail } = crossingsState;
  const { routeBridges = [], name = "", id } = selectedRouteDetail || {};
  const {
    params: { routeId, permitId },
  } = match;

  useQuery<IPermitDetail>(permitQuery(Number(permitId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_PERMIT, payload: response }),
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
        <BridgeCardList routeBridges={routeBridges} />
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
