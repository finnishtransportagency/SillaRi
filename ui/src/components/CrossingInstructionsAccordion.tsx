import React from "react";
import {useTranslation} from "react-i18next";
import {IonItem, IonLabel, IonText} from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import IRouteBridge from "../interfaces/IRouteBridge";

interface CrossingInstructionsAccordionProps {
  routeBridge: IRouteBridge;
}

const CrossingInstructionsAccordion = ({ routeBridge }: CrossingInstructionsAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { crossingInstruction = "" } = routeBridge || {};

  // TODO - add crossing instructions
  return (
    <CustomAccordion
      items={[
        {
          uuid: "crossingInstructions",
          heading: <IonText className="headingText">{t("bridge.crossingInstructions.title")}</IonText>,
          panel: (
            <div>
              <IonItem>
                <IonLabel>Tulosssa myöhemmin</IonLabel>
                <IonLabel>{crossingInstruction}</IonLabel>
              </IonItem>
            </div>
          ),
        },
      ]}
    />
  );
};

export default CrossingInstructionsAccordion;
