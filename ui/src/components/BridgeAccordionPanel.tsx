import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import IRouteBridge from "../interfaces/IRouteBridge";

interface BridgeAccordionPanelProps {
  routeBridges?: IRouteBridge[];
}

const BridgeAccordionPanel = ({ routeBridges = [] }: BridgeAccordionPanelProps): JSX.Element => {
  const { t } = useTranslation();

  const numberOfSupervisions = routeBridges.length;

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin">
        <IonCol size="12" size-sm="6">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="8" size-sm="8" className="ion-text-left">
                {`${t("supervisor.permits")} (${numberOfSupervisions})`}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BridgeAccordionPanel;
