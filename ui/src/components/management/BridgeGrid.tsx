import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRouteBridge from "../../interfaces/IRouteBridge";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import "./BridgeGrid.css";

interface BridgeGridProps {
  routeBridges: IRouteBridge[];
  supervisions: ISupervision[];
  supervisors: ISupervisor[];
}

const BridgeGrid = ({ routeBridges = [], supervisions = [], supervisors = [] }: BridgeGridProps): JSX.Element => {
  const { t } = useTranslation();

  const supervisorSelect = (value?: ISupervisor) => (
    <IonSelect interface="action-sheet" value={value?.id}>
      {supervisors.map((supervisor) => {
        const { id, firstName, lastName } = supervisor;
        const key = `supervisor_${id}`;
        return (
          <IonSelectOption key={key} value={id}>
            {`${firstName} ${lastName}`}
          </IonSelectOption>
        );
      })}
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

      {routeBridges.map((routeBridge, index) => {
        const { bridge } = routeBridge;
        const { identifier, name } = bridge;
        const bridgeName = `${identifier} - ${name}`;
        const supervision = supervisions.find((s) => s.routeBridgeId);
        const { plannedTime, supervisorType, supervisors: supervisionSupervisors = [] } = supervision || {};
        const estimatedCrossingTime = moment(plannedTime);
        const supervisor1 = supervisionSupervisors.find((s) => s.priority === 1);
        const supervisor2 = supervisionSupervisors.find((s) => s.priority === 2);
        const key = `bridge_${index}`;

        return (
          <IonRow key={key}>
            <IonCol size="12" size-lg="4" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol>
                    <IonText className="ion-hide-lg-down">{bridgeName}</IonText>
                    <IonText className="headingText ion-hide-lg-up">{bridgeName}</IonText>
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
                    <DatePicker value={estimatedCrossingTime.toDate()} />
                  </IonCol>
                  <IonCol>
                    <TimePicker value={estimatedCrossingTime.toDate()} />
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
