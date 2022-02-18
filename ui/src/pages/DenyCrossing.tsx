import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import { useTypedSelector } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import PermitLinkItem from "../components/PermitLinkItem";
import IDenyCrossingInput from "../interfaces/IDenyCrossingInput";
import IPermit from "../interfaces/IPermit";
import { onRetry } from "../utils/backendData";
import { denyCrossing, getSupervision } from "../utils/supervisionBackendData";
import { SupervisionStatus } from "../utils/constants";

interface DenyCrossingProps {
  supervisionId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<DenyCrossingProps>();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.rootReducer);

  const [denyReason, setDenyReason] = useState<string | undefined>(undefined);
  const [otherReasonSelected, setOtherReasonSelected] = useState<boolean>(false);

  const tFI = i18n.getFixedT("fi"); // Save fixed deny reason options always in the same language to DB
  const transportWontCross = tFI("denyCrossing.transportWontCross");
  const obstacleOnBridge = tFI("denyCrossing.obstacleOnBridge");
  const otherReason = "other";

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );

  const denyCrossingMutation = useMutation((denyCrossingInput: IDenyCrossingInput) => denyCrossing(denyCrossingInput, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(["getSupervision", supervisionId], data);
      history.goBack();
    },
  });
  const { isLoading: isSendingDenyCrossing } = denyCrossingMutation;

  const { routeBridge, currentStatus } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const { route, bridge } = routeBridge || {};
  const { name = "", identifier = "" } = bridge || {};
  const { permit } = route || {};

  const supervisionPending =
    !isLoadingSupervision && (supervisionStatus === SupervisionStatus.PLANNED || supervisionStatus === SupervisionStatus.CANCELLED);

  const radioClicked = (radioValue: string) => {
    if (radioValue === otherReason) {
      setOtherReasonSelected(true);
      setDenyReason("");
    } else {
      setOtherReasonSelected(false);
      setDenyReason(radioValue);
    }
  };

  const textAreaChanged = (textValue: string) => {
    if (otherReasonSelected) {
      setDenyReason(textValue);
    }
  };

  const denyCrossingClicked = () => {
    if (denyReason) {
      const denyCrossingInput: IDenyCrossingInput = { supervisionId: Number(supervisionId), denyReason: denyReason };
      denyCrossingMutation.mutate(denyCrossingInput);
    }
  };

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} includeSendingList />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <PermitLinkItem permit={permit as IPermit} isHeader />

            <IonItem className="header" lines="none" detail detailIcon="">
              <IonLabel className="headingText">{t("supervision.bridgeName")}</IonLabel>
              <IonLabel>
                {name} | {identifier}
              </IonLabel>
            </IonItem>

            <IonItem lines="none">
              <IonLabel className="headingText">{t("denyCrossing.cantCross")}</IonLabel>
            </IonItem>

            <IonList>
              <IonRadioGroup onIonChange={(e) => radioClicked(e.detail.value)}>
                <IonListHeader>
                  <IonLabel>{t("denyCrossing.whyCantCross")}</IonLabel>
                </IonListHeader>
                <IonItem>
                  <IonLabel>{t("denyCrossing.transportWontCross")}</IonLabel>
                  <IonRadio value={transportWontCross} disabled={!supervisionPending} />
                </IonItem>
                <IonItem>
                  <IonLabel>{t("denyCrossing.obstacleOnBridge")}</IonLabel>
                  <IonRadio value={obstacleOnBridge} disabled={!supervisionPending} />
                </IonItem>
                <IonItem>
                  <IonLabel>{t("denyCrossing.other")}</IonLabel>
                  <IonRadio value={otherReason} disabled={!supervisionPending} />
                </IonItem>
              </IonRadioGroup>
              {otherReasonSelected && (
                <IonItem lines="none">
                  <IonTextarea
                    placeholder={t("denyCrossing.placeholder")}
                    disabled={!supervisionPending}
                    onIonChange={(e) => {
                      return textAreaChanged(e.detail.value ?? "");
                    }}
                  />
                </IonItem>
              )}
            </IonList>

            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton
                    color="primary"
                    expand="block"
                    size="large"
                    disabled={isLoadingSupervision || isSendingDenyCrossing || !supervisionPending || !denyReason}
                    onClick={() => denyCrossingClicked()}
                  >
                    {t("common.buttons.send")}
                  </IonButton>
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
