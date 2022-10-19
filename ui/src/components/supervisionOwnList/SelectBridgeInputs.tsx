import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import SelectBridgeInput from "./SelectBridgeInput";
import OwnListPermitRouteType from "./OwnListPermitRouteType";
import { useTranslation } from "react-i18next";
import { OWNLIST_STORAGE_GROUP } from "../../utils/constants";
import { Preferences } from "@capacitor/preferences";

interface SelectBridgeInputsProps {
  permitRoutes: Array<OwnListPermitRouteType>;
  toPreviousPhase: () => void;
}

const SelectBridgeInputs = ({ permitRoutes, toPreviousPhase }: SelectBridgeInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
  const setSelectedRouteBridgeIds = (index: number, routeBridgeIds: Array<number>) => {
    // TODO: Save selected route bridge ids
    setSelectedIds(routeBridgeIds);
  };

  const getSelectedRouteName = (permitRoute: OwnListPermitRouteType) => {
    if (permitRoute.selectedRouteIndex !== null) {
      return permitRoute.routes[permitRoute.selectedRouteIndex].name;
    } else {
      return "";
    }
  };

  const done = () => {
    console.log("DONE" + selectedIds);

    //call backend to inititate supervisions and get their ids to own list keys

    //save ownlist to storage
    Preferences.configure({ group: OWNLIST_STORAGE_GROUP });
    // TODO: Save all selected route bridges into permanent own list
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
            <IonButton class="ion-button ion-float-right" onClick={done}>
              {t("supervisionOwnList.addModal.bridgeSelectInput.saveButtonLabel")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default SelectBridgeInputs;
