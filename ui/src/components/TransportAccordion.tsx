import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import IPermit from "../interfaces/IPermit";

interface TransportAccordionProps {
  permit: IPermit;
}

const TransportAccordion = ({ permit }: TransportAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { transportDimensions, transportTotalMass = 0, vehicles = [], axles = [] } = permit || {};
  const { height = 0, width = 0, length = 0 } = transportDimensions || {};

  return (
    <CustomAccordion
      items={[
        {
          uuid: "transport",
          heading: <IonText>{t("route.transportInfo.title")}</IonText>,
          panel: (
            <div>
              <IonItem>
                <IonLabel>{t("route.transportInfo.registrationNumbers")}</IonLabel>
                <IonLabel>{vehicles.map((v) => v.identifier).join(", ")}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>{t("route.transportInfo.dimensions")}</IonLabel>
                <IonLabel>
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol>
                        <IonText>{`${t("route.transportInfo.height")} ${height} m`}</IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonText>{`${t("route.transportInfo.width")} ${width} m`}</IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonText>{`${t("route.transportInfo.length")} ${length} m`}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>{t("route.transportInfo.transportTotalMass")}</IonLabel>
                <IonLabel>{`${transportTotalMass} t`}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>{t("route.transportInfo.axleWeightsDistances")}</IonLabel>
                <IonLabel>
                  <IonGrid className="ion-no-padding">
                    {[...axles]
                      .sort((a, b) => a.axleNumber - b.axleNumber)
                      .map((axle, index) => {
                        const key = `axle_${index}`;
                        return (
                          <IonRow key={key}>
                            <IonCol>
                              <IonText>{`${axle.axleNumber}: ${axle.weight} t${
                                axle.distanceToNext > 0 ? ` - ${axle.distanceToNext} m` : ""
                              }`}</IonText>
                            </IonCol>
                          </IonRow>
                        );
                      })}
                  </IonGrid>
                </IonLabel>
              </IonItem>
            </div>
          ),
        },
      ]}
    />
  );
};

export default TransportAccordion;
