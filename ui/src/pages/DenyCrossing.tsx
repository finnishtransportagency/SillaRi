import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, IonTextarea } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { getRouteBridge, onRetry } from "../utils/backendData";

interface DenyCrossingProps {
  routeBridgeId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { routeBridgeId = "0" } = useParams<DenyCrossingProps>();

  const {
    selectedBridgeDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);
  const { bridge } = selectedBridgeDetail || {};
  const { name = "" } = bridge || {};

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), { retry: onRetry });

  const noNetworkNoData = isFailed.getRouteBridge && selectedBridgeDetail === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getRouteBridge} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
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
                <IonCard>
                  <IonTextarea />
                </IonCard>
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
        )}
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
