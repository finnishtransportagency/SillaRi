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
import { useTypedSelector, RootState } from "../store/store";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import PermitLinkItem from "../components/PermitLinkItem";
import IDenyCrossingInput from "../interfaces/IDenyCrossingInput";
import IPermit from "../interfaces/IPermit";
import ISupervision from "../interfaces/ISupervision";
import { onRetry } from "../utils/backendData";
import { denyCrossing, getSupervision } from "../utils/supervisionBackendData";
import { SupervisionStatus } from "../utils/constants";
import { removeSupervisionFromRouteTransportList } from "../utils/supervisionUtil";

interface DenyCrossingProps {
  supervisionId: string;
}

const DenyCrossing = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { supervisionId = "0" } = useParams<DenyCrossingProps>();
  const supervisionQueryKey = ["getSupervision", Number(supervisionId)];

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const [denyReason, setDenyReason] = useState<string | undefined>(undefined);
  const [otherReasonSelected, setOtherReasonSelected] = useState<boolean>(false);

  const tFI = i18n.getFixedT("fi"); // Save fixed deny reason options always in the same language to DB
  const transportWontCross = tFI("denyCrossing.transportWontCross");
  const obstacleOnBridge = tFI("denyCrossing.obstacleOnBridge");
  const otherReason = "other";

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    supervisionQueryKey,
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
    }
  );

  const { routeTransportId = "0" } = supervision || {};

  // Set-up mutations for modifying data later
  // Note: retry is needed here so the mutation is queued when offline and doesn't fail due to the error
  const denyCrossingMutation = useMutation((denyCrossingInput: IDenyCrossingInput) => denyCrossing(denyCrossingInput, dispatch), {
    retry: onRetry,
    onMutate: async () => {
      // onMutate fires before the mutation function

      // Cancel any outgoing refetches so they don't overwrite the optimistic update below
      await queryClient.cancelQueries(supervisionQueryKey);

      // Set the current status to CROSSING_DENIED here since the backend won't be called yet when offline
      queryClient.setQueryData<ISupervision>(supervisionQueryKey, (oldData) => {
        return {
          ...oldData,
          currentStatus: { ...oldData?.currentStatus, status: SupervisionStatus.CROSSING_DENIED },
        } as ISupervision;
      });

      // Since onSuccess doesn't fire when offline, the page transition needs to be done here instead
      // Also remove the finished supervision from the route transport list in the UI
      // invalidateOfflineData(queryClient, dispatch);
      removeSupervisionFromRouteTransportList(queryClient, String(routeTransportId), supervisionId);
      history.goBack();
    },
    onSuccess: (data) => {
      // onSuccess doesn't fire when offline due to the retry option, but should fire when online again

      // Update "getSupervision" query to return the updated data
      queryClient.setQueryData(supervisionQueryKey, data);
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
