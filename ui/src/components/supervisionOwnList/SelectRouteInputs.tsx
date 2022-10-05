import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import SelectRouteInput from "./SelectRouteInput";
import OwnListPermitRouteType from "./OwnListPermitRouteType";
import { useTranslation } from "react-i18next";

interface SelectRouteInputsProps {
  permitRoutes: Array<OwnListPermitRouteType>;
  toNextPhase: (permitRoutes: Array<OwnListPermitRouteType>) => void;
  toPreviousPhase: () => void;
}

const SelectRouteInputs = ({ permitRoutes, toNextPhase, toPreviousPhase }: SelectRouteInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const [continueButtonDisabled, setContinueButtonDisabled] = useState<boolean>(true);

  const setContinueButtonState = () => {
    if (
      permitRoutes.findIndex((pr) => {
        return pr.selectedRouteIndex === null;
      }) < 0
    ) {
      setContinueButtonDisabled(false);
    } else {
      setContinueButtonDisabled(true);
    }
  };

  const setPermitNumber = (index: number, routeIndex: number) => {
    permitRoutes[index].selectedRouteIndex = routeIndex;
    setContinueButtonState();
  };

  const done = () => {
    toNextPhase(permitRoutes);
  };

  return (
    <>
      {permitRoutes.map((permitRoute, i) => (
        <IonGrid key={"permit_" + i}>
          <IonRow>
            <IonCol>
              <IonText>
                {t("supervisionOwnList.addModal.routeSelectInput.permitLabel")} {permitRoute.permitNumber}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <SelectRouteInput key={i} index={i} routes={permitRoute.routes} onChange={setPermitNumber} />
            </IonCol>
          </IonRow>
        </IonGrid>
      ))}

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol class="ion-button ion-float-left">
            <IonButton onClick={toPreviousPhase}>{t("supervisionOwnList.addModal.routeSelectInput.cancelButtonLabel")}</IonButton>
          </IonCol>
          <IonCol>
            <IonButton class="ion-button ion-float-right" onClick={done} disabled={continueButtonDisabled}>
              {t("supervisionOwnList.addModal.routeSelectInput.continueButtonLabel")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default SelectRouteInputs;
