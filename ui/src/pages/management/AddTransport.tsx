import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonButton, IonCol, IonContent, IonGrid, IonItemDivider, IonPage, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import BridgeGrid from "../../components/management/BridgeGrid";
import RouteInfo from "../../components/management/RouteInfo";
import TransportInfo from "../../components/management/TransportInfo";
import { useTypedSelector } from "../../store/store";
import { getPermit, onRetry } from "../../utils/backendData";
import { DATE_FORMAT } from "../../utils/constants";

interface AddTransportProps {
  permitId: string;
}

const AddTransport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedPermitDetail,
    networkStatus: { isFailed = {} },
  } = crossings;
  const { permitNumber, validStartDate, validEndDate } = selectedPermitDetail || {};
  const { permitId = "0" } = useParams<AddTransportProps>();

  useQuery(["getPermit", permitId], () => getPermit(Number(permitId), dispatch, selectedPermitDetail), { retry: onRetry });

  const noNetworkNoData = isFailed.getPermit && selectedPermitDetail === undefined;

  const mockData = {
    transportId: 4,
  };

  return (
    <IonPage>
      <Header title={t("management.addTransport.headerTitle")} somethingFailed={isFailed.getPermit} />
      <IonContent fullscreen color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <IonGrid className="ion-no-padding" fixed>
            <IonRow>
              <IonCol className="whiteBackground">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
                    <IonCol size="12" size-sm="4" size-lg="2">
                      <IonText className="headingText">{t("management.addTransport.transportPermit")}</IonText>
                    </IonCol>
                    <IonCol size="12" size-sm="8" size-lg="2">
                      <IonText>{permitNumber}</IonText>
                    </IonCol>

                    <IonCol size="12" size-sm="4" size-lg="2">
                      <IonText className="headingText">{t("management.addTransport.validityPeriod")}</IonText>
                    </IonCol>
                    <IonCol size="12" size-sm="8" size-lg="3">
                      <IonText>{`${moment(validStartDate).format(DATE_FORMAT)} - ${moment(validEndDate).format(DATE_FORMAT)}`}</IonText>
                    </IonCol>

                    <IonCol size="12" size-sm="4" size-lg="2">
                      <IonText className="headingText">{t("management.addTransport.transportId")}</IonText>
                    </IonCol>
                    <IonCol size="12" size-sm="8" size-lg="1">
                      <IonText>{mockData.transportId}</IonText>
                    </IonCol>
                  </IonRow>

                  <IonItemDivider />

                  <IonRow className="ion-margin">
                    <IonCol>
                      <IonText className="headingText">{t("management.addTransport.transportInformation")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-margin">
                    <IonCol>
                      <RouteInfo />
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin">
                    <IonCol>
                      <TransportInfo />
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin">
                    <IonCol>
                      <IonText className="headingText">{t("management.addTransport.bridgesToSupervise")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-margin">
                    <IonCol>
                      <BridgeGrid />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin ion-justify-content-end">
              <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
                <IonButton color="tertiary">
                  <IonText>{t("management.addTransport.buttons.deleteTransport")}</IonText>
                </IonButton>
              </IonCol>
              <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
                <IonButton color="secondary">
                  <IonText>{t("common.buttons.cancel")}</IonText>
                </IonButton>
              </IonCol>
              <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
                <IonButton color="primary">
                  <IonText>{t("common.buttons.save")}</IonText>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddTransport;
