import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import CustomAccordion from "../common/CustomAccordion";
import IPermit from "../../interfaces/IPermit";

interface TransportInfoAccordionProps {
  permit: IPermit;
}

const TransportInfoAccordion = ({ permit }: TransportInfoAccordionProps): JSX.Element => {
  const { t } = useTranslation();

  const { transportDimensions, transportTotalMass: totalMass = 0 } = permit || {};
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
                  <IonText className="headingText">{t("management.transportDetail.transportInfo.title")}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ),
          panel: (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" size-lg="6">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="6">
                        <IonText className="headingText">{t("management.transportDetail.transportInfo.dimensions")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonGrid className="ion-no-padding">
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.transportDetail.transportInfo.height")} ${height} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.transportDetail.transportInfo.width")} ${width} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.transportDetail.transportInfo.length")} ${length} m`}</IonText>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="12" size-lg="6">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-margin">
                      <IonCol size="12" size-sm="6">
                        <IonText className="headingText">{t("management.transportDetail.transportInfo.totalMass")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonText>{`${totalMass} t`}</IonText>
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
