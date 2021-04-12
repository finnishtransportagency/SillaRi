import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import { actions as crossingActions } from "../store/crossingsSlice";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import routeBridgeQuery from "../graphql/RouteBridgeQuery";

interface BridgeDetailProps {
  id: string;
}

const BridgeDetail = ({ match }: RouteComponentProps<BridgeDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedBridgeDetail } = crossingsState;
  const { name = "", crossingInstruction = "" } = selectedBridgeDetail || {};
  const {
    params: { id },
  } = match;

  useQuery<IBridgeDetail>(routeBridgeQuery(Number(id)), {
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
                    <img src="assets/bridge.jpg" alt="" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>
                      <h5>{t("bridgeDetail.crossingInstructions")}</h5>
                      <p>{crossingInstruction}</p>
                    </IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>
                      <h5>{t("bridgeDetail.documentingHeader")}</h5>
                      <p>{t("bridgeDetail.documentingParagraph")}</p>
                    </IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>
                      <h5>{t("bridgeDetail.trafficSupervisors")}</h5>
                      <p>TODO</p>
                    </IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonButton color="primary" routerLink={`/supervision/${id}`}>
              {t("bridgeDetail.denyCrossing")}
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton color="primary" routerLink={`/supervision/${id}`}>
              {t("bridgeDetail.startSupervision")}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
