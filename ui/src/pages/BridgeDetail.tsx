import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
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
import { location } from "ionicons/icons";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { getPermitOfRouteBridge, getRouteBridge, onRetry } from "../utils/backendData";

interface BridgeDetailProps {
  routeBridgeId: string;
}

const BridgeDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { routeBridgeId = "0" } = useParams<BridgeDetailProps>();

  const {
    selectedBridgeDetail,
    selectedPermitDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { bridge, crossingInstruction = "" } = selectedBridgeDetail || {};
  const { name = "", identifier = "", municipality = "" } = bridge || {};
  const { permitNumber } = selectedPermitDetail || {};

  const [conformsToPermit, setConformsToPermit] = React.useState(false);

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch), { retry: onRetry });

  const noNetworkNoData =
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) || (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header title={name} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
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
                          <IonCheckbox
                            slot="start"
                            value="conforms"
                            checked={conformsToPermit}
                            onClick={() => setConformsToPermit(!conformsToPermit)}
                          />
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BridgeDetail;
