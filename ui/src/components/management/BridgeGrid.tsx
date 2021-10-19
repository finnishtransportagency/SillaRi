import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import { actions as managementActions } from "../../store/managementSlice";
import { useTypedSelector } from "../../store/store";
import { SupervisorType } from "../../utils/constants";
import "./BridgeGrid.css";

interface BridgeGridProps {
  routeTransportId: number;
  supervisors: ISupervisor[];
}

const BridgeGrid = ({ routeTransportId, supervisors = [] }: BridgeGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);
  const { modifiedRouteTransportDetail, selectedRouteOption } = management;
  const { supervisions = [] } = modifiedRouteTransportDetail[routeTransportId] || {};
  const { routeBridges = [] } = selectedRouteOption[routeTransportId] || {};

  const modifySupervisions = (routeBridgeId: number, modifiedSupervision: ISupervision) => {
    // Add the modified supervision for this route bridge id to the supervisions array in place of the existing one
    return supervisions.reduce(
      (acc: ISupervision[], supervision) => {
        return supervision.routeBridgeId === routeBridgeId ? acc : [...acc, supervision];
      },
      [modifiedSupervision]
    );
  };

  const setEstimatedCrossingTime = (supervision: ISupervision, dateTime: Date) => {
    const modifiedSupervision: ISupervision = { ...supervision, plannedTime: dateTime };
    const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

    // dispatch({ type: managementActions.MODIFY_ROUTE_TRANSPORT, payload: { supervisions: modifiedSupervisions } });
    const newDetail = { ...modifiedRouteTransportDetail[routeTransportId], supervisions: modifiedSupervisions };
    dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: newDetail });
  };

  const setSupervisorType = (supervision: ISupervision, supervisorType: SupervisorType) => {
    const modifiedSupervision: ISupervision = { ...supervision, supervisorType };
    const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

    // dispatch({ type: managementActions.MODIFY_ROUTE_TRANSPORT, payload: { supervisions: modifiedSupervisions } });
    const newDetail = { ...modifiedRouteTransportDetail[routeTransportId], supervisions: modifiedSupervisions };
    dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: newDetail });
  };

  const setSupervisor = (supervision: ISupervision, priority: number, supervisorId: number) => {
    const supervisor = supervisors.find((s) => s.id === supervisorId) as ISupervisor;
    const { supervisors: supervisionSupervisors = [] } = supervision;

    // Add the selected supervisor for this route bridge id and priority to the supervisors array in place of the existing one if one exists
    const modifiedSupervisionSupervisors = supervisionSupervisors.reduce(
      (acc, supervisionSupervisor) => {
        return supervisionSupervisor.priority === priority ? acc : [...acc, supervisionSupervisor];
      },
      [{ ...supervisor, priority }]
    );

    const modifiedSupervision: ISupervision = { ...supervision, supervisors: modifiedSupervisionSupervisors };
    const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

    // dispatch({ type: managementActions.MODIFY_ROUTE_TRANSPORT, payload: { supervisions: modifiedSupervisions } });
    const newDetail = { ...modifiedRouteTransportDetail[routeTransportId], supervisions: modifiedSupervisions };
    dispatch({ type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL, payload: newDetail });
  };

  const supervisorSelect = (supervision: ISupervision, priority: number, value?: ISupervisor) => (
    <IonSelect interface="action-sheet" value={value?.id} onIonChange={(e) => setSupervisor(supervision, priority, e.detail.value)}>
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

  // TODO - check bridge list sort order
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

      {[...supervisions]
        .sort((a, b) => a.routeBridgeId - b.routeBridgeId)
        .map((supervision, index) => {
          const routeBridge = routeBridges.find((rb) => rb.id === supervision.routeBridgeId);
          const { bridge } = routeBridge || {};
          const { identifier, name } = bridge || {};
          const bridgeName = `${identifier} - ${name}`;

          const { plannedTime, supervisorType, supervisors: supervisionSupervisors = [] } = supervision;
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
                      <DatePicker value={estimatedCrossingTime.toDate()} onChange={(value) => setEstimatedCrossingTime(supervision, value)} />
                    </IonCol>
                    <IonCol>
                      <TimePicker value={estimatedCrossingTime.toDate()} onChange={(value) => setEstimatedCrossingTime(supervision, value)} />
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin-top">
                    <IonCol size="12" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.addTransport.bridgeInfo.bridgeSupervisors")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonRadioGroup name="supervisorType" value={supervisorType} onIonChange={(e) => setSupervisorType(supervision, e.detail.value)}>
                        <IonItem lines="none">
                          <IonRadio slot="start" value={SupervisorType.OWN_SUPERVISOR} />
                          <IonLabel>{t("management.addTransport.bridgeInfo.ownSupervisor")}</IonLabel>
                        </IonItem>
                        <IonItem lines="none">
                          <IonRadio slot="start" value={SupervisorType.AREA_CONTRACTOR} />
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
                    <IonCol>{supervisorSelect(supervision, 1, supervisor1)}</IonCol>
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
                    <IonCol>{supervisorSelect(supervision, 2, supervisor2)}</IonCol>
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
