import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, IonTextarea } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { routeBridgeQuery } from "../graphql/RouteBridgeQuery";

interface DenyCrossingProps {
  routeBridgeId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { routeBridgeId } = useParams<DenyCrossingProps>();

  const { selectedBridgeDetail } = useTypedSelector((state) => state.crossingsReducer);
  const { bridge } = selectedBridgeDetail || {};
  const { name = "" } = bridge || {};

  useQuery<IBridgeDetail>(routeBridgeQuery(Number(routeBridgeId)), {
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
              <IonText>
                <h5>{t("denyCrossing.cantCross")}</h5>
                <p>{t("denyCrossing.whyCantCross")}</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton color="primary" routerLink={`/bridgeDetail/${routeBridgeId}`}>
                {t("denyCrossing.back")}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="primary">{t("denyCrossing.send")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
