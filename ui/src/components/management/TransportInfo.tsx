import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import CustomAccordion from "../common/CustomAccordion";

const TransportInfo = (): JSX.Element => {
  const { t } = useTranslation();

  const mockData = {
    vehicles: [
      {
        type: "Kuorma-auto",
        identifier: "ABC-123",
      },
      {
        type: "Vetoauto",
        identifier: "DEF-456",
      },
      {
        type: "Perävaunu",
        identifier: "GHI-789",
      },
    ],
    transportTotalMass: 93,
    transportDimensions: {
      height: 4.5,
      width: 3.48,
      length: 25,
    },
  };

  return (
    <CustomAccordion
      items={[
        {
          uuid: "transportInfo",
          heading: (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonText className="headingText">{t("management.addTransport.transportInfo.title")}</IonText>
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
                        <IonText className="headingText">{t("management.addTransport.transportInfo.dimensions")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonGrid className="ion-no-padding">
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.addTransport.transportInfo.height")} ${mockData.transportDimensions.height} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.addTransport.transportInfo.width")} ${mockData.transportDimensions.width} m`}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol>
                              <IonText>{`${t("management.addTransport.transportInfo.length")} ${mockData.transportDimensions.length} m`}</IonText>
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
                        <IonText className="headingText">{t("management.addTransport.transportInfo.totalMass")}</IonText>
                      </IonCol>
                      <IonCol size="12" size-sm="6">
                        <IonText>{`${mockData.transportTotalMass} t`}</IonText>
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

export default TransportInfo;
