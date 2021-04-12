import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, IonCheckbox, IonLabel, IonItem } from "@ionic/react";
import React from "react";
import {useMutation, useQuery} from "@apollo/client";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import routeQuery from "../graphql/RouteQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import BridgeCardList from "../components/BridgeCardList";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import bridgeQuery from "../graphql/BridgeQuery";
import IRadioValue from "../interfaces/IRadioValue";
import ICrossingDetail from "../interfaces/ICrossingDetails";
import {startCrossingMutation} from "../graphql/CrossingMutation";

interface BridgeDetailProps {
  id: string;
}

const BridgeDetail = ({ match }: RouteComponentProps<BridgeDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedBridgeDetail, selectedRouteDetail, selectedPermitDetail, selectedCrossingDetail } = crossingsState;
  const { name = "", id } = selectedBridgeDetail || {};
  const { id: routeId } = selectedRouteDetail || {};
  const { permitNumber } = selectedPermitDetail || {};
  const { conformsToPermit } = selectedCrossingDetail || {};
  const {
    params: { id: bridgeId },
  } = match;

  useQuery<IBridgeDetail>(bridgeQuery(Number(bridgeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_BRIDGE, payload: response }),
    onError: (err) => console.error(err),
  });

  const [conformsToPermit, { data }] = useMutation<ICrossingDetail>(conformsToPermitMutation, {
    onCompleted: (response) => dispatch({ type: crossingActions.CONFORMS_TO_CHANGED, payload: true }),
    onError: (err) => console.error(err),
  });

  const [nonconformsToPermit, { data }] = useMutation<ICrossingDetail>(nonconformsToPermitMutation, {
    onCompleted: (response) => dispatch({ type: crossingActions.CONFORMS_TO_CHANGED, payload: false }),
    onError: (err) => console.error(err),
  });

  function checkBoxClicked(checkBoxName: string, checkBoxValue: boolean) {
    console.log(`check:${checkBoxName}${checkBoxValue}`);
    dispatch({ type: crossingActions.CONFORMS_TO_CHANGED, payload: checkBoxValue });
  }

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
                      <p>TODO</p>
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
                <IonRow>
                  <IonCol>
                    <IonLabel class="crossingLabel">
                      {t("bridgeDetail.permitNumber")} {permitNumber}
                    </IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem key="bendings">
                      <IonCheckbox slot="start" value="conforms" checked={conformsToPermit} onClick={() => checkBoxClicked("conformsTo", true)} />
                      <IonLabel>{t("bridgeDetail.conformsToPermit")}</IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonButton color="primary" routerLink={`/denyCrossing/${routeId}/${id}`}>
              {t("bridgeDetail.denyCrossing")}
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton color="primary" routerLink={`/supervision/${routeId}/${id}`}>
              {t("bridgeDetail.startSupervision")}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
