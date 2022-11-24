import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonIcon, IonLabel, IonRow, IonText } from "@ionic/react";
import SelectRouteInput from "./SelectRouteInput";
import OwnListPermitRouteType from "./OwnListPermitRouteType";
import { useTranslation } from "react-i18next";
import arrowRight from "../../theme/icons/arrow-right_white.svg";
import arrowLeft from "../../theme/icons/arrow-left_white.svg";

interface SelectRouteInputsProps {
  permitRoutes: Array<OwnListPermitRouteType>;
  toNextPhase: (permitRoutes: Array<OwnListPermitRouteType>) => void;
  toPreviousPhase: () => void;
}

const SelectRouteInputs = ({ permitRoutes, toNextPhase, toPreviousPhase }: SelectRouteInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const [continueButtonDisabled, setContinueButtonDisabled] = useState<boolean>(
    permitRoutes.findIndex((pr) => {
      return pr.selectedRouteIndex === null;
    }) >= 0
  );

  const setContinueButtonState = () => {
    setContinueButtonDisabled(
      permitRoutes.findIndex((pr) => {
        return pr.selectedRouteIndex === null;
      }) >= 0
    );
  };

  const setSelectedRouteIndex = (index: number, routeIndex: number) => {
    permitRoutes[index].selectedRouteIndex = routeIndex;
    console.log("hello");
    console.log(permitRoutes);
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
              <IonLabel className="headingText">{t("supervisionOwnList.addModal.routeSelectInput.permitLabel")}</IonLabel>
            </IonCol>
            <IonCol className="ion-text-left" size="8">
              <IonText>{permitRoute.permitNumber}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel className="headingText">{t("supervisionOwnList.addModal.routeSelectInput.routeLabel")}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <SelectRouteInput
                key={i}
                permitIndex={i}
                routes={permitRoute.routes}
                selectedRouteIndex={permitRoute.selectedRouteIndex}
                onChange={setSelectedRouteIndex}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      ))}

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol class="ion-button ion-float-left">
            <IonButton onClick={toPreviousPhase} color="secondary">
              <IonIcon className="otherIcon" icon={arrowLeft} />
              {t("supervisionOwnList.addModal.routeSelectInput.cancelButtonLabel")}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton class="ion-button ion-float-right" onClick={done} disabled={continueButtonDisabled}>
              {t("supervisionOwnList.addModal.routeSelectInput.continueButtonLabel")}
              <IonIcon className="otherIcon" icon={arrowRight} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default SelectRouteInputs;
