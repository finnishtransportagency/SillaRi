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
import { getSupervision, denyCrossing, onRetry } from "../utils/supervisionBackendData";

interface DenyCrossingProps {
  supervisionId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<DenyCrossingProps>();

  const {
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { routeBridge } = selectedSupervisionDetail || {};
  const { route, bridge } = routeBridge || {};
  const { name = "", identifier = "" } = bridge || {};
  const { permit } = route || {};
  const { permitNumber = "" } = permit || {};

  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  const noNetworkNoData = isFailed.getSupervision && selectedSupervisionDetail === undefined;

  // TODO - send "denyCrossing" and deny reason to backend
  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <IonItem className="header itemIcon" detail detailIcon={document} lines="none">
              <IonLabel className="headingText">{t("supervision.transportPermit")}</IonLabel>
              <IonLabel className="iconText">{permitNumber}</IonLabel>
            </IonItem>
            <IonItem className="header" lines="none">
              <IonLabel className="headingText">{t("supervision.bridgeName")}</IonLabel>
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
                  <IonButton color="primary" expand="block" size="large">{`${t("common.buttons.send")} (TODO)`}</IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton color="tertiary" expand="block" size="large" onClick={() => history.goBack()}>
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
