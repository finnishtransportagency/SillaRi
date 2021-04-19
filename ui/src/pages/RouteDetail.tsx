import React from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonCheckbox, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import { useQuery } from "@apollo/client";
import Header from "../components/Header";
import BridgeCardList from "../components/BridgeCardList";
import RoutePermit from "../components/RoutePermit";
import RouteTransport from "../components/RouteTransport";
import { permitQuery } from "../graphql/PermitQuery";
import { routeQuery } from "../graphql/RouteQuery";
import { transportOfRouteQuery } from "../graphql/TransportQuery";
import IPermit from "../interfaces/IPermit";
import IPermitDetail from "../interfaces/IPermitDetail";
import IRoute from "../interfaces/IRoute";
import IRouteDetail from "../interfaces/IRouteDetail";
import ITransportDetail from "../interfaces/ITransportDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import ITransport from "../interfaces/ITransport";

interface RouteDetailProps {
  routeId: string;
  permitId: string;
}

const RouteDetail = ({ match }: RouteComponentProps<RouteDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedPermitDetail, selectedRouteDetail, selectedTransportDetail } = crossingsState;
  const { permitNumber } = selectedPermitDetail || {};
  const { name = "", routeBridges = [] } = selectedRouteDetail || {};

  const {
    params: { routeId, permitId },
  } = match;

  useQuery<IPermitDetail>(permitQuery(Number(permitId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_PERMIT, payload: response }),
    onError: (err) => console.error(err),
  });

  useQuery<ITransportDetail>(transportOfRouteQuery(Number(permitId), Number(routeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_TRANSPORT, payload: response }),
    onError: (err) => console.error(err),
  });

  useQuery<IRouteDetail>(routeQuery(Number(routeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_ROUTE, payload: response }),
    onError: (err) => console.error(err),
  });

  return (
    <IonPage>
      <Header title={`${permitNumber} - ${name}`} />
      <IonContent>
        <RoutePermit selectedPermit={selectedPermitDetail as IPermit} selectedRoute={selectedRouteDetail as IRoute} />
        <RouteTransport selectedTransport={selectedTransportDetail as ITransport} />

        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <IonCheckbox />
            </IonCol>
            <IonCol>
              <IonText>{t("route.transportValid")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <BridgeCardList routeBridges={routeBridges} />
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
