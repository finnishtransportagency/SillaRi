import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import IPermit from "../interfaces/IPermit";
import { capitalizeFirstLetter } from "../utils/stringUtils";

interface TransportInfoAccordionProps {
  permit: IPermit;
}

const TransportInfoAccordion = ({ permit }: TransportInfoAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { transportDimensions, transportTotalMass, vehicles = [] } = permit || {};
  const { height = 0, width = 0, length = 0 } = transportDimensions || {};

  return (
    <CustomAccordion
      items={[
        {
          uuid: "transportInfo",
          heading: (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonText>{t("transportInfo.title")}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ),
          panel: (
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-margin">
                <IonCol size="12" size-lg="6">
                  <IonText className="headingText">{t("transportInfo.subtitle")}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-lg="6">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="6">
                        <IonText className="headingText">{t("transportInfo.vehicles")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonGrid className="ion-no-padding">
                          {vehicles.map((vehicle, index) => {
                            const key = `vehicle${index}`;
                            const { type, identifier } = vehicle || {};

                            return (
                              <IonRow key={key}>
                                <IonCol>
                                  <IonText>{`${capitalizeFirstLetter(type)} ${identifier ? identifier.toUpperCase() : ""}`}</IonText>
                                </IonCol>
                              </IonRow>
                            );
                          })}
                        </IonGrid>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="12" size-lg="6">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="6">
                        <IonText className="headingText">{t("transportInfo.dimensions")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonGrid className="ion-no-padding">
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("transportInfo.height")} ${height} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("transportInfo.width")} ${width} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("transportInfo.length")} ${length} m`}</IonText>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCol>
                    </IonRow>

                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="6">
                        <IonText className="headingText">{t("transportInfo.totalMass")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        {transportTotalMass && <IonText>{`${transportTotalMass} t`}</IonText>}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>
          ),
        },
      ]}
    />
  );
};

export default TransportInfoAccordion;
