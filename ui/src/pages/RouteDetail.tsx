import React from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import { analyticsOutline, documentTextOutline, flagOutline } from "ionicons/icons";
import { useQuery } from "@apollo/client";
import Header from "../components/Header";
import BridgeCardList from "../components/BridgeCardList";
import { authorizationQuery } from "../graphql/AuthorizationQuery";
import { routeQuery } from "../graphql/RouteQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import IAuthorizationDetail from "../interfaces/IAuthorizationDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";

interface RouteDetailProps {
  routeId: string;
  authorizationId: string;
}

const RouteDetail = ({ match }: RouteComponentProps<RouteDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedAuthorizationDetail, selectedRouteDetail } = crossingsState;
  const { permissionId } = selectedAuthorizationDetail || {};
  const { bridges = [], name = "" } = selectedRouteDetail || {};

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
      <Header title={`${permissionId} - ${name}`} />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.permitInfo.title")}</IonText>
            </IonCol>
            <IonCol size="auto">
              <IonIcon icon={analyticsOutline} />
              <IonText>{` ${t("company.route")}`}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.permitNumber")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={documentTextOutline} />
                <IonText>{" PDF"}</IonText>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.routeDeparturePoint")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={flagOutline} />
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.routeArrivalPoint")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={flagOutline} />
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.transportInfo.title")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.registrationNumbers")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.dimensions")}</IonText>
            </IonCol>
            <IonCol>
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.height")} TODO`}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.width")} TODO`}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.length")} TODO`}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.totalMass")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.axleWeightsDistances")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>TODO</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

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

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.bridgesToSupervise")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <BridgeCardList bridges={bridges} />
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
