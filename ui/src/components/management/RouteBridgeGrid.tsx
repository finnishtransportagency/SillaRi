import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import "./BridgeGrid.css";
import IRouteBridge from "../../interfaces/IRouteBridge";

interface RouteBridgeGridProps {
  routeBridges: IRouteBridge[];
}

const RouteBridgeGrid = ({ routeBridges = [] }: RouteBridgeGridProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      {routeBridges.length > 0 ? (
        <>
          <div className="ion-margin-bottom">
            <IonText color="danger">{t("common.validation.transportNumbersUsedInfo")}</IonText>
          </div>
          <IonGrid className="bridgeGrid ion-no-padding">
            <IonRow className="lightBackground ion-hide-lg-down">
              <IonCol size="12" size-lg="5" className="ion-padding">
                <IonText>{t("management.transportDetail.bridgeInfo.bridge").toUpperCase()}</IonText>
              </IonCol>
            </IonRow>

            {[...routeBridges]
              // Sort by routeBridge.ordinal (order of bridges on the route)
              .sort((a, b) => {
                const { ordinal: ordinalA = -1 } = a || {};
                const { ordinal: ordinalB = -1 } = b || {};
                return ordinalA - ordinalB;
              })
              .map((routeBridge) => {
                const { id: routeBridgeId, bridge, contractBusinessId = "" } = routeBridge || {};
                const { identifier, name } = bridge || {};
                const bridgeName = `${identifier} - ${name}`;

                const key = `routeBridge_${routeBridgeId}`;

                return (
                  <IonRow key={key}>
                    <IonCol size="12" size-lg="5" className="ion-padding">
                      <IonGrid className="ion-no-padding">
                        <IonRow>
                          <IonCol>
                            <IonText className="ion-hide-lg-down">{bridgeName}</IonText>
                            <IonText className="headingText ion-hide-lg-up">{bridgeName}</IonText>
                          </IonCol>
                        </IonRow>

                        {contractBusinessId && (
                          <IonRow className="ion-margin-top">
                            <IonCol>
                              <IonText>{`${t("management.transportDetail.bridgeInfo.contractor")}: ${contractBusinessId}`}</IonText>
                            </IonCol>
                          </IonRow>
                        )}
                      </IonGrid>
                    </IonCol>
                  </IonRow>
                );
              })}
          </IonGrid>
        </>
      ) : (
        <IonText>{t("management.transportDetail.bridgeInfo.noBridges")}</IonText>
      )}
    </>
  );
};

export default RouteBridgeGrid;
