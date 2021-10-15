import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonPage, IonRow, IonTextarea } from "@ionic/react";
import { document } from "ionicons/icons";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { getPermitOfRouteBridge, getRouteBridge, onRetry } from "../utils/supervisionBackendData";

interface DenyCrossingProps {
  routeBridgeId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { routeBridgeId = "0" } = useParams<DenyCrossingProps>();

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { permitNumber = "" } = selectedPermitDetail || {};
  const { bridge } = selectedBridgeDetail || {};
  const { name = "", identifier = "" } = bridge || {};

  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), { retry: onRetry });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
  });

  const noNetworkNoData =
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) || (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  // TODO - send deny reason to backend
  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getRouteBridge} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <IonItem className="header" detailIcon={document} lines="none">
              <IonLabel className="headingText">{t("supervision.permitNumber")}</IonLabel>
              <IonLabel>{permitNumber}</IonLabel>
            </IonItem>
            <IonItem className="header" lines="none">
              <IonLabel>{t("supervision.bridgeName")}</IonLabel>
              <IonLabel>
                {name} | {identifier}
              </IonLabel>
            </IonItem>

            <IonItem lines="none">
              <IonLabel className="headingText">{t("denyCrossing.cantCross")}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>{t("denyCrossing.whyCantCross")}</IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea placeholder={t("supervision.report.placeholder")} />
            </IonItem>

            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonCol>
                    <IonButton color="primary">{`${t("common.buttons.send")} (TODO)`}</IonButton>
                  </IonCol>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton color="secondary" onClick={() => history.goBack()}>
                    {t("common.buttons.cancel")}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DenyCrossing;
