import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { location } from "ionicons/icons";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import { actions as crossingActions } from "../store/crossingsSlice";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import { routeBridgeQuery } from "../graphql/RouteBridgeQuery";

interface BridgeDetailProps {
  routeBridgeId: string;
}

const BridgeDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { routeBridgeId } = useParams<BridgeDetailProps>();

  const { selectedBridgeDetail, selectedPermitDetail } = useTypedSelector((state) => state.crossingsReducer);
  const { bridge, crossingInstruction = "" } = selectedBridgeDetail || {};
  const { name = "", identifier = "", municipality = "" } = bridge || {};
  const { permitNumber } = selectedPermitDetail || {};

  const [conformsToPermit, setConformsToPermit] = React.useState(false);

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
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <img src="assets/bridge.jpg" alt="" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{identifier}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonRouterLink routerLink={`/bridgemap/${routeBridgeId}`}>
                      <IonIcon icon={location} />
                      <IonText className="linkText">{` ${name}, ${municipality}`}</IonText>
                    </IonRouterLink>
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
                <IonRow>
                  <IonCol>
                    <IonLabel class="crossingLabel">
                      {t("bridgeDetail.permitNumber")} {permitNumber}
                    </IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem key="conforms2">
                      <IonCheckbox slot="start" value="conforms" checked={conformsToPermit} onClick={() => setConformsToPermit(!conformsToPermit)} />
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
            <IonButton color="primary" routerLink={`/denyCrossing/${routeBridgeId}`}>
              {t("bridgeDetail.denyCrossing")}
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton disabled={!conformsToPermit} color="primary" routerLink={`/crossing/${routeBridgeId}`}>
              {t("bridgeDetail.startSupervision")}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
