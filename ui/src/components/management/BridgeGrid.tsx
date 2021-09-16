import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import "./BridgeGrid.css";

const BridgeGrid = (): JSX.Element => {
  const { t } = useTranslation();

  const mockData = [
    {
      name: "Joutsensalmen I silta, O-1234 Joutsa",
      supervisorType: "own",
      supervisor1: "user1",
      supervisor2: "user2",
    },
    {
      name: "Sillannimi 123 silta, O-1231 Paikkakunta",
      supervisorType: "contractor",
    },
    {
      name: "Sillannimi 456 silta, O-4567 Paikkakunta",
      supervisorType: "own",
    },
  ];

  const supervisorSelect = (value?: string) => (
    <IonSelect interface="action-sheet" value={value}>
      <IonSelectOption value="user1">Saara Sillanvalvoja</IonSelectOption>
      <IonSelectOption value="user2">Ville Varavalvoja</IonSelectOption>
    </IonSelect>
  );

  return (
    <IonGrid className="bridgeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.addTransport.bridgeInfo.bridge").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.addTransport.bridgeInfo.estimatedCrossingTime").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.addTransport.bridgeInfo.bridgeSupervisor").toUpperCase()}</IonText>
        </IonCol>
      </IonRow>

      {mockData.map((bridge, index) => {
        const { name, supervisorType, supervisor1, supervisor2 } = bridge;
        const key = `bridge_${index}`;

        return (
          <IonRow key={key}>
            <IonCol size="12" size-lg="4" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol>
                    <IonText className="ion-hide-lg-down">{name}</IonText>
                    <IonText className="headingText ion-hide-lg-up">{name}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="4" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.addTransport.bridgeInfo.estimatedCrossingTime")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <DatePicker value={moment().toDate()} />
                  </IonCol>
                  <IonCol>
                    <TimePicker value={moment().toDate()} />
                  </IonCol>
                </IonRow>

                <IonRow className="ion-margin-top">
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.addTransport.bridgeInfo.bridgeSupervisors")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonRadioGroup name="supervisorType" value={supervisorType}>
                      <IonItem lines="none">
                        <IonRadio slot="start" value="own" />
                        <IonLabel>{t("management.addTransport.bridgeInfo.ownSupervisor")}</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio slot="start" value="contractor" />
                        <IonLabel>{t("management.addTransport.bridgeInfo.contractor")}</IonLabel>
                      </IonItem>
                    </IonRadioGroup>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="4" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.addTransport.bridgeInfo.supervisor1")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-align-items-center">
                  <IonCol size="1" className="ion-hide-lg-down">
                    <IonText>1.</IonText>
                  </IonCol>
                  <IonCol>{supervisorSelect(supervisor1)}</IonCol>
                </IonRow>

                <IonRow className="ion-margin-top">
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.addTransport.bridgeInfo.supervisor2")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-align-items-center">
                  <IonCol size="1" className="ion-hide-lg-down">
                    <IonText>2.</IonText>
                  </IonCol>
                  <IonCol>{supervisorSelect(supervisor2)}</IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        );
      })}
    </IonGrid>
  );
};

export default BridgeGrid;
