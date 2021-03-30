import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import routeQuery from "../graphql/RouteQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import BridgeCardList from "../components/BridgeCardList";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import bridgeQuery from "../graphql/BridgeQuery";

interface BridgeDetailProps {
  id: string;
}

const BridgeDetail = ({ match }: RouteComponentProps<BridgeDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedBridgeDetail } = crossingsState;
  const { name = "", id } = selectedBridgeDetail || {};
  const {
    params: { id: bridgeId },
  } = match;

  useQuery<IBridgeDetail>(bridgeQuery(Number(bridgeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_BRIDGE, payload: response }),
    onError: (err) => console.error(err),
  });

  return (
    <IonPage>
      <Header title={name} />
      <IonContent>
        <div className="cardListContainer" />
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonText>{name}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{t("crossing.crossingInstructions")}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton color="primary" routerLink={`/supervision/${id}`}>
          Aloita valvonta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
