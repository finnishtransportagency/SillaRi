import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import SelectBridgeInput from "./SelectBridgeInput";
import OwnListPermitRouteType from "./OwnListPermitRouteType";
import { useTranslation } from "react-i18next";
import { initiateSupervisions } from "../../utils/areaContractorBackendData";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { getUserData, onRetry } from "../../utils/backendData";
import { getOwnlist, saveToOwnlist } from "../../utils/ownlistStorageUtil";
import { prefetchSupervisionsNoPasscodeWithIds } from "../../utils/offlineUtil";

interface SelectBridgeInputsProps {
  permitRoutes: Array<OwnListPermitRouteType>;
  toPreviousPhase: () => void;
  updateOwnlistPage: () => void;
  closeModal: () => void;
}

const SelectBridgeInputs = ({ permitRoutes, toPreviousPhase, updateOwnlistPage, closeModal }: SelectBridgeInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
  const setSelectedRouteBridgeIds = (index: number, routeBridgeIds: Array<number>) => {
    setSelectedIds(routeBridgeIds);
  };

  const getSelectedRouteName = (permitRoute: OwnListPermitRouteType) => {
    if (permitRoute.selectedRouteIndex !== null) {
      return permitRoute.routes[permitRoute.selectedRouteIndex].name;
    } else {
      return "";
    }
  };

  const { data: user, isLoading: isLoadingUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const { username = "" } = user || {};

  const queryClient = useQueryClient();

  const done = async () => {
    //call backend to initiate supervisions and get their ids to own list keys
    const supervisionIds = await initiateSupervisions(selectedIds, dispatch);

    //save ownlist to storage
    await saveToOwnlist(username, supervisionIds);
    const ownlist = await getOwnlist(username);

    //prefetch supervisions in ownlist so they can be done offline
    prefetchSupervisionsNoPasscodeWithIds(ownlist, queryClient, dispatch);

    updateOwnlistPage();
    closeModal();
  };

  return (
    <>
      {permitRoutes.map((permitRoute, i) => (
        <IonGrid key={"permit_" + i}>
          <IonRow>
            <IonCol>
              <IonText>
                {t("supervisionOwnList.addModal.bridgeSelectInput.permitLabel")} {permitRoute.permitNumber}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>
                {t("supervisionOwnList.addModal.bridgeSelectInput.routeLabel")} {getSelectedRouteName(permitRoute)}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <SelectBridgeInput
                key={i}
                index={i}
                routes={permitRoute.routes}
                selectedRouteIndex={permitRoute.selectedRouteIndex}
                onChange={setSelectedRouteBridgeIds}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      ))}

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol class="ion-button ion-float-left">
            <IonButton onClick={toPreviousPhase}>{t("supervisionOwnList.addModal.bridgeSelectInput.cancelButtonLabel")}</IonButton>
          </IonCol>
          <IonCol>
            <IonButton class="ion-button ion-float-right" onClick={done} disabled={isLoadingUser || !selectedIds}>
              {t("supervisionOwnList.addModal.bridgeSelectInput.saveButtonLabel")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default SelectBridgeInputs;
