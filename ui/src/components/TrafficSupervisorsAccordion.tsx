import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";

const TrafficSupervisorsAccordion = (): JSX.Element => {
  const { t } = useTranslation();

  // TODO - add traffic supervisors
  return (
    <CustomAccordion
      items={[
        {
          uuid: "trafficSupervisors",
          heading: <IonText>{t("bridge.trafficSupervisors.title")}</IonText>,
          panel: (
            <div>
              <IonItem>
                <IonLabel>TODO</IonLabel>
              </IonItem>
            </div>
          ),
        },
      ]}
    />
  );
};

export default TrafficSupervisorsAccordion;
