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
  const [selectedIds, setSelectedIds] = useState<Array<Array<number>>>([]);
  const setSelectedRouteBridgeIds = (index: number, routeBridgeIds: Array<number>) => {
    selectedIds[index] = routeBridgeIds;
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
    await saveToOwnlist(username, supervisionIds, dispatch);
    const ownlist = await getOwnlist(username, dispatch);

    //prefetch supervisions in ownlist so they can be done offline
    prefetchSupervisionsNoPasscodeWithIds(ownlist, queryClient, dispatch);

    updateOwnlistPage();
    closeModal();
  };

  const hasOnlyEmptyArrays = (ids: Array<Array<number>>) => {
    console.log(ids);
    ids.forEach((s) => {
      console.log(s.length);
      if (s.length > 0) {
        return false;
      }
    });
    return true;
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
            <IonButton
              class="ion-button ion-float-right"
              onClick={done}
              disabled={isLoadingUser || !selectedIds || selectedIds.length === 0 || hasOnlyEmptyArrays(selectedIds)}
            >
              {t("supervisionOwnList.addModal.bridgeSelectInput.saveButtonLabel")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default SelectBridgeInputs;
