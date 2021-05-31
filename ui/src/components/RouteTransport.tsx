import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import IPermit from "../interfaces/IPermit";

interface RouteTransportProps {
  selectedPermit: IPermit;
}

const RouteTransport = ({ selectedPermit }: RouteTransportProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { transportDimensions, totalMass, vehicles = [], axles = [] } = selectedPermit || {};

  return !selectedPermit ? null : (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className="headingText">{t("route.transportInfo.title")} </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText>{t("route.transportInfo.registrationNumbers")}</IonText>
          </IonCol>
          <IonCol>
            <IonText>{vehicles.map((v) => v.identifier).join(", ")}</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>{t("route.transportInfo.dimensions")}</IonText>
          </IonCol>
          <IonCol>
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonText>{`${t("route.transportInfo.height")} ${transportDimensions.height} m`}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonText>{`${t("route.transportInfo.width")} ${transportDimensions.width} m`}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonText>{`${t("route.transportInfo.length")} ${transportDimensions.length} m`}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>{t("route.transportInfo.totalMass")}</IonText>
          </IonCol>
          <IonCol>
            <IonText>{`${totalMass} t`}</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>{t("route.transportInfo.axleWeightsDistances")}</IonText>
          </IonCol>
          <IonCol>
            <IonGrid className="ion-no-padding">
              {[...axles]
                .sort((a, b) => a.axleNumber - b.axleNumber)
                .map((axle, index) => {
                  const key = `axle_${index}`;
                  return (
                    <IonRow key={key}>
                      <IonCol>
                        <IonText>{`${axle.axleNumber}: ${axle.weight} t${axle.distanceToNext > 0 ? ` - ${axle.distanceToNext} m` : ""}`}</IonText>
                      </IonCol>
                    </IonRow>
                  );
                })}
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default RouteTransport;
